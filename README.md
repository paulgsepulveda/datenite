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
    location: xxxx,
    details: {
        {
            detail_type: xxxx,
            address: xxxx,
            name: xxxx,
            source: Yelp or whatever,
            site_link: xxxx,
            image_link: xxxx,
            lat: xxxx,
            lon: xxxx,
            time: xxxx,
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
https://github.com/xkjyeah/vue-google-maps

I need to find something for movies. Maybe I can partner with Fandango if I can make this thing big? For now, maybe I can just hit an api that produces a list of movies in theaters locally?

## Callback hell

Defeated for now, but must develop a way to go beyond Yelp. Maybe set a switch inside the 




