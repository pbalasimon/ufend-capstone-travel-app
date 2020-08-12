const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
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

app.post("/cityInfo", (req, res, next) => {
  console.log(req.body);
  console.log(process.env.GEONAMES_USERNAME);
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
    });
});

app.listen(8081, () => {
  console.log("Travel app listening on port 8081!");
});
