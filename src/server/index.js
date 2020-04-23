require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './process.env' });
const getGeonamesInfo = require('./geonamesObject');

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

async function getInfo(request, response) {
  const projectData = {
    'country': '',
    'place': '',
    'days': '',
    'latitude': '',
    'longitude': '',
    'datetime': [],
    'high_temp': [],
    'low_temp': [],
    'weather_icon': [],
    'weather_description': [],
    'photo_url': '',
  };

  await getGeonamesInfo(request, response, projectData);
  console.log(`all extracted API data is ${JSON.stringify(projectData)}`);
}

app.get('/geo-info', getInfo);
