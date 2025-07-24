import express from 'express';
import { weatherRoute } from './route/weatherRoute.js';
import { newsRoute } from './route/newsRoute.js';
import cors from 'cors';

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOptions));

app.use("/api/weather", weatherRoute)

app.use("/api/news", newsRoute);

app.listen(PORT, () => {
  console.log(`Proxy Server running on http://localhost:${PORT}`)
})