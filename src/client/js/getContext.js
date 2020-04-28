/**
 * Function to get element context
 */
const getContext = () => {
  const countryNameEl = document.querySelector('#country_input');
  const placeNameEl = document.querySelector('#place_input');
  const startDateEl = document.querySelector('#start_date_input');
  const endDateEl = document.querySelector('#end_date_input');
  const infoEl = document.querySelector('.info-text');
  const resultEl = document.querySelector('#results');
  const countryInfoEl = document.querySelector('.country-info');
  const placeInfoEl = document.querySelector('.place-info');
  const daysInfoEl = document.querySelector('.days-info');
  const locationImgEl = document.querySelector('#location-img');

  return {
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
  };
};

export { getContext };
