const getApiInfo = require('./getApiInfo.js');

/**
 * Get pixabay API data
 */
async function getPixabayInfo(response, projectData) {
  const pixabayApiKey = process.env.API_PIXABAY_KEY;
  const pixabayBaseURL = 'https://pixabay.com/api/?';
  const pixabayApiURL = `${pixabayBaseURL}key=${pixabayApiKey}&q=${projectData.place}&category=places&category=travel&image_type=photo`;
  console.log(`pixabay API url is ${pixabayApiURL}`);

  const pixabay = await getApiInfo(pixabayApiURL);
  const allDataList = pixabay.response.hits[0];
  console.log(`hits response API data is ${JSON.stringify(allDataList)}`);
  const pixabayPhotoUrl = allDataList.webformatURL;
  if (pixabayPhotoUrl) {
    console.log(`Photo Url is: ${pixabayPhotoUrl}`);
    projectData.photo_url = pixabayPhotoUrl;
  } else {
    console.log(`Photo url undefined`);
  }
  response.send(projectData);
}

module.exports = getPixabayInfo;
