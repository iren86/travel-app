const getApiInfo = require('./getApiInfo');
const getWeatherbitInfo = require('./weatherbitObject');

/**
 * Get geoname API data
 */
async function getGeonamesInfo(request, response, projectData) {
  const geonameApiUsername = process.env.API_GEONAMES_USERNAME;
  console.log(`Geoname API Country is: ${JSON.stringify(request.query.country_name)}`);
  console.log(`Place is: ${JSON.stringify(request.query.place_name)}`);
  const geonameBaseURL = 'http://api.geonames.org/searchJSON?';
  const geonameApiURL = `${geonameBaseURL}country_name=${request.query.country_name}&name_equals=${request.query.place_name}&maxRows=1&username=${geonameApiUsername}`;
  console.log(`geoname API url is ${geonameApiURL}`);

  const geonameData = await getApiInfo(geonameApiURL);
  if (geonameData.response.geonames.length > 0){
    const allDataList = geonameData.response.geonames[0];

    let geoCountry = allDataList.countryName;
    if (geoCountry) {
      console.log(`Country name is: ${geoCountry}`);
      projectData.country = geoCountry;
    } else {
      console.log(`Country name undefined`);
    }

    let geoPlace = allDataList.name;
    if (geoPlace) {
      console.log(`Place name is: ${geoPlace}`);
      projectData.place = geoPlace;
    } else {
      console.log(`Place name undefined`);
    }

    let geoLatitude = allDataList.lat;
    if (geoLatitude) {
      console.log(`Latitude is: ${geoLatitude}`);
      projectData.latitude = geoLatitude;
    } else {
      console.log(`Latitude undefined`);
    }

    let geoLongitude = allDataList.lng;
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
    await getWeatherbitInfo(response, projectData);
  } else {
    console.log('Geoname data empty');
    response.sendStatus(404);
  }
}

module.exports = getGeonamesInfo;
