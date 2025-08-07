const express = require('express');
const axios = require('axios');

const app = express();

// قراءة رابط القناة من متغير البيئة
const SOURCE_URL = process.env.SOURCE_URL || 'http://sa25.dyndnsdot.ovh:2095/live/iptvsd3777/3777kerzat/49220.m3u8';

app.get('/live.m3u8', async (req, res) => {
  try {
    const response = await axios.get(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'http://legit.site'
      }
    });

    let content = response.data;

    // إعادة كتابة الروابط الخاصة بالقطع TS
    content = content.replace(/(.*\.ts)/g, (match) => `/segment?url=${encodeURIComponent(match)}`);

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(content);
  } catch (error) {
    res.status(500).send('Error fetching stream');
  }
});

app.get('/segment', async (req, res) => {
  try {
    const url = req.query.url;
    const stream = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'http://legit.site'
      }
    });
    stream.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching segment');
  }
});

// Railway يعتمد على PORT من البيئة
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
