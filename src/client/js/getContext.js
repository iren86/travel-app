/**
 * Function to get element context
 */
const getContext = () => {
  const countryNameEl = document.querySelector('#country_input');
  const placeNameEl = document.querySelector('#place_input');
  const daysEl = document.querySelector('#days_input');
  const infoEl = document.querySelector('.info-text');
  const resultEl = document.querySelector('#results');
  const countryInfoEl = document.querySelector('.country-info');
  const placeInfoEl = document.querySelector('.place-info');
  const daysInfoEl = document.querySelector('.days-info');
  const locationImgEl = document.querySelector('#location-img');

  return {
    countryNameEl,
    placeNameEl,
    daysEl,
    infoEl,
    resultEl,
    countryInfoEl,
    placeInfoEl,
    daysInfoEl,
    locationImgEl
  };
};

export { getContext };
