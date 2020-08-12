// Import required libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const weatherbit = require("@datafire/weatherbit").create();
const pixabay = require("pixabay-api");
dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(express.static("dist"));

// Config geonames endpoint
const GeocoderGeonames = require("geocoder-geonames"),
  geocoder = new GeocoderGeonames({
    username: process.env.GEONAMES_USERNAME,
  });

/**
 * Get city info based on a city name
 * @param {string} to CityName
 * @returns {json} info of the city
 */
app.post("/city-info", (req, res, next) => {
  geocoder
    .get("search", {
      q: req.body.to,
      maxRows: 10,
    })
    .then(function (response) {
      const cityInfo = response.geonames[0];
      console.log(cityInfo);
      res.send(cityInfo);
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error retrieving the info of the city" });
    });
});

/**
 * Get weather based on a city name and country Code
 * @param {string} name CityName
 * @param {string} countryCode Country Code
 * @returns {json} weather of the city for the next 14 days
 */
app.post("/weather", (req, res, next) => {
  weatherbit.forecast.daily_city_city_country_country
    .get({
      city: req.body.name,
      country: req.body.countryCode,
      key: process.env.WEATHERBIT_API_KEY,
    })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error retrieving the weather of the city" });
    });
});

/**
 * Get city photo based on a city name
 * @param {string} name CityName
 * @returns {json} url with a photo of the city
 */
app.post("/city-photo", (req, res, next) => {
  pixabay
    .searchImages(process.env.PIXABAY_API_KEY, req.body.name + "+city", {
      image_type: "photo",
    })
    .then((result) => {
      console.log(result.hits[0].webformatURL);
      res.send({ url: result.hits[0].webformatURL });
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error retrieving the photo of the city" });
    });
});

app.listen(8081, () => {
  console.log("Travel app listening on port 8081!");
});
