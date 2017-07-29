'use strict'

const rwc = require('random-weighted-choice')

class DateController {

    dateOptions = [

    ];

    * index (request, response) {
        yield response.sendView('date')
    }

    * api (request, response) {

        var date

        // Validate location
        if (!validateLocation(request)) {
            response.json({message: "Invalid location data"})
        }

        // Check request for the appropriate date type
        

    

        response.json(date) 
    }

    surpriseMe() = {
        //Generate rwc table
        var temp;
        var table = [];

        for (i = 0; i < dateOptions.length; i++) {
            temp = {weight: 1, id: dateOptions[i]};
            table.push(temp);
        }

        var surprise = rwc(table);
        return surprise
    }

    validateLocation(data) = {

    }
}

module.exports = DateController
