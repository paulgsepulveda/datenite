'use strict'

const rwc = require('random-weighted-choice')
const requestClient = require('request');

class DateController {

    constructor() {
        this.yelpBusinessBase = 'https://api.yelp.com/v3/businesses/search?';
        this.eventfulSearchBase = 'http://api.eventful.com/json/events/search?';
        this.dateOptions = [
            0, // Dinner
            1, // Movie
            2  // Dinner & Movie
        ];
    }

    * index (request, response) {
        yield response.sendView('date')
    }

    * api (request, response) {

        const data = request.all()
        var date;

        // Validate location
        const location = validateLocation(data)
        if (!location) {
            response.json({message: "Invalid location data"})
        }
        
        //Get date info
        date = planDate(data.date_type, location, data.date)

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
        if(date_type == 'surprise') {
            date_type = this.surpriseMe();
        }

    }

    selectRestaurant(location) {
        
        var data = {
            radius: 25000,
            categories: 'restaurants',
            limit: 1,

        };

        if(location.type == 'zip') {
            data.location = location.zip 
        } else {
            data.latitude = location.latitude
            data.longitude = location.longitude
        }

        let urlParameters = Object.keys(data).map((i) => i+'='+data[i]).join('&');
        const url = this.yelpBusinessBase + urlParameters

        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); 
        });
    }

    setTimeRange(datetime) {

    }

    selectMovie(location, datetime) {
        var data = {

        }

        let urlParameters = Object.keys(data).map((i) => i+'='+data[i]).join('&');
        const url = this.eventfulSearchBase + urlParameters

        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); 
        });
    }
}

module.exports = DateController
