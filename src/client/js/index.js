import '../styles/base.scss';
import '../styles/header.scss';
import '../styles/main.scss';
import '../styles/form.scss';
import '../styles/footer.scss';
import logo from '../image/logo.png';
import { stringify } from 'query-string';
import { getContext } from './getContext.js';
import { addClassName, removeClassName, hideData, showData } from './updateUI.js';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../../worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      // registration failed :(
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
} = getContext();

const invalidClassName = 'invalid';
const validClassName = 'valid';

/**
 * Function called by event listener
 * Update UI with all data
 */
const onFormSubmitListener = async (e) => {
  subscribeInputEvents();
  validateInput();
  if (isFieldValid()) {
    const countryName = countryNameEl.value;
    const placeName = placeNameEl.value;
    const days = daysEl.value;
    await getInfo(countryName, placeName, days).then(function (response) {
      console.log(`All data is: ${JSON.stringify(response.data)}`);
      updateUI(countryInfoEl, response.data.country);
      updateUI(placeInfoEl, response.data.place);

      const weatherBlockCount = response.data.days;
      const weatherDatetimeList = response.data.datetime;
      const weatherHighTempList = response.data.high_temp;
      const weatherLowTempList = response.data.low_temp;
      const weatherIconList = response.data.weather_icon;
      const weatherDescriptionList = response.data.weather_description;

      buildWeatherResultBlock(
        weatherBlockCount,
        weatherDatetimeList,
        weatherHighTempList,
        weatherLowTempList,
        weatherIconList,
        weatherDescriptionList
      );
      //
      // response.data.datetime.forEach(function (item, index) {
      //   console.log(`Date is: ${JSON.stringify(item[index])}`);
      // });
      // response.data.high_temp.forEach(function (item, index) {
      //   console.log(`High temp is: ${JSON.stringify(item[index])}`);
      // });
      // response.data.low_temp.forEach(function (item, index) {
      //   console.log(`Low temp is: ${JSON.stringify(item[index])}`);
      // });
      // response.data.weather_icon.forEach(function (item, index) {
      //   console.log(`Weather icon url is: ${JSON.stringify(item[index])}`);
      // });
      // response.data.weather_description.forEach(function (item, index) {
      //   console.log(`Weather description is: ${JSON.stringify(item[index])}`);
      // });
    });

  } else {
    console.log('Else block');
  }
};

/**
 * Event listener to add function to existing HTML DOM element
 */
document.querySelector('#submit_button').addEventListener('click', onFormSubmitListener);

/**
 * Function to GET data from server and update UI
 */
const getInfo = async (country_name, place_name, days) => {
  const params = {
    country_name: country_name,
    place_name: place_name,
    days: days
  };
  const request = await fetch(`http://localhost:7000/geo-info?${stringify(params)}`);
  try {
    const response = await request.json();
    console.log(`All data from server is: ${JSON.stringify(response)}`);
    return {
      data: response
    };

  } catch (error) {
    console.log('error', error);
  }
};

/**
 * Function to subscribe for input events
 */
const subscribeInputEvents = () => {
  placeNameEl.addEventListener('input', (event) => {
    if (placeNameEl.validity.valid) {
      removeClassName(placeNameEl, invalidClassName);
      addClassName(placeNameEl, validClassName);
    }
  });
};

/**
 * Add the class when fields become invalid
 */
const validateInput = () => {
  if (placeNameEl.value.length === 0) {
    addClassName(placeNameEl, invalidClassName);
    removeClassName(placeNameEl, validClassName);
  } else {
    addClassName(placeNameEl, validClassName);
    removeClassName(placeNameEl, invalidClassName);
  }
};

/**
 * Function to get list with valid/invalid flags
 */
const getRequiredFlag = () => {
  if (placeNameEl.classList.contains(validClassName)) {
    return validClassName;
  } else {
    return invalidClassName;
  }
};

/**
 * Function to check if field valid
 */
const isFieldValid = () => {
  const flag = getRequiredFlag();
  return flag === validClassName;
};

