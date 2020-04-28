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
const validateNumInput = (num_field, max_input = 16) => {
  const parsedValue = parseInt(num_field.value, 10);
  if (isNaN(parsedValue) || parsedValue > max_input) {
    addClassName(num_field, invalidClassName);
    removeClassName(num_field, validClassName);
  } else {
    addClassName(num_field, validClassName);
    removeClassName(num_field, invalidClassName);
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

export { subscribeInputEvents, validateInput, validateNumInput, isFieldValid };
