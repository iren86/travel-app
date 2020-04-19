/**
 * Function to add element class name
 */
const addClassName = (el, name) => {
  el.classList.add(name);
};

/**
 * Function to remove element class name
 */
const removeClassName = (el, name) => {
  el.classList.remove(name);
};

/**
 * Function to hide element
 */
const hideData = (el) => {
  el.style.display = 'none';
};

/**
 * Function to show element
 */
const showData = (el) => {
  el.style.display = '';
};

export { addClassName, removeClassName, hideData, showData };
