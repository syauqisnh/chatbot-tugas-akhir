# chatbot-tugas-akhir

## Instalasi Backend - Chatbot oleh Syauqi Nur Hibatullah
Berikut adalah langkah-langkah untuk melakukan instalasi backend chatbot menggunakan NodeJS ExpressJS:
#### 1. Install Semua Dependensi
Jalankan perintah berikut untuk menginstall semua dependensi yang diperlukan:
**npm install**
#### 2. Membuat Database
Setelah menginstall dependensi, buat database dengan perintah:
**npx sequelize-cli db:create**
#### 3. Migrasi Database
Lakukan migrasi database untuk membuat tabel yang diperlukan:
**npx sequelize-cli db:migrate**
#### 4. Isi Data Awal (Seeding)
Isi tabel dengan data awal yang diperlukan untuk menjalankan aplikasi:
**npx sequelize-cli db:seed:all**
#### 5. Menjalankan Aplikasi
**npm run dev**