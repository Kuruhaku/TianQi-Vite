import express from 'express';
import { getWeather, getForecast } from '../controller/weatherController.js';

export const weatherRoute = express.Router();

// Route: /api/weather
weatherRoute.get("/", getWeather);
weatherRoute.get("/forecast", getForecast);