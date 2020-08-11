import moment from "moment";
import { isDateValid } from "./URLValidator";

const GEONAMES_USERNAME = "pbalasimon";
let geoNamesEP = `http://api.geonames.org/searchJSON?q=#to&maxRows=10&username=${GEONAMES_USERNAME}`;
let weatherbitEP = `https://api.weatherbit.io/v2.0/#moment?city=#city,#countryCode&key=e5040dec0dd7436fb983c67d132f654e`;
let pixabayEP = `https://pixabay.com/api/?key=17854794-ba0c54f1d8e93e506d0d72c4a&q=#cityName+city&image_type=photo&pretty=true`;

async function findTrip(event) {
  event.preventDefault();

  const to = document.querySelector("#to").value;
  const departing = document.querySelector("#departing").value;

  // Validate form

  const now = moment();
  const momentDeparting = moment(departing, "YYYY-MM-DD");

  if (!to) {
    alert("Please enter a valid city");
    return;
  }

  if (momentDeparting.isBefore(now)) {
    alert("Please enter a valid date");
    return;
  }

  if (!isDateValid(departing)) {
    alert("Please enter a valid formated date");
    return;
  }

  let forecast = null;
  if (momentDeparting.isBefore(now.add(7, "days"))) {
    console.log("Get current weather");
    forecast = "current";
  } else {
    console.log("Get foreCast weather");
    forecast = "forecast/daily";
  }

  const info = await getGeonameInfo(to);
  const { name, countryCode, countryName } = info;

  const weather = await getWeather(forecast, name, countryCode);
  console.log(weather);

  const photo = await getCityPhoto(name);
  console.log(photo);

  showResults(to, departing, countryName, weather.data[0], photo);
}

async function getGeonameInfo(to) {
  try {
    const url = geoNamesEP.replace("#to", to);
    const result = await fetch(url);
    const data = await result.json();
    const cityInfo = data.geonames[0];
    return cityInfo;
  } catch (error) {
    console.error(error);
  }
}

async function getWeather(forecast, cityName, countryCode) {
  try {
    const url = weatherbitEP
      .replace("#moment", forecast)
      .replace("#city", cityName)
      .replace("#countryCode", countryCode);
    const result = await fetch(url);
    const data = await result.json();
    return data;
  } catch (error) {
    console.error;
  }
}

async function getCityPhoto(cityName) {
  try {
    const url = pixabayEP.replace("#cityName", cityName);
    const result = await fetch(url);
    const data = await result.json();
    return data.hits[0].webformatURL;
  } catch (error) {
    console.error(error);
  }
}

async function showResults(to, departing, countryName, weather, photo) {
  document.querySelector("#results").classList.remove("hide");

  document.querySelector("#resultToValue").innerText = to + ", " + countryName;
  document.querySelector("#resultDepartingValue").innerText = departing;
  const now = moment();

  const momentDeparting = moment(departing, "YYYY-MM-DD");
  const days = momentDeparting.diff(now, "days");
  document.querySelector("#resultDaysValue").innerText =
    to + ", " + countryName + " is " + days + " days away";
  const temp = weather.temp;
  const weatherDescription = weather.weather.description;
  document.querySelector("#weatherValue").innerText =
    temp + ". " + weatherDescription;
  document.querySelector("#cityPhotoValue").src = photo;
}

function printTrip() {
  window.print();
}

export { findTrip, printTrip };
