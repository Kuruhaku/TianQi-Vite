import { DateTime } from "luxon";
import { getBackground } from "./pageBackground";

// TODO: There an input that will listen to the user input and get what data sys.is need to display.
// TODO: Display must be hiden and it will only show when the user only has already give a value.
// TODO: It must display the country, area, temperature, humidity, weather condition and current date. (more to add).
// TODO: It must catch an error if there country same as the user input.
// TODO: Make the information stay even has been move from other site.

// There must be a function for getting the data, error, and displaying the data.
const getWeatherButton = document.querySelector("#get-weather-button");
const weatherInput = document.querySelector("#weather-input");
const showError = document.querySelector("#display-error");
const errorContainer = document.querySelector(".error-container");
const navWeatherButton = document.querySelector("#nav-weather-button");
const navNewsButton = document.querySelector("#nav-news-button");

// Get value from the URL (Must fix this becuase of the new API);
const getData = new URLSearchParams(window.location.search).get('countryInput');

// This if there are data in URL.
if (getData) {
  weatherInput.value = getData;
  getWeatherData(getData);
}

// Listen and Get the value of the User Input
getWeatherButton.addEventListener("click", function () {
  if (weatherInput.value == "" || weatherInput.value == " ") {
    displayError("Please Place a City");
  } else if (weatherInput.value) {
    try {
      getWeatherData(weatherInput.value)

    }
    catch (error) {
      console.error(error);
    }
  };
})

// Function for getting the data.
async function getWeatherData(userInput) {
  // TODO: For future feature make a backend that handle the http request to hide the key.
  const apiKey = "8b9e2e908d291437b12efe817b0886e6";
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather/?q=${userInput}&appid=${apiKey}`);

  if (!response.ok) { // Checking if there 404 Not Found
    displayError("This data is not present");
  } else {
    const data = await response.json();
    try {
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`)
      const forecastData = await forecastResponse.json();
      getCountryData(data.sys.country);
      displayWeatherData(data);
      displayForcastData(forecastData);
      console.log(data);
      console.log(forecastData);
    } catch (error) {
      console.log(error);
    }
  }
}

//  This function get the varriable inside getWeatherData ("data")
let countryData = "";
function getCountryData(functionData) {
  countryData = functionData;
}

// Routing and Getting the value
navNewsButton.addEventListener("click", function () {
  console.log(countryData);
  window.location.href = `../app/newsPage.html?countryName=${encodeURIComponent(countryData)}&countryInput=${encodeURIComponent(weatherInput.value)}`
})

navWeatherButton.addEventListener("click", function () {
  window.location.href = `../app/weatherPage.html?countryInput=${encodeURIComponent(weatherInput.value)}`;
})


// Display the data to the Web
function displayWeatherData(wData) {
  // Varriable for Displaying
  const displayCountry = document.querySelector("#display-weather-country");
  const displayArea = document.querySelector("#display-weather-area");
  const displayTemperature = document.querySelector("#display-weather-temperature");
  const displayHumidity = document.querySelector("#display-weather-humidity");
  const displayWeatherCon = document.querySelector("#display-weather-condition");

  // Varriable for style modification
  const displayAreaImage = document.querySelector('#area-image');
  const displayWeatherImage = document.querySelector("#display-weather-image");
  const displayDetail = document.querySelector(".weather-details-container");
  const displayWeatherContainer = document.querySelector(".weather-condition-container");
  const displayNavBar = document.querySelector(".nav-bar-container");

  getCurrentTime(wData.timezone);

  // Null Check for error
  if (!wData || wData.main.temp === undefined || wData.sys.country === undefined || wData.name === undefined || wData.main.humidity === undefined || wData.weather[0].main === undefined) {
    console.log('There a Null Data')
  }
  const calculateTemp = wData.main.temp - 273.15

  // Style Modification
  errorContainer.style.display = "none";
  displayAreaImage.style.display = "block";
  displayWeatherImage.style.display = "block";
  displayWeatherContainer.style.justifyContent = "space-between";
  displayWeatherContainer.style.alignItems = "normal";
  displayNavBar.style.display = "flex";
  displayDetail.style.display = "flex";

  displayCountry.innerText = wData.sys.country; // print out the country.
  displayArea.innerText = wData.name; // print out the name.
  displayTemperature.innerText = `${calculateTemp.toFixed(2)}°`; // print out the temperature.
  displayHumidity.innerText = `${wData.main.humidity}% Humdity`; // print out the humidity.
  displayWeatherCon.innerText = wData.weather[0].main; // print out the weather.
}

function displayForcastData(fData) {
  const forecastContainer = document.querySelector(".forecast-details-container")
  const newDayArray = [3, 11, 19, 27, 35];
  let storeForecastData = "";
  for (let i = 0; i < newDayArray.length; i++) {
    let getWeatherIcon = fData.list[newDayArray[i]].weather[0].icon;
    storeForecastData +=
    /*html*/`
    <div class="day-forecast-details">
      <p class="week-day">${fData.list[newDayArray[i]].dt_txt}</p>
      <img src="https://openweathermap.org/img/wn/${getWeatherIcon}@2x.png"/>
      <p class="forecast-temperature">${(fData.list[newDayArray[i]].main.temp - 273.15).toFixed(2)}</p>
    </div>
    `
  }

  forecastContainer.innerHTML = storeForecastData;
}
// Get Current Time
// TODO: Put Error Handler Here
function getCurrentTime(offsetSeconds = 0) {
  const displayCountryTime = document.querySelector("#display-weather-time");
  const countryTime = DateTime.utc().plus({ seconds: offsetSeconds });
  const formatTime = countryTime.toFormat("HH:mm");
  const Hourtime = countryTime.toFormat("HH");

  let timePeriod = "";
  if (Hourtime > 12) {
    timePeriod = "PM";
  } else {
    timePeriod = "AM";
  }

  displayCountryTime.innerHTML = `${formatTime} ${timePeriod}`;
  getBackground(Hourtime)
}

// Handling Error
function displayError(message) {
  errorContainer.style.display = "block";
  showError.innerText = message;
}