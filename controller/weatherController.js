import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const weatherKey = process.env.WEATHER_API_KEY

export async function getWeather(req, res) {
  const { queryWeather } = req.query;
  const url = `http://api.openweathermap.org/data/2.5/weather/?q=${queryWeather}&appid=${weatherKey}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
}

export async function getForecast(req, res) {
  const { lat, lon } = req.query;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}`
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
}
