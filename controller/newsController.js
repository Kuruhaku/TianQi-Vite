import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

export async function getNew(req, res) {
  const { countryName } = req.query;
  const newsKey = process.env.NEWS_API_KEY;
  const url = `https://newsdata.io/api/1/latest?apikey=${newsKey}&country=${countryName}`
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
}