/**
 * Function to update UI
 */
const updateUI = (element, value) => {
  element.innerHTML = value;
};

/**
 * Build result block
 */
// const buildWeatherResultBlock = (
//   count, DateList, highTempList, lowTempList, weatherIconList, weatherDescriptionList
// ) => {
//   const weatherContainerListEl = document.querySelector('#weather-container-list');
//   for (let i = 0; i < count; i++) {
//     const fragment = document.createDocumentFragment();
//
//     const weatherListItem = document.createElement('div');
//     weatherListItem.setAttribute('class', 'weather-list-item');
//     console.log(`DateList is: ${JSON.stringify(DateList)}`);
//     console.log(`DateList "${i}" is: ${JSON.stringify(DateList[i][i])}`);
//
//     console.log(`DateList "${1}" is: ${JSON.stringify(DateList[1][1])}`);
//
//     const weatherDateBlock = buildWeatherDateBlock(DateList[i][i]);
//     console.log(`highTempList is: ${JSON.stringify(highTempList)}`);
//     console.log(`highTempList "${i}" is: ${JSON.stringify(highTempList[i][i])}`);
//
//     const weatherInfoBlock = buildWeatherInfoBlock(JSON.stringify(highTempList[i][i]), lowTempList[i][i], weatherIconList[i][i], weatherDescriptionList[i][i]);
//     weatherListItem.appendChild(weatherDateBlock);
//     weatherListItem.appendChild(weatherInfoBlock);
//     fragment.appendChild(weatherListItem);
//     weatherContainerListEl.appendChild(fragment);
//   }
// };

const buildWeatherResultBlock = (
  count, DateList, highTempList, lowTempList, weatherIconList, weatherDescriptionList
) => {
  const weatherContainerListEl = document.querySelector('#weather-container-list');
  const mainFragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const fragment = document.createDocumentFragment();
    console.log(`weatherBlockCount is ${count}`);
    const weatherListItem = document.createElement('li');
    weatherListItem.setAttribute('class', `weather-list-item`);

    const weatherDateBlock = buildWeatherDateBlock(DateList[i][i]);

    const weatherInfoBlock = buildWeatherInfoBlock(highTempList[i][i], lowTempList[i][i], weatherIconList[i][i], weatherDescriptionList[i][i]);
    fragment.appendChild(weatherDateBlock);
    fragment.appendChild(weatherInfoBlock);
    weatherListItem.appendChild(fragment);
    mainFragment.appendChild(weatherListItem);
    // debugger;
  }
  weatherContainerListEl.appendChild(mainFragment);
};

/**
 * Build Date block
 */
const buildWeatherDateBlock = (DateValue) => {
  const weatherDateBlock = document.createElement('div');
  weatherDateBlock.setAttribute('id', 'weather-date-block');
  weatherDateBlock.textContent = 'Date:';

  const fragment = document.createDocumentFragment();
  const dateInfo = document.createElement('div');
  dateInfo.setAttribute('class', 'weather-date-info');
  dateInfo.textContent = DateValue;

  fragment.appendChild(dateInfo);
  weatherDateBlock.appendChild(fragment);

  return weatherDateBlock;
};

/**
 * Build weather block
 */
const buildWeatherInfoBlock = (highTempValue, lowTempValue, weatherIconValue, weatherDescriptionValue) => {
  const weatherInfoBlock = document.createElement('div');
  weatherInfoBlock.setAttribute('id', 'weather-info-block');
  weatherInfoBlock.textContent = 'Weather:';

  const fragment = document.createDocumentFragment();
  const weatherIcon = document.createElement('i');
  weatherIcon.setAttribute('class', 'weather_icon');
  weatherIcon.textContent = weatherIconValue;

  const highTempInfo = document.createElement('div');
  highTempInfo.setAttribute('class', 'high-temp-info');
  highTempInfo.textContent = highTempValue;

  const lowTempInfo = document.createElement('div');
  lowTempInfo.setAttribute('class', 'low-temp-info');
  lowTempInfo.textContent = lowTempValue;

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



