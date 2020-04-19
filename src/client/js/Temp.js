const stringify = require('query-string');

const getInfo = () => {
  const geonames = [{"countryCode":"NL","name":"Amsterdam","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"NH"},"countryName":"Netherlands"}];
  const a = geonames[0].name;
  console.log(`All data is: ${a}`);
};

getInfo();
