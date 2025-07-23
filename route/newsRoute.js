import express from 'express';
import { getNew } from '../controller/newsController.js';

export const newsRoute = express.Router()

// Route: api/news
newsRoute.get('/', getNew)