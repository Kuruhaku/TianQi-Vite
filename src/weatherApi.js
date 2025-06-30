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
    displayError(`⚠️ Weather data not found`);
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

let countryTime = "";
function getCountryTime(functionTime) {
  countryTime = functionTime
}

navNewsButton.addEventListener("click", async function () {
  const transitionPage = document.querySelector(".transition-swipe");
  transitionPage.classList.remove("nonactive");
  transitionPage.classList.add("active");

  // Waiting for the Animation to End and Routing and Getting the value
  transitionPage.addEventListener('animationend', () => {
    window.location.href = `/newsPage.html?countryName=${encodeURIComponent(countryData)}&countryInput=${encodeURIComponent(weatherInput.value)}&countryTime=${encodeURIComponent(countryTime)}`
  })
})

// Display the data to the Web
function displayWeatherData(wData) {
  // Varriable for Displaying
  const displayCountry = document.querySelector("#display-weather-country");
  const displayArea = document.querySelector("#display-weather-area");

  // Varriable for style modification
  const displayAreaImage = document.querySelector('#area-image');
  const displayWeatherImage = document.querySelector("#display-weather-image");
  const displayDetail = document.querySelector(".weather-details-container");
  const displayWeatherContainer = document.querySelector(".weather-condition-container");
  const displayNavBar = document.querySelector(".nav-bar-container");

  getCurrentTime(wData.timezone);
  displayCondition(wData.weather[0].id);
  // displayCondition(600); // Checking if snow or rain is working.
  // Null Check for error
  if (!wData || wData.main.temp === undefined || wData.sys.country === undefined || wData.name === undefined || wData.main.humidity === undefined || wData.weather[0].main === undefined) {
    console.log('There a Null Data')
  }

  const nowTime = DateTime.utc().plus({ seconds: wData.timezone });
  const formatNow = nowTime.toFormat('yyyy LLL dd (HH:mm:ss)');

  // Style Modification
  errorContainer.style.display = "none";
  displayAreaImage.style.display = "block";
  displayWeatherImage.style.display = "block";
  displayWeatherContainer.style.justifyContent = "space-between";
  displayWeatherContainer.style.alignItems = "normal";
  displayNavBar.style.display = "flex";
  displayDetail.style.display = "flex";

  // Display Data
  displayCountry.innerText = wData.sys.country; // print out the country.
  displayArea.innerText = wData.name; // print out the name.

  const displayCurrent = document.querySelector('.current-details-container')
  displayCurrent.innerHTML =
  /*html*/`
  <div class="time-grid" style="grid-area: box-1">
    <p id="display-current-time">${formatNow}</p>
  </div>

  <div class="image-grid" style="grid-area: box-2">
    <img
      id="display-weather-image"
      src="https://openweathermap.org/img/wn/${wData.weather[0].icon}@2x.png"
    />
    <p id="display-weather-condition">${wData.weather[0].main}</p>
  </div>

  <div class="detail-grid" style="grid-area: box-3">
    <img src="/air.svg" alt="" />
    <p id="display-weather-temperature">Temp: ${(wData.main.temp - 273.15).toFixed(2)}°</p>
  </div>

  <div class="detail-grid" style="grid-area: box-4">
    <img src="/eco.svg" alt="" />
    <p id="display-weather-humidity">Humidity: ${wData.main.humidity}% </p>
  </div>

  <div class="detail-grid" style="grid-area: box-5">
    <img src="/air.svg" alt="" />
    <p id="display-weather-feels">Feels Like: ${(wData.main.feels_like - 273.15).toFixed(2)}°</p>
  </div>

  <div class="detail-grid" style="grid-area: box-6">
    <img src="/pressure.svg" alt="" />
    <p id="display-weather-pressure">Pressure: ${wData.main.pressure} hpa</p>
  </div>
  `
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
      <p class="forecast-temperature">${(fData.list[newDayArray[i]].main.temp - 273.15).toFixed(2)}°</p>
    </div>
    `
  }

  forecastContainer.innerHTML = storeForecastData;
}

// Check if the condition is rain or snow.
function displayCondition(id) {
  if (id >= 200 && id <= 550) {
    particlesJS.load('particles-js', 'src/rain.json', function () {
      console.log('particles.js config loaded');
    });
  }

  if (id >= 600 && id < 700) {
    particlesJS.load('particles-js', 'src/snow.json', function () {
      console.log('particles.js config loaded');
    });
  }
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
  getBackground(Hourtime);
  getCountryTime(Hourtime);
}

// Handling Error
function displayError(message) {
  errorContainer.style.display = "block";
  showError.innerText = message;
}