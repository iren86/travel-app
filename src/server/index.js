require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './process.env' });
// import { getGeonamesInfo } from './geonamesObject.js';
const fetch = require('cross-fetch');

/**
 * Require Express to run server and routes
 */
const app = express();

/**
 * Dependencies
 */
const bodyParser = require('body-parser');

/**
 * Middleware
 * Here we are configuring express to use body-parser as middle-ware
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Cors for cross origin allowance
 */
const cors = require('cors');
app.use(cors());

/**
 * Initialize the main project folder
 */
app.use(express.static('dist'));

/**
 * Setup Server
 */
const port = 7000;

/**
 * Spin up the server
 */
app.listen(port, listening);

function listening() {
  console.log(`running on localhost: ${port}`);
}

/**
 *
 */
function getInfo(request, response) {
  const projectData = {
    'country': 'Country undefined',
    'place': 'Place undefined',
    'days': 'Number of days undefined',
    'latitude': 'Latitude undefined',
    'longitude': 'Longitude undefined',
    'datetime': [],
    'high_temp': [],
    'low_temp': [],
    'weather_icon': [],
    'weather_description': [],
  };

  // geoname API data
  const geonameApiUsername = process.env.API_GEONAMES_USERNAME;
  console.log(`Geoname API Country is: ${JSON.stringify(request.query.country_name)}`);
  console.log(`Place is: ${JSON.stringify(request.query.place_name)}`);
  const geonameBaseURL = 'http://api.geonames.org/searchJSON?';
  const geonameApiURL = `${geonameBaseURL}country_name=${request.query.country_name}&name_equals=${request.query.place_name}&maxRows=1&username=${geonameApiUsername}`;
  console.log(`geoname API url is ${geonameApiURL}`);

  getAPIInfo(geonameApiURL).then(async function (data) {
    console.log(`geoname response API data is ${JSON.stringify(data)}`);
    let geoCountry = data.response.geonames[0].countryName;
    if (geoCountry) {
      console.log(`Country name is: ${geoCountry}`);
      projectData.country = geoCountry;
    } else {
      console.log(`Country name undefined`);
    }

    let geoPlace = data.response.geonames[0].name;
    if (geoPlace) {
      console.log(`Place name is: ${geoPlace}`);
      projectData.place = geoPlace;
    } else {
      console.log(`Place name undefined`);
    }

    let geoLatitude = data.response.geonames[0].lat;
    if (geoLatitude) {
      console.log(`Latitude is: ${geoLatitude}`);
      projectData.latitude = geoLatitude;
    } else {
      console.log(`Latitude undefined`);
    }

    let geoLongitude = data.response.geonames[0].lng;
    if (geoLongitude) {
      console.log(`Longitude is: ${geoLongitude}`);
      projectData.longitude = geoLongitude;
    } else {
      console.log(`Longitude undefined`);
    }

    let userDays = request.query.days;
    if (userDays) {
      console.log(`Number of days: ${userDays}`);
      projectData.days = userDays;
    } else {
      console.log(`Number of days undefined`);
    }

    // weatherbit API data
    const weatherbitApiKey = process.env.API_WEATHERBIT_KEY;
    console.log(`Number of days is: ${JSON.stringify(request.query.days)}`);
    const weatherbitBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
    const weatherbitApiURL = `${weatherbitBaseURL}lat=${projectData.latitude}&lon=${projectData.longitude}&days=${projectData.days}&key=${weatherbitApiKey}`;
    console.log(`weatherbit API url is ${weatherbitApiURL}`);

    getAPIInfo(weatherbitApiURL).then(async function (data) {
      console.log(`weatherbit response API data is ${JSON.stringify(data)}`);

      const allDataList = data.response.data;

      allDataList.forEach(function (item, index) {
        let date = item.datetime;
        if (date) {
          console.log(`Date is: ${date}`);
          projectData.datetime.push({ [index]: date });
        } else {
          console.log(`Date undefined`);
        }

        let highTemp = item.high_temp;
        if (highTemp) {
          console.log(`High temperature is: ${highTemp}`);
          projectData.high_temp.push({ [index]: highTemp });
        } else {
          console.log(`High temperature undefined`);
        }

        let lowTemp = item.low_temp;
        if (lowTemp) {
          console.log(`Low temperature is: ${lowTemp}`);
          projectData.low_temp.push({ [index]: lowTemp });
        } else {
          console.log(`Low temperature undefined`);
        }

        let weatherIcon = item.weather.icon;

        if (weatherIcon) {
          const weatherIconBaseUrl = 'https://www.weatherbit.io/static/img/icons/';
          const weatherIconUrl = `${weatherIconBaseUrl}${weatherIcon}.png`;
          console.log(`Weather icon url  is: ${weatherIconUrl}`);
          projectData.weather_icon.push({ [index]: weatherIconUrl });
        } else {
          console.log(`Weather icon undefined`);
        }

        const weatherDescription = item.weather.description;
        if (weatherDescription) {
          console.log(`Weather description is: ${weatherDescription}`);
          projectData.weather_description.push({ [index]: weatherDescription });
        } else {
          console.log(`Weather description undefined`);
        }
      });
      console.log(`all extracted weather data is ${JSON.stringify(projectData)}`);

      response.send(projectData);
    });
  });
}

/**
 * Function to GET Web API Data
 */
const getAPIInfo = async (url) => {
  try {
    const res = await fetch(url);

    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }
    const response = await res.json();
    console.log(`response API data is ${JSON.stringify(response)}`);
    return {
      response
    };
  } catch (err) {
    return Promise.reject(`Error: "${err}" occurred with status code: ${err}`);
  }
};

app.get('/geo-info', getInfo);
