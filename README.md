# DateNite API

This is the NodeJS API server for the DateNite app.

## How it works:

The app or the site (use VueJS) hit the API with a request:

``` 
{
    latitude: xxxx,
    longitude: xxxx,
    date: isodate,
    zip: xxxxx,
    date_type: xxxx
}
```

Then the API spits out a standard JSON response like so:

```
{    
    date_type: xxxx,
    details: {
        {
            detail_type: xxxx,
            address: xxxx,
            name: xxxx,
            source: Eventful or Yelp or Both,
            site_link: xxxx,
            image_link: 
        }
    }
}
```

The app/page receives the response and displays accordingly.

## Static Components

* Landing Page - what it does, plans for the future
* About Page - disclosures, contact form
* Date Page - duh

## Tools

https://github.com/danieljin/yelpv3
https://www.yelp.com/developers/documentation/v3/business_search
http://api.eventful.com/docs

## Query Parameters

Eventful category - movies_film




