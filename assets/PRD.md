# PRD — Music Web v2 (Spotify-style Bottom Player + Musixmatch-style Lyrics)

## 1. Project Overview

**Project Name:** Music Web

Music Web adalah website static untuk menampilkan lagu original beserta artwork, audio, lirik sinkron (LRC), dan chord gitar. Website berjalan sepenuhnya di sisi client menggunakan HTML, CSS, dan Vanilla JavaScript tanpa backend maupun database, sehingga dapat di-host langsung menggunakan GitHub Pages.

Fokus utama adalah memberikan pengalaman seperti **Spotify + Musixmatch**, tetapi khusus untuk lagu-lagu original.

---

# 2. Goals

* Showcase seluruh lagu original
* UX modern seperti Spotify
* Lyrics experience seperti Musixmatch
* Mudah menambah lagu baru
* Tidak membutuhkan backend
* Mudah di-maintain

---

# 3. Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript (ES Modules)
* Font Awesome
* Google Fonts
* GitHub Pages

No:

* Database
* API
* Framework

---

# 4. Folder Structure

```text
music-web/

index.html

assets/
│
├── artwork/
├── audio/
├── lyric/
├── chord/
├── css/
│     style.css
│     player.css
│     lyrics.css
│     responsive.css
│
├── js/
│     app.js
│     player.js
│     lyrics.js
│     chord.js
│     queue.js
│     ui.js
│     storage.js
│
└── img/

data/
    songs.js

README.md
```

---

# 5. Layout

```
+--------------------------------------+

Navbar

+--------------------------------------+

Hero

Latest Release

Popular Songs

Album Grid

About

+--------------------------------------+

Bottom Player (Always Visible)

+--------------------------------------+
```

Player tidak berpindah halaman.

Seluruh website menggunakan **Single Page Experience**.

---

# 6. Bottom Player (Spotify Style)

Player selalu berada di bagian bawah layar.

```
--------------------------------------------------------------

Artwork

Song Title

Artist

♡

Previous

Play

Next

Shuffle

Repeat

Current Time

Progress Bar

Duration

Volume

Queue

Lyrics

--------------------------------------------------------------
```

Player tetap berjalan walaupun user berpindah menu.

---

# 7. Mini Player

Saat website dibuka:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎵

Artwork

Title

Artist

▶

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Saat lagu diputar artwork akan berputar perlahan.

---

# 8. Full Player

Ketika artwork atau tombol Expand diklik.

```
Artwork Besar

Judul

Artist

Progress

Control

Volume

Queue

Lyrics Button

```

Muncul menggunakan smooth animation.

---

# 9. Lyrics Experience (Musixmatch Style)

Saat tombol Lyrics ditekan.

Muncul panel fullscreen.

```
Artwork Blur Background

Judul Lagu

Artist

-------------------

Lorem ipsum

Lorem ipsum

>> Current Line <<

Lorem ipsum

Lorem ipsum

-------------------

Progress

```

Background memakai artwork yang diblur.

---

# 10. Lyrics Features

Menggunakan file

```
.lrc
```

Support

✅ Auto Scroll

✅ Current Line Highlight

✅ Fade Animation

✅ Smooth Scroll

✅ Click lyric untuk seek

✅ Karaoke Effect

---

Contoh

```
[00:03.25]Hello everyone

[00:07.20]Welcome to my song
```

---

# 11. Karaoke Animation

Current lyric:

```
██████████
Today is beautiful
```

Lyric sebelumnya

```
Today is beautiful
```

Lyric berikutnya

```
Tomorrow we'll fly
```

Highlight bergerak mengikuti waktu lagu.

---

# 12. Chord Mode

Toggle

```
Lyrics

Chord
```

Saat aktif.

```
        C

Hello everyone

        G

Welcome home

       Am

How are you
```

Support transpose

```
-3

-2

-1

0

+1

+2

+3
```

---

# 13. Queue

Sidebar kanan.

```
Now Playing

──────────────

Next Songs

Song A

Song B

Song C

Song D
```

Drag & Drop (future).

---

# 14. Song Card

```
+----------------+

Artwork

Title

Artist

Genre

Duration

Play Button

+----------------+
```

Hover:

Artwork zoom.

---

# 15. Search

Realtime.

Mencari berdasarkan

* Title
* Artist
* Genre

---

# 16. Sorting

Newest

Oldest

Alphabet

Genre

Duration

---

# 17. Song Data

Semua data disimpan di

```
data/songs.js
```

Contoh

```javascript
const songs = [
{
    id:1,
    title:"Pelangi Sehabis Hujan",
    artist:"Eben",
    artwork:"assets/artwork/pelangi.jpg",
    audio:"assets/audio/pelangi.mp3",
    lyric:"assets/lyric/pelangi.lrc",
    chord:"assets/chord/pelangi.chord",
    genre:"Island Reggae",
    duration:"04:21",
    release:"2026-07-01"
}
]
```

---

# 18. Configuration

Seluruh konfigurasi dipisahkan agar tidak mengganggu source code.

```
config.js
```

Berisi

```javascript
const CONFIG = {

artistName: "Eben",

websiteName: "Music Web",

defaultTheme: "dark",

accentColor: "#ff4d4d",

enableLyrics: true,

enableChord: true,

enableQueue: true,

enableShuffle: true,

enableRepeat: true

}
```

---

# 19. Local Storage

Menyimpan

* Last Played Song
* Volume
* Theme
* Shuffle
* Repeat
* Queue
* Recently Played

Tidak memakai database.

---

# 20. Theme

Default

Dark Mode

Accent

Spotify Green

atau

Custom Color

---

# 21. Animation

* Artwork Rotation
* Lyrics Fade
* Smooth Scroll
* Card Hover
* Player Slide Up
* Progress Animation
* Volume Animation

Semua menggunakan CSS Animation.

---

# 22. Future Features

* Playlist
* Album Page
* Artist Page
* Favorite Songs
* Continue Listening
* Download Lyrics
* Download Chords
* Mini Visualizer
* Audio Spectrum
* Keyboard Shortcut
* Sleep Timer
* PWA
* Offline Mode
* Multi Language
* SEO Optimization
* Sitemap.xml
* Open Graph
* JSON-LD
* Share Song
* QR Code Song

---

# 23. Architecture

```
HTML
 │
 ▼
UI Components
 │
 ▼
JavaScript Modules
 │
 ├── config.js
 ├── songs.js
 ├── player.js
 ├── lyrics.js
 ├── chord.js
 ├── queue.js
 ├── storage.js
 └── ui.js
 │
 ▼
Audio API + LocalStorage
```

---

# 24. Core Design Principles

* **Spotify-inspired Bottom Player** — Player selalu terlihat dan tetap memutar musik saat pengguna menjelajahi halaman.
* **Musixmatch-inspired Lyrics** — Lirik fullscreen dengan auto-scroll, highlight sinkron, dan efek karaoke untuk pengalaman membaca yang nyaman.
* **Static First** — Seluruh data lagu berasal dari file lokal (`songs.js`, `.lrc`, `.chord`, `.mp3`) tanpa backend.
* **Config Driven** — Seluruh pengaturan global berada di `config.js` agar mudah diubah tanpa menyentuh logika aplikasi.
* **Modular & Scalable** — Menambah lagu cukup dengan menambahkan aset dan satu objek baru di `songs.js`; UI akan memperbarui dirinya secara otomatis.
