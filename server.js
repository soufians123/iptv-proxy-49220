const express = require('express');
const axios = require('axios');
const app = express();

const SOURCE_URL = process.env.SOURCE_URL || 
  'http://sa25.dyndnsdot.ovh:2095/live/iptvsd3777/3777kerzat/49220.m3u8';

app.get('/live.m3u8', async (req, res) => {
  try {
    const response = await axios.get(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'http://legit.site'
      }
    });
    let content = response.data;
    content = content.replace(/(.*\.ts)/g, (match) => `/segment?url=${encodeURIComponent(match)}`);
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching source');
  }
});

app.get('/segment', async (req, res) => {
  const url = req.query.url;
  try {
    const stream = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'http://legit.site'
      }
    });
    stream.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching segment');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));