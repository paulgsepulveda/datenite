'use strict'

const rwc = require('random-weighted-choice');
const requestClient = require('request');
const Env = use('Env');

class DateController {

    constructor() {
        this.yelpBusinessBase = 'https://api.yelp.com/v3/businesses/search?';
        this.dateOptions = [
            'resturants', 
            'active', 
            'arts',
            'nightlife'
        ];
        this.commonParameters = {
            radius: 25000,
            limit: 50
        }
        this.bearerToken = this.checkBearerToken();
        console.log('check bearer token: ' + this.bearerToken)
        if(this.bearerToken == false) {
            this.bearerToken = this.fetchBearerToken();
            console.log('fetched bearer token: ' + this.bearerToken)
        }
    }

    * index (request, response) {
        yield response.sendView('home')
    }

    * api (request, response) {

        const data = request.all();
        var date = {};

        // Validate location
        const location = this.validateLocation(data)
        if (!location) {
            response.json({message: "Invalid location data"})
        }

        // Account for surprise request
        if(data.date_type == 'surprise') {
            data.date_type = this.surpriseMe();
        }

        // Create date object, fill general data and create 
        var date = {
            "date_type": data.date_type,
            "location": location
        }

        var params = this.commonParameters;
        params.categories = data.date_type;
        this.setLocationParameters(params, location);
        const url = this.buildUrl(params);

        this.sendYelpRequest(url, this.bearerToken, this.parseYelpRequest)
            .then(function(result){
                date.details = result
                response.json(date) 
            });
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

    sendYelpRequest(url, bearerToken, parseFunction) {

        return new Promise(function(resolve, reject) {
            requestClient({
                "url": url,
                'auth': {
                    'bearer': bearerToken
                }
            }, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                //console.log('body:', body);  

                resolve(parseFunction(body));
                
            });
        });
        
    }

    parseYelpRequest(body) {
        var list = JSON.parse(body);
        var businessList = list.businesses;
        var temp;
        var table = [];

        for (var i = 0; i < businessList.length; i++) {
            // In the future, an "if" could be used here to filter out undesirable options by rating
            temp = {"weight": 1, "id": i};
            table.push(temp);
        }

        var selectorIndex = rwc(table);
        var selectedBusiness = businessList[selectorIndex];
        console.log("selected business= " + selectedBusiness.name);
        var dateInfo = {
            address: selectedBusiness.location.address1,
            name: selectedBusiness.name,
            source: 'Yelp',
            site_link: selectedBusiness.url,
            image_link: selectedBusiness.image_url,
            lat: selectedBusiness.coordinates.latitude,
            lon: selectedBusiness.coordinates.longitude,
            rating: selectedBusiness.rating,
            reviews: selectedBusiness.review_count
        }
        return dateInfo;
    }

    checkBearerToken() {
        
        const expiration = Env.get('YELP_EXPIRATION', false);
        const currentTime = Date.now();

        if(expiration) {
            if(currentTime - expiration < 15552000000) {
                return Env.get('YELP_TOKEN')
            } else {
                return false
            }
        } else {
            return false
        }
    }

    fetchBearerToken() {

        const currentDate = Date.now();
        console.log('date: ' + currentDate);
        const url = 'https://api.yelp.com/oauth2/token';
        const postData = {
                    grant_type: "client_credentials",
                    client_id: Env.get('YELP_ID'),
                    client_secret: Env.get('YELP_SECRET')
                };
        console.log(postData);
        requestClient(
            {
                uri: url,
                method: "POST",
                form: postData,
                json: true
            }, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); 

                Env.set('YELP_EXPIRATION', currentDate)
                Env.set('YELP_TOKEN', body.access_token)
                console.log('Access token: ' + Env.get('YELP_TOKEN'))
                return true
            });
    }
}

module.exports = DateController
