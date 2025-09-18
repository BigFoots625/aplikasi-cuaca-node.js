require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const cityBackgrounds = {
  'jakarta': 'https://cdn.idetrips.com/wp-content/uploads/2018/07/Monas-jakarta-tourism-go-id-930x620.jpg',
  'bandung': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Gedung_Sate_Oktober_2024_-_Rahmatdenas.jpg/1200px-Gedung_Sate_Oktober_2024_-_Rahmatdenas.jpg',
  'surabaya': 'https://images.tokopedia.net/blog-tokopedia-com/uploads/2018/04/Wisata-Malam-Surabaya-4-Travel-Malang.jpg',
  'medan': 'https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/10/2024/01/17/Medan-1-130553358.jpg'
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