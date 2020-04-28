require('babel-polyfill');
const { JSDOM } = require('jsdom');
const { validateInput, validateNumInput } = require('../src/client/js/validateUI.js');

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe('UI test suite', () => {
  const createInitialTestEl = () => {
    document.body.innerHTML = `
       <input id="country_input" type="text" name="input">
       <input id="days_input" type="number">`;
  };
  createInitialTestEl();
  const countryNameEl = document.querySelector('#country_input');
  const daysEl = document.querySelector('#days_input');
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
    daysEl.value = '16';
    validateNumInput(daysEl);
    expect(daysEl.className).toEqual(validClassName);
  });

  it('Field should be marked as invalid', () => {
    daysEl.value = '18';
    validateNumInput(daysEl);
    expect(daysEl.className).toEqual(invalidClassName);
  });
});



