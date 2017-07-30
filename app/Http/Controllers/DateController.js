'use strict'

const rwc = require('random-weighted-choice')
const requestClient = require('request');
const Env = use('Env')

class DateController {

    constructor() {
        this.yelpBusinessBase = 'https://api.yelp.com/v3/businesses/search?';
        this.eventfulSearchBase = 'http://api.eventful.com/json/events/search?';
        this.dateOptions = [
            'resturants', 
            'active', 
            'arts',
            'nightlife'
        ];
        this.commonParameters = {
            radius: 25000,
            limit: 1
        }
        this.bearerToken = this.checkBearerToken();
        if(this.bearerToken == false) {
            this.bearerToken = fetchBearerToken();
        }
    }

    * index (request, response) {
        yield response.sendView('date')
    }

    * api (request, response) {

        const data = request.all();

        // Validate location
        const location = validateLocation(data)
        if (!location) {
            response.json({message: "Invalid location data"})
        }
        
        //Get date info
        details = planDate(data.date_type, location, data.date)

        var date = {
            date_type: data.date_type,
            location: location,
            details: details
        }
        response.json(date) 
    }

    surpriseMe() {

        var temp;
        var table = [];

        for (i = 0; i < this.dateOptions.length; i++) {
            temp = {weight: 1, id: dateOptions[i]};
            table.push(temp);
        }

        var surprise = rwc(table);
        return surprise
    }

    validateLocation(data) {
        if(data.zip.length == 5) {
            return {type: 'zip', zip: data.zip}
        } else if (data.latitude.length > 1) {
            return {type: 'geo', latitude: data.latitude, longitude: data.longitude}
        } else {
            return false
        }
    }

    planDate(date_type, location, datetime) {
        
        var details = {};

        if(date_type == 'surprise') {
            date_type = this.surpriseMe();
        }

        details.push(this.selectDateLocation(location, date_type))

        return details
    }

    buildUrl(data) {
        let urlParameters = Object.keys(data).map((i) => i+'='+data[i]).join('&');
        const url = this.yelpBusinessBase + urlParameters
        return url
    }

    setLocationParameters(data, location) {
        if(location.type == 'zip') {
            data.location = location.zip 
        } else {
            data.latitude = location.latitude
            data.longitude = location.longitude
        }
    }

    sendYelpRequest(url) {
        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body);  

            return parseYelpRequest(body)
            
        }).auth(null, null, true, this.bearerToken);
    }

    parseYelpRequest(body) {
        var data = body.businesses[0];

    }

    selectDateLocation(location) {
        
        var data = this.commonParameters;
        data.categories = 'restaurants';
        setLocationParameters(data, location);
        const url = buildUrl(data)

        var details = sendYelpRequest(url);
        return details;
    }

    checkBearerToken() {
        
        const expiration = Env.get('YELP_EXPIRATION')
        const currentTime = Date.now()

        if(currentTime - expiration < 15552000000) {
            return Env.get('YELP_TOKEN')
        } else {
            return false
        }

    }

    fetchBearerToken() {

        const currentDate = Date.now()
        const url = 'https://api.yelp.com/oauth2/token'
        request(
            {
                uri: url,
                method: "POST",
                body:
                {
                    grant_type: "client_credentials",
                    client_id: Env.get('YELP_ID'),
                    client_secret: Env.get('YELP_SECRET')
                }
            }, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); 

            Env.set('YELP_EXPIRATION', currentDate)
            Env.set('YELP_TOKEN', body.access_token)
            return true
        });
    }
}

module.exports = DateController
