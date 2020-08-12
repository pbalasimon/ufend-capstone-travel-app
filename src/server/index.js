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

const GeocoderGeonames = require("geocoder-geonames"),
  geocoder = new GeocoderGeonames({
    username: process.env.GEONAMES_USERNAME,
  });

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
      // FIXME
      console.log(error);
    });
});

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
      // FIXME
      console.log(error);
    });
});

app.post("/city-image", (req, res, next) => {
  pixabay
    .searchImages(process.env.PIXABAY_API_KEY, req.body.name + "+city", {
      image_type: "photo",
    })
    .then((result) => {
      console.log(result.hits[0].webformatURL);
      res.send({ url: result.hits[0].webformatURL });
    })
    .catch(function (error) {
      // FIXME
      console.log(error);
    });
});

app.listen(8081, () => {
  console.log("Travel app listening on port 8081!");
});
