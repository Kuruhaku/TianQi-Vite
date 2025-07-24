// TODO: It will show the news in a new window base on the user input.
// TODO: Limit to only show the first 5 news
// TODO: Make a button for the news page.
// TODO: News: author, content, description, publishedAt, source, title, url, urlToImage.
// TODO: If there is no image change image url

import { getBackground } from "./pageBackground";

// Global Varrible
const navWeatherButton = document.querySelector("#nav-weather-button");

// Getting the value;
const receivedCountryName = localStorage.getItem("inputCountry");
const receivedCountryTime = localStorage.getItem("countryTime");

// Page Transition and Routing
navWeatherButton.addEventListener("click", function () {
  const transitionPage = document.querySelector(".transition-swipe")
  transitionPage.classList.remove('nonactive');
  transitionPage.classList.add('active');

  transitionPage.addEventListener('animationend', function () {
    window.location.href = `/index.html`;
  })
})

// In order to have exact background with index.html
getBackground(receivedCountryTime);

// Check if there is user value
if (!receivedCountryName) {
  console.log("There is no value")
} else {
  receivedCountryName.toLowerCase()
  getNewsApi(receivedCountryName);
}

// Get data from the API for news.
async function getNewsApi(countryName) {
  try {
    const newsResponse = await fetch(`http://localhost:8080/api/news?countryName=${countryName}`);
    const newsData = await newsResponse.json();
    console.log(newsData);
    displayNews(newsData);
  } catch (error) {
    console.log(error);
  }
}

// Render all the new available
function displayNews(news) {
  const newsShow = document.querySelector(".news-container");
  let storeNews = "";

  if (!news) {
    storeNews = `<p>There no news currently</p>`
  } else {     //TODO: Use foreach
    for (let i = 0; i < 10; i++) {
      let newsIndex = news.results[i];
      console.log(newsIndex);
      storeNews +=
      /*html*/`
      <div class="self-news-container">
        <div class="news-image">
          <img src="${newsIndex.image_url}" onerror='this.src="/DummyImage.jpg"' />
        </div>

        <div class="news-details">
          <div class="news-source">
            <img src="${newsIndex.source_icon}" onerror='this.src="/DummyImage.jpg"' />
            <p>•</p>
            <p>${newsIndex.source_name ?? "There is no source name"}</p>
          </div>

          <div class="news-title">
            <a href="${newsIndex.link}">${newsIndex.title ?? "There is no title"}</a>
          </div>

          <div class="news-description">
            <p>${newsIndex.description ?? "There is no description"}</p>
          </div>

          <div class="news-publishAt">
            <p>${newsIndex.creator ?? "There is no creator"}</p>
            <p>•</p>
            <p>${newsIndex.pubDate ?? "There is no date"}</p>
          </div>
        </div>
      </div>
      `
    }
  }

  newsShow.innerHTML = storeNews; // Render the news base on the condition.
}