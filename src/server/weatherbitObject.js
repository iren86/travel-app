const getApiInfo = require('./getApiInfo');
const getPixabayInfo = require('./pixabayObject');

/**
 * Get weatherbit API data
 */
async function getWeatherbitInfo(response, projectData) {
  const weatherbitApiKey = process.env.API_WEATHERBIT_KEY;
  const weatherbitBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
  const weatherbitApiURL = `${weatherbitBaseURL}lat=${projectData.latitude}&lon=${projectData.longitude}&days=${projectData.days}&key=${weatherbitApiKey}`;
  console.log(`weatherbit API url is ${weatherbitApiURL}`);

  const weatherbitData = await getApiInfo(weatherbitApiURL);
  const allDataList = weatherbitData.response.data;

  if (Array.isArray(allDataList)) {
    allDataList.forEach((item, index) => {
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
    await getPixabayInfo(response, projectData);
  } else {
    console.log(`Response data is empty`);
  }
}

module.exports = getWeatherbitInfo;
