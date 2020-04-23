const fetch = require('cross-fetch');

/**
 * Function to GET Web API Data
 */
async function getApiInfo(url) {
  try {
    const res = await fetch(url);
    if (res.status >= 200 && res.status < 300) {
      const response = await res.json();
      console.log(`response API data is ${JSON.stringify(response)}`);
      return { response };
    } else {
      throw new Error('Bad response from server');
    }
  } catch (err) {
    console.log(`Error: "${err}"`);
  }
}

module.exports = getApiInfo;
