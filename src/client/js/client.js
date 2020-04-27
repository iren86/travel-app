import '../styles/base.scss';
import '../styles/baseDesktop.scss';
import '../styles/header.scss';
import '../styles/headerDesktop.scss';
import '../styles/main.scss';
import '../styles/mainDesktop.scss';
import '../styles/form.scss';
import '../styles/formDesktop.scss';
import '../styles/footer.scss';
import logo from '../image/logo.png';
import { getContext } from './getContext.js';
import { hideData, showData, updateUI } from './updateUI.js';
import { subscribeInputEvents, validateInput, validateNumInput, isFieldValid } from './validateUI.js';

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
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

const logoImg = document.querySelector('#logo');
logoImg.src = logo;

const {
  countryNameEl,
  placeNameEl,
  daysEl,
  infoEl,
  resultEl,
  countryInfoEl,
  placeInfoEl,
  daysInfoEl,
  locationImgEl
} = getContext();

/**
 * Function called by event listener
 * Update UI with all data
 */
const onFormSubmitListener = async (e) => {
  const requiredFields = [countryNameEl, placeNameEl, daysEl];
  requiredFields.forEach((el) => {subscribeInputEvents(el);});
  requiredFields.forEach((el) => {validateInput(el);});
  validateNumInput(daysEl);
  if (isFieldValid(countryNameEl) && isFieldValid(placeNameEl) && isFieldValid(daysEl)) {
    const countryName = countryNameEl.value;
    const placeName = placeNameEl.value;
    const days = daysEl.value;
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
 * Event listener to add function to existing HTML DOM element
 */
document.querySelector('#submit_button').addEventListener('click', onFormSubmitListener);

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
  locationImgEl.setAttribute(
    'style',
    'width: 100%; height: 50%; padding: 0.5em; border: 1px solid #ddd; background: white;'
  );
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
    weatherListItem.setAttribute(
      'style',
      'display: flex; ' +
      'flex-direction: column; ' +
      'background: #FFBE58; ' +
      'width: 95%; ' +
      'padding-top: 1em; ' +
      'list-style-type: none; ' +
      'border-radius: 20%; '
    );

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
  weatherDateBlock.setAttribute(
    'style',
    'display: block; ' +
    'background: white; ' +
    'width: 100%; ' +
    'padding: 0.5em; ' +
    'color: black; ' +
    'font-family: Oswald, sans-serif;' +
    'font-size: 1em; '
  );

  return weatherDateBlock;
};

/**
 * Build Weather block
 */
const buildWeatherInfoBlock = (highTempValue, lowTempValue, weatherIconValue, weatherDescriptionValue) => {
  const weatherInfoBlock = document.createElement('div');
  weatherInfoBlock.setAttribute('id', 'weather-info-block');
  weatherInfoBlock.setAttribute(
    'style',
    'display: flex;' +
    'flex-direction : row; ' +
    'background: #36B9CA; ' +
    'width: 100%; ' +
    'margin-bottom: 1em; ' +
    'padding-right: 1em; ' +
    'color: black; ' +
    'font-family: Oswald, sans-serif;' +
    'font-size: 1em; ' +
    'justify-content: space-between'
  );

  const fragment = document.createDocumentFragment();
  const weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('class', 'weather_icon');
  weatherIcon.alt = 'Weather icon';
  weatherIcon.src = weatherIconValue;
  weatherIcon.setAttribute(
    'style',
    'width: 5em; height: 5em; align-self: center; align-content: center; padding-left: 0.5em;'
  );

  const highTempInfo = document.createElement('div');
  highTempInfo.setAttribute('class', 'high-temp-info');
  highTempInfo.textContent = `${highTempValue} ` + 'ºC';
  highTempInfo.setAttribute(
    'style',
    'width: 25%; align-self: center; align-content: center; text-align: center;'
  );

  const lowTempInfo = document.createElement('div');
  lowTempInfo.setAttribute('class', 'low-temp-info');
  lowTempInfo.textContent = `${lowTempValue} ` + 'ºC';
  lowTempInfo.setAttribute(
    'style',
    'width: 25%; align-self: center; align-content: center; text-align: center;'
  );

  const weatherDescription = document.createElement('div');
  weatherDescription.setAttribute('class', 'weather-description');
  weatherDescription.textContent = weatherDescriptionValue;
  weatherDescription.setAttribute(
    'style',
    'width: 25%; align-self: center; align-content: center; text-align: center;'
  );

  fragment.appendChild(weatherIcon);
  fragment.appendChild(highTempInfo);
  fragment.appendChild(lowTempInfo);
  fragment.appendChild(weatherDescription);
  weatherInfoBlock.appendChild(fragment);

  return weatherInfoBlock;
};


