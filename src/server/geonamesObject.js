const getGeonamesInfo = async (locationName) => {
  // Read API Username from the environment
  const apiUsername = process.env.API_GEONAMES_USERNAME;
  const baseURL = 'http://api.geonames.org/searchJSON?';
  const apiURL = `${baseURL}country_name=${locationName}&username=${apiUsername}`;
  try {
    const response = await fetch(apiURL);
    return {
      responseJson: await response.json(),
      responseCode: response.status,
      response: response
    };
  } catch (error) {
    console.log('error', error);
    return {
      responseCode: response.status
    };
  }
};

export { getGeonamesInfo };
