require('babel-polyfill');
const { JSDOM } = require('jsdom');
const { validateInput, validateNumOfDaysInput } = require('../src/client/js/validateUI.js');

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe('UI test suite', () => {
  const createInitialTestEl = () => {
    document.body.innerHTML = `
       <input id="country_input" type="text" name="input">
       <div class="entry_data_block">
          <input id="start_date_input" type="date">
       </div>
       <div class="entry_data_block">
          <input id="end_date_input" type="date" value="">
       </div>`;
  };
  createInitialTestEl();
  const countryNameEl = document.querySelector('#country_input');
  const startDateEl = document.querySelector('#start_date_input');
  const endDateEl = document.querySelector('#end_date_input');
  const validClassName = 'valid';
  const invalidClassName = 'invalid';

  it('Field should be marked as valid', () => {
    countryNameEl.value = 'Amsterdam';
    validateInput(countryNameEl);
    expect(countryNameEl.className).toEqual(validClassName);
  });

  it('Field should be marked as invalid', () => {
    countryNameEl.value = '';
    validateInput(countryNameEl);
    expect(countryNameEl.className).toEqual(invalidClassName);
  });

  it('Field should be marked as valid', () => {
    startDateEl.value = '2020-04-28';
    endDateEl.value = '2020-04-30';
    validateNumOfDaysInput(startDateEl, endDateEl);
    expect(startDateEl.className).toEqual(validClassName);
    expect(endDateEl.className).toEqual(validClassName);
  });

  it('Field should be marked as invalid', () => {
    startDateEl.value = '2020-04-28';
    endDateEl.value = '2020-05-28';
    validateNumOfDaysInput(startDateEl, endDateEl);
    expect(startDateEl.className).toEqual(invalidClassName);
    expect(endDateEl.className).toEqual(invalidClassName);
  });
});



