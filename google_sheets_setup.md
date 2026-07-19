# Panduan Integrasi Google Sheets - Undangan Pernikahan Digital

Panduan ini menjelaskan langkah demi langkah untuk mengintegrasikan undangan digital pernikahan Anda dengan Google Sheets untuk dua tujuan:
1. **Membuat Link Tamu secara Otomatis** (dari daftar nama tamu Anda di Spreadsheet).
2. **Menyimpan Konfirmasi RSVP & Ucapan** secara langsung (*real-time*) dari formulir undangan ke Google Sheets menggunakan Google Apps Script.

---

## BAGIAN 1: Membuat Link Undangan Otomatis di Google Sheets

Jika Anda memiliki ratusan nama tamu, Anda tidak perlu mengetikkan link satu per satu. Anda bisa memanfaatkan formula Google Sheets.

### Langkah-langkah:
1. Buat spreadsheet baru di Google Sheets.
2. Buat kolom sebagai berikut:
   - Kolom **A**: Nama Tamu
   - Kolom **B**: Link Undangan
3. Tulis daftar nama tamu Anda di Kolom **A** (mulai dari baris ke-2). Contoh:
   - A2: `Bapak Jokowi`
   - A3: `Andi & Partner`
   - A4: `Siti Rahmawati, S.Kom`
4. Di sel **B2**, masukkan rumus berikut (ganti `https://domain-anda.com/undangan/index.html` dengan URL undangan Anda yang sebenarnya):
   ```excel
   =CONCATENATE("https://domain-anda.com/undangan/index.html?to=", ENCODEURL(A2))
   ```
   *Catatan: Jika Anda melakukan pengujian secara lokal menggunakan XAMPP, gunakan:*
   ```excel
   =CONCATENATE("http://localhost/undangan/index.html?to=", ENCODEURL(A2))
   ```
5. Tarik ujung kotak sel **B2** ke bawah untuk menduplikasi rumus ke seluruh baris tamu Anda.
6. Google Sheets akan otomatis mengodekan karakter spasi dan simbol (misal `&` menjadi `%26`) sehingga link dapat dibuka dengan sempurna oleh tamu Anda.

---

## BAGIAN 2: Menyimpan RSVP & Ucapan ke Google Sheets

Gunakan langkah-langkah di bawah ini untuk membuat database RSVP otomatis secara gratis tanpa database berbayar.

### Langkah 1: Buat Spreadsheet RSVP
1. Buat Spreadsheet baru di Google Sheets (atau buat Sheet baru di file yang sama). Beri nama Sheet tersebut **RSVP**.
2. Buat baris header pertama di kolom-kolom berikut:
   - Kolom **A**: `Tanggal`
   - Kolom **B**: `Nama Lengkap`
   - Kolom **C**: `Kehadiran`
   - Kolom **D**: `Jumlah Tamu`
   - Kolom **E**: `Ucapan`

### Langkah 2: Buka Google Apps Script
1. Di Google Sheets Anda, klik menu **Ekstensi** (Extensions) -> **Apps Script**.
2. Hapus semua kode default yang ada di dalam editor `Kode.gs`.
3. Salin dan tempel kode berikut ke dalam editor tersebut:

```javascript
function doPost(e) {
  try {
    // Membuka spreadsheet aktif dan sheet pertama (atau ganti nama sheet jika perlu)
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheets()[0]; // mengambil sheet pertama
    
    // Mengambil data yang dikirim dari form undangan
    var name = e.parameter.nama;
    var attendance = e.parameter.kehadiran;
    var guests = e.parameter.jumlah_tamu;
    var message = e.parameter.ucapan;
    var timestamp = new Date(); // Waktu pengiriman
    
    // Menambahkan baris baru di spreadsheet
    sheet.appendRow([timestamp, name, attendance, guests, message]);
    
    // Mengembalikan respon sukses
    return ContentService.createTextOutput(JSON.stringify({"result": "success", "row": sheet.getLastRow()}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // Mengembalikan respon error
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handler GET untuk pengujian koneksi
function doGet(e) {
  return ContentService.createTextOutput("Koneksi Google Apps Script Aktif!");
}
```

4. Simpan proyek dengan mengklik ikon **Simpan** (Floppy Disk) atau menekan `Ctrl + S`. Beri nama proyek, misalnya *RSVP Pernikahan*.

### Langkah 3: Terapkan Script sebagai Web App (Publish)
1. Klik tombol **Terapkan** (Deploy) di sudut kanan atas editor Apps Script -> pilih **Penerapan Baru** (New deployment).
2. Klik ikon gerigi (Pilih jenis penerapan) di sebelah "Terapkan", pilih **Aplikasi web** (Web app).
3. Isi konfigurasi berikut:
   - **Deskripsi**: `RSVP Wedding API`
   - **Jalankan sebagai** (Execute as): **Saya** (Me - email-anda@gmail.com)
   - **Siapa yang memiliki akses** (Who has access): **Siapa saja** (Anyone)
   - *PENTING: Jangan pilih "Siapa saja yang memiliki akun Google", karena pengirim undangan tidak wajib login Google.*
4. Klik **Terapkan** (Deploy).
5. Google akan meminta otorisasi akses. Klik **Berikan Akses** (Authorize Access), pilih akun Gmail Anda.
6. Anda mungkin melihat peringatan "Google belum memverifikasi aplikasi ini". Klik **Lanjutan** (Advanced) di bagian kiri bawah, lalu klik **Buka RSVP Pernikahan (tidak aman)** / **Go to RSVP Pernikahan (unsafe)**.
7. Klik **Izinkan** (Allow).
8. Setelah berhasil, Anda akan mendapatkan **URL Aplikasi Web** (Web app URL). Formatnya mirip seperti ini:
   `https://script.google.com/macros/s/AKfycbzxxxxxxxxx-xxxxxxx/exec`
9. Salin URL tersebut.

### Langkah 4: Hubungkan ke Undangan Digital Anda
1. Buka file generator link tamu (`generator.html`) di browser Anda.
2. Di bagian kanan (panel **Cara Google Sheets**), tempelkan **URL Aplikasi Web** yang sudah Anda salin ke kolom input **URL Web App Google Sheets**.
3. Klik **Simpan URL Sheets**.
4. Selesai! Sekarang sistem undangan Anda secara lokal telah dikonfigurasi untuk mengirim data RSVP. 

Setiap kali ada tamu undangan mengirim konfirmasi kehadiran atau ucapan dari halaman `index.html`, data tersebut akan secara otomatis masuk dan bertambah sebagai baris baru di Google Sheets Anda secara real-time!
