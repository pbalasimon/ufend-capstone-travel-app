import moment from "moment";
import { isDateValid } from "./URLValidator";

const printTrip = () => {
  window.print();
};

const getGeonameInfo = async (to) => {
  try {
    const info = await fetch("http://localhost:8081/cityInfo", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to }),
    });
    return await info.json();
  } catch (error) {
    // FIXME
    console.error(error);
  }
};

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

  console.log(name, countryCode, countryName);

  const weather = await getWeather(forecast, name, countryCode);
  console.log(weather);
}

const getWeather = async (forecast, name, countryCode) => {
  try {
    const info = await fetch("http://localhost:8081/weather", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ forecast, name, countryCode }),
    });
    return await info.json();
  } catch (error) {
    // FIXME
    console.error(error);
  }
};

document.querySelector("#searchForm").addEventListener("submit", findTrip);
document.querySelector("#printTrip").addEventListener("click", printTrip);
