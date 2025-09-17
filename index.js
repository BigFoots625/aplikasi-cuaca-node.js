require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const cityBackgrounds = {
  'jakarta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/National_Monument_%28Monas%29%2C_Jakarta.jpg/800px-National_Monument_%28Monas%29%2C_Jakarta.jpg',
  'bandung': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Gedung_Sate_Bandung_Jawa_Barat.jpg/1024px-Gedung_Sate_Bandung_Jawa_Barat.jpg',
  'surabaya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tugu_Pahlawan_Surabaya_4.jpg/800px-Tugu_Pahlawan_Surabaya_4.jpg',
  'medan': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Istana_Maimun_Medan_Sumatera_Utara.jpg'
};

app.set('view engine', 'ejs');

const apiKey = process.env.API_KEY; 

// Rute 1: Halaman utama untuk memilih kota
app.get('/', (req, res) => {
  // Langsung render halaman pilihan-kota.ejs tanpa mengambil data cuaca
  res.render('pilihan-kota');
});

// Rute 2: Halaman untuk menampilkan detail cuaca kota tertentu
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  try {
    const response = await axios.get(url);
    const dataCuaca = response.data;

    // BARU: Cari URL background berdasarkan nama kota (dibuat case-insensitive)
    const backgroundUrl = cityBackgrounds[city.toLowerCase()] || 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986'; // URL default jika kota tidak ditemukan

    // BARU: Kirim backgroundUrl bersama dataCuaca
    res.render('detail-cuaca', { 
      dataCuaca: dataCuaca,
      backgroundUrl: backgroundUrl // Kirim variabel baru ini
    });

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.render('detail-cuaca', { 
      dataCuaca: undefined,
      backgroundUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986' // URL default untuk halaman error
    });
  }
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});