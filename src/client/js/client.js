require('../styles/base.scss');
require('../styles/baseDesktop.scss');
require('../styles/header.scss');
require('../styles/headerDesktop.scss');
require('../styles/main.scss');
require('../styles/mainDesktop.scss');
require('../styles/form.scss');
require('../styles/formDesktop.scss');
require('../styles/footer.scss');
require('../styles/footerDesktop.scss');
const { getContext } = require('./getContext.js');
const { hideData, showData, updateUI } = require('./updateUI.js');
const { subscribeInputEvents, validateInput, validateNumOfDaysInput, isFieldValid } = require('./validateUI.js');
import logo from '../image/logo.png';
import blankImg from '../image/no_photo.png';

if (process.env.NODE_ENV === 'development') {
  console.log(`You are in ${process.env.NODE_ENV} mode!`);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../../worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      // registration failed
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}
if (process.env.NODE_ENV === 'production') {
  console.log(`You are in ${process.env.NODE_ENV} mode!`);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      // registration failed
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}

const logoImgEl = document.querySelector('#logo');
logoImgEl.src = logo;
logoImgEl.alt = 'Logo';

const blankImgEl = document.querySelector('#location-img');
blankImgEl.src = blankImg;
blankImgEl.alt = 'Location photo';

window.addEventListener('load', function () {
  const {
    countryNameEl,
    placeNameEl,
    startDateEl,
    endDateEl,
    infoEl,
    resultEl,
    countryInfoEl,
    placeInfoEl,
    daysInfoEl,
    locationImgEl
  } = getContext();

  const setDefaultValues = () => {
    const now = new Date();
    let year = `${now.getFullYear()}`;
    let month = `${now.getMonth() + 1}`;
    let date = `${now.getDate()}`;

    if (month.length < 2) {
      // april - 4, but we need 04, as per specification
      // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
      month = `0${month}`;
    }
    if (date.length < 2) {
      // 1st april - 1, but we need 01, as per specification
      // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
      date = `0${date}`;
    }

    const nowStr = `${year}-${month}-${date}`;
    document.querySelector('#start_date_input').setAttribute('value', nowStr);
    document.querySelector('#start_date_input').setAttribute('min', nowStr);
    document.querySelector('#end_date_input').setAttribute('value', nowStr);
    document.querySelector('#end_date_input').setAttribute('min', nowStr);
  };

  /**
   * Function called by event listener
   * Update UI with all data
   */
  const onFormSubmitListener = async (e) => {
    const startDate = document.querySelector('#start_date_input').value;
    const endDate = document.querySelector('#end_date_input').value;

    const start = moment(startDate);
    const end = moment(endDate);
    const days = end.diff(start, 'days') + 1;

    const requiredFields = [countryNameEl, placeNameEl, startDateEl, endDateEl];
    requiredFields.forEach((el) => {subscribeInputEvents(el);});
    requiredFields.forEach((el) => {validateInput(el);});
    validateNumOfDaysInput(startDateEl, endDateEl);
    if (isFieldValid(countryNameEl) && isFieldValid(placeNameEl)
      && isFieldValid(startDateEl) && isFieldValid(startDateEl)) {
      const countryName = countryNameEl.value;
      const placeName = placeNameEl.value;
      const response = await getInfo(countryName, placeName, days);
      if (!(response === 404)) {
        hideData(infoEl);
        showData(resultEl);
        updateUI(countryInfoEl, response.country);
        updateUI(placeInfoEl, response.place);
        updateUI(daysInfoEl, response.days);

        const weatherBlockCount = response.days;
        const weatherDatetimeList = response.datetime;
        const weatherHighTempList = response.high_temp;
        const weatherLowTempList = response.low_temp;
        const weatherIconList = response.weather_icon;
        const weatherDescriptionList = response.weather_description;

        buildImageResultBlock(response.photo_url);

        buildWeatherResultBlock(
          weatherBlockCount,
          weatherDatetimeList,
          weatherHighTempList,
          weatherLowTempList,
          weatherIconList,
          weatherDescriptionList
        );
      } else {
        hideData(resultEl);
        showData(infoEl);
        infoEl.setAttribute('style', 'color: red;');
        infoEl.textContent = `Couldn't find  such country or place. Please double check your input.`;
      }
    } else {
      hideData(resultEl);
      showData(infoEl);
      infoEl.setAttribute('style', 'color: red;');
      infoEl.textContent = `Please fill all required fields.`;
    }
  };

  /**
   * Function to GET data from server
   */
  const getInfo = async (country_name, place_name, days) => {
    try {
      const request = await fetch(
        `http://localhost:7000/geo-info?country_name=${country_name}&place_name=${place_name}&days=${days}`
      );
      if (request.status === 404) {
        return request.status;
      }
      const response = await request.json();
      console.log(`All data from server is: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   * Build Image block
   */
  const buildImageResultBlock = (url) => {
    locationImgEl.src = '';
    locationImgEl.src = url;
  };

  /**
   * Build Result block
   */
  const buildWeatherResultBlock = (
    count, DateList, highTempList, lowTempList, weatherIconList, weatherDescriptionList
  ) => {
    const weatherContainerListEl = document.querySelector('#weather-container-list');
    weatherContainerListEl.innerHTML = '';

    const mainFragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const fragment = document.createDocumentFragment();
      const weatherListItem = document.createElement('li');
      weatherListItem.setAttribute('class', `weather-list-item`);

      const weatherDateBlock = buildWeatherDateBlock(DateList[i][i]);

      const weatherInfoBlock = buildWeatherInfoBlock(highTempList[i][i], lowTempList[i][i], weatherIconList[i][i], weatherDescriptionList[i][i]);
      fragment.appendChild(weatherDateBlock);
      fragment.appendChild(weatherInfoBlock);
      weatherListItem.appendChild(fragment);
      mainFragment.appendChild(weatherListItem);
    }
    weatherContainerListEl.appendChild(mainFragment);
  };

  /**
   * Build Date block
   */
  const buildWeatherDateBlock = (DateValue) => {
    const weatherDateBlock = document.createElement('div');
    weatherDateBlock.setAttribute('id', 'weather-date-block');
    weatherDateBlock.textContent = `Date: ${DateValue}`;

    return weatherDateBlock;
  };

  /**
   * Build Weather block
   */
  const buildWeatherInfoBlock = (highTempValue, lowTempValue, weatherIconValue, weatherDescriptionValue) => {
    const weatherInfoBlock = document.createElement('div');
    weatherInfoBlock.setAttribute('id', 'weather-info-block');

    const fragment = document.createDocumentFragment();
    const weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('class', 'weather_icon');
    weatherIcon.alt = 'Weather icon';
    weatherIcon.src = weatherIconValue;

    const highTempInfo = document.createElement('div');
    highTempInfo.setAttribute('class', 'high-temp-info');
    highTempInfo.textContent = `${highTempValue} ` + 'ºC';

    const lowTempInfo = document.createElement('div');
    lowTempInfo.setAttribute('class', 'low-temp-info');
    lowTempInfo.textContent = `${lowTempValue} ` + 'ºC';

    const weatherDescription = document.createElement('div');
    weatherDescription.setAttribute('class', 'weather-description');
    weatherDescription.textContent = weatherDescriptionValue;

    fragment.appendChild(weatherIcon);
    fragment.appendChild(highTempInfo);
    fragment.appendChild(lowTempInfo);
    fragment.appendChild(weatherDescription);
    weatherInfoBlock.appendChild(fragment);

    return weatherInfoBlock;
  };

  setDefaultValues();

  /**
   * Event listener to add function to existing HTML DOM element
   */
  document.querySelector('#submit_button').addEventListener('click', onFormSubmitListener);
});



