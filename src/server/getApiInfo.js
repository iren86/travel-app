const fetch = require('cross-fetch');

/**
 * Function to GET Web API Data
 */
async function getApiInfo(url) {
  try {
    const res = await fetch(url);
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }
    const response = await res.json();
    console.log(`response API data is ${JSON.stringify(response)}`);
    return {
      response
    };
  } catch (err) {
    console.log(`Error: "${err}"`);
  }
}

module.exports = getApiInfo;
