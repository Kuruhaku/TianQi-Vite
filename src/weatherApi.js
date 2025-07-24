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

const userInput = localStorage.getItem("userInput");
console.log(userInput);
getWeatherData(userInput);


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
  const weatheResponse = await fetch(`http://localhost:8080/api/weather?queryWeather=${userInput}`);
  const weatherData = await weatheResponse.json();
  console.log(weatherData)

  if (!weatheResponse.ok) { // Checking if there 404 Not Found
    displayError(`⚠️ Weather data not found`);
  } else {
    try {
      localStorage.setItem("inputCountry", weatherData.sys.country) // Store what country the user input, that will be use in news API.
      localStorage.setItem("userInput", userInput)
      const forecastResponse = await fetch(`http://localhost:8080/api/weather/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`)
      const forecastData = await forecastResponse.json();
      console.log(forecastData);
      displayWeatherData(weatherData);
      displayForcastData(forecastData);
    } catch (error) {
      console.log(error);
    }
  }
}

// Page Transitions and Routing
navNewsButton.addEventListener("click", async function () {
  const transitionPage = document.querySelector(".transition-swipe");
  transitionPage.classList.remove("nonactive");
  transitionPage.classList.add("active");

  // Waiting for the Animation to End and Routing
  transitionPage.addEventListener('animationend', () => {
    window.location.href = `/newsPage.html`
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

  // Display Data
  displayCountry.innerText = wData.sys.country; // print out the country.
  displayArea.innerText = wData.name; // print out the name.

  // Style Modification
  errorContainer.style.display = "none";
  displayAreaImage.style.display = "block";
  displayWeatherImage.style.display = "block";
  displayWeatherContainer.style.justifyContent = "space-between";
  displayWeatherContainer.style.alignItems = "normal";
  displayNavBar.style.display = "flex";
  displayDetail.style.display = "flex";

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

// ==== Handle and Render Forecaste Data ====
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
    particlesJS.load('particles-js', 'src/particles/rain.json', function () {
      console.log('particles.js config loaded');
    });
  }

  if (id >= 600 && id < 700) {
    particlesJS.load('particles-js', 'src/particles/snow.json', function () {
      console.log('particles.js config loaded');
    });
  }

  // Remove the partcile if its not raining or snowing.
  const particleContainer = document.querySelector("#particles-js");
  particleContainer.innerHTML = "";
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

let countryTime = "";
function getCountryTime(functionTime) {
  localStorage.setItem("countryTime", functionTime);
  countryTime = functionTime
}

// Handling Error
function displayError(message) {
  errorContainer.style.display = "block";
  showError.innerText = message;
}