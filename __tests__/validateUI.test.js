import 'babel-polyfill';
import { JSDOM } from 'jsdom';
import { validateInput, validateNumInput } from '../src/client/js/validateUI.js';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe('validate UI test suite', () => {
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

  // Check if field valid
  it('check valid field flag', () => {
    countryNameEl.value = 'Amsterdam';
    validateInput(countryNameEl);
    expect(countryNameEl.className).toEqual(validClassName);
  });

  // Check if field invalid
  it('check invalid field flag', () => {
    countryNameEl.value = '';
    validateInput(countryNameEl);
    expect(countryNameEl.className).toEqual(invalidClassName);
  });

  // Check if field valid
  it('check valid field flag', () => {
    daysEl.value = '16';
    validateNumInput(daysEl);
    expect(daysEl.className).toEqual(validClassName);
  });

  // Check if infield valid
  it('check invalid field flag', () => {
    daysEl.value = '18';
    validateNumInput(daysEl);
    expect(daysEl.className).toEqual(invalidClassName);
  });
});



