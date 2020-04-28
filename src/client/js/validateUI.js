const { addClassName, removeClassName } = require('./updateUI');

const invalidClassName = 'invalid';
const validClassName = 'valid';

/**
 * Function to subscribe for input events
 */
const subscribeInputEvents = (field) => {
  field.addEventListener('input', (event) => {
    if (field.validity.valid) {
      removeClassName(field, invalidClassName);
      addClassName(field, validClassName);
    }
  });
};

/**
 * Add the class when fields become invalid
 */
const validateInput = (field) => {
  if (field.value.length === 0) {
    addClassName(field, invalidClassName);
    removeClassName(field, validClassName);
  } else {
    addClassName(field, validClassName);
    removeClassName(field, invalidClassName);
  }
};

/**
 * Add the class when num field become invalid
 */
const validateNumOfDaysInput = (min_date, max_date, max_days = 16) => {
  const start = moment(min_date.value);
  const end = moment(max_date.value);
  const days = end.diff(start, 'days') + 1;
  if (days > max_days) {
    addClassName(min_date, invalidClassName);
    addClassName(max_date, invalidClassName);
    removeClassName(min_date, validClassName);
    removeClassName(max_date, validClassName);
  } else {
    addClassName(min_date, validClassName);
    addClassName(max_date, validClassName);
    removeClassName(min_date, invalidClassName);
    removeClassName(max_date, invalidClassName);
  }
};

/**
 * Function to get list with valid/invalid flags
 */
const getRequiredFlag = (field) => {
  if (field.classList.contains(validClassName)) {
    return validClassName;
  } else {
    return invalidClassName;
  }
};

/**
 * Function to check if field valid
 */
const isFieldValid = (field) => {
  const flag = getRequiredFlag(field);
  return flag === validClassName;
};

export { subscribeInputEvents, validateInput, validateNumOfDaysInput, isFieldValid };
