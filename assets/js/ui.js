const songGrid = document.getElementById("songs");
const latestRelease = document.getElementById("latestRelease");
const playlistList = document.getElementById("playlistList");
const detailOverlay = document.getElementById("songDetailOverlay");
const detailContent = document.getElementById("songDetailContent");
const closeDetail = document.getElementById("closeDetail");
const searchInput = document.getElementById("songSearch");
const searchToggle = document.getElementById("searchToggle");
const menuToggle = document.getElementById("menuToggle");
const topnav = document.querySelector(".topnav");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

let currentSongs = [];

export function initializeUI() {
  currentSongs = [...songs];
  renderSongs();
  renderLatestRelease();
  renderPlaylist();
  bindEvents();
  applyTheme(
    localStorage.getItem("music-theme") || CONFIG.defaultTheme || "dark",
  );
}

function bindEvents() {
  searchInput?.addEventListener("input", handleSearch);
  searchToggle?.addEventListener("click", toggleSearch);
  menuToggle?.addEventListener("click", toggleMenu);
  sortSelect?.addEventListener("change", handleSort);
  themeToggle?.addEventListener("click", toggleTheme);
  closeDetail?.addEventListener("click", closeSongDetail);
  detailOverlay?.addEventListener("click", (event) => {
    if (event.target === detailOverlay) closeSongDetail();
  });
  document.addEventListener("player:songchange", (event) => {
    const { song } = event.detail;
    window.__currentSong = song;
    renderSongs();
    renderPlaylist();
  });
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  const filtered = songs.filter((song) => {
    return [song.title, song.artist, song.genre].some((value) =>
      value.toLowerCase().includes(query),
    );
  });
  currentSongs = filtered;
  renderSongs();
}

function toggleSearch() {
  const searchField = document.querySelector(".search-field");
  const isActive = searchField?.classList.toggle("active");
  if (searchToggle && typeof isActive !== "undefined") {
    searchToggle.setAttribute("aria-expanded", String(isActive));
  }
  if (isActive && searchInput) {
    setTimeout(() => searchInput.focus(), 0);
  }
}

function toggleMenu() {
  const isExpanded = topnav?.classList.toggle("expanded");
  if (menuToggle && typeof isExpanded !== "undefined") {
    menuToggle.setAttribute("aria-expanded", String(isExpanded));
  }
}

function handleSort(event) {
  const mode = event.target.value;
  const sorted = [...currentSongs];

  switch (mode) {
    case "oldest":
      sorted.sort((a, b) => new Date(a.release) - new Date(b.release));
      break;
    case "alphabet":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "genre":
      sorted.sort((a, b) => a.genre.localeCompare(b.genre));
      break;
    case "duration":
      sorted.sort(
        (a, b) => parseDuration(a.duration) - parseDuration(b.duration),
      );
      break;
    default:
      sorted.sort((a, b) => new Date(b.release) - new Date(a.release));
  }

  currentSongs = sorted;
  renderSongs();
}

function renderLatestRelease() {
  const featured = songs[0];
  latestRelease.innerHTML = `
    <div class="latest-release-card">
      <img src="${featured.artwork}" alt="${featured.title}" />
      <div class="latest-metadata">
        <span>${featured.genre}</span>
        <span>${featured.duration}</span>
      </div>
      <h3>${featured.title}</h3>
      <p>${featured.artist}</p>
      <button class="song-play-btn" data-song-id="${featured.id}"><i class="fa-solid fa-play"></i></button>
    </div>
    <div class="latest-release-card">
      <h3>Release Highlights</h3>
      <p>Spotify-style bottom player, Musixmatch-inspired lyrics overlay, dan chord transpose siap dipakai pada pengalaman single-page yang halus.</p>
      <ul>
        <li>Realtime search</li>
        <li>Queue panel</li>
        <li>Lyrics fullscreen</li>
      </ul>
    </div>`;

  latestRelease
    .querySelector(".song-play-btn")
    ?.addEventListener("click", (event) => {
      const songId = Number(event.currentTarget.getAttribute("data-song-id"));
      document.dispatchEvent(
        new CustomEvent("playSelectedSong", { detail: { songId } }),
      );
    });
}

function renderSongs() {
  if (!songGrid) return;
  songGrid.innerHTML = currentSongs
    .map((song) => {
      const isPlaying = window.__currentSong?.id === song.id;
      return `
      <article class="song-card ${isPlaying ? "is-playing" : ""}">
        <img src="${song.artwork}" alt="${song.title}" />
        <div class="song-top">
          <div>
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
          </div>
          <div class="detail-actions">
            <button class="song-play-btn" data-song-id="${song.id}"><i class="fa-solid fa-play"></i></button>
            <button class="small-btn" data-song-detail-id="${song.id}"><i class="fa-solid fa-circle-info"></i></button>
          </div>
        </div>
        <div class="song-footer">
          <span>${song.genre}</span>
          <span>${song.duration}</span>
        </div>
      </article>`;
    })
    .join("");

  songGrid.querySelectorAll(".song-play-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = Number(button.getAttribute("data-song-id"));
      document.dispatchEvent(
        new CustomEvent("playSelectedSong", { detail: { songId } }),
      );
    });
  });

  songGrid.querySelectorAll("[data-song-detail-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = Number(button.getAttribute("data-song-detail-id"));
      openSongDetail(songId);
    });
  });
}

function renderPlaylist() {
  if (!playlistList) return;
  playlistList.innerHTML = songs
    .map((song) => {
      const isPlaying = window.__currentSong?.id === song.id;
      return `
      <div class="playlist-row ${isPlaying ? "is-playing" : ""}">
        <div class="playlist-main">
          <img src="${song.artwork}" alt="${song.title}" />
          <div>
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
          </div>
        </div>
        <div class="playlist-meta">
          <span>${song.genre}</span>
          <span>${song.duration}</span>
          <button class="small-btn" data-song-detail-id="${song.id}"><i class="fa-solid fa-circle-info"></i></button>
          <button class="song-play-btn" data-song-id="${song.id}"><i class="fa-solid fa-play"></i></button>
        </div>
      </div>`;
    })
    .join("");

  playlistList.querySelectorAll(".song-play-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = Number(button.getAttribute("data-song-id"));
      document.dispatchEvent(
        new CustomEvent("playSelectedSong", { detail: { songId } }),
      );
    });
  });

  playlistList.querySelectorAll("[data-song-detail-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = Number(button.getAttribute("data-song-detail-id"));
      openSongDetail(songId);
    });
  });
}

function openSongDetail(songId) {
  const song = songs.find((item) => item.id === songId);
  if (!song) return;

  detailContent.innerHTML = `
    <div class="detail-hero">
      <img src="${song.artwork}" alt="${song.title}" />
      <div>
        <p class="eyebrow">Song Detail</p>
        <h2>${song.title}</h2>
        <p>${song.artist}</p>
        <div class="detail-actions">
          <button class="primary-btn" data-song-id="${song.id}"><i class="fa-solid fa-play"></i> Putar</button>
          <button class="secondary-btn" data-open-lyrics="${song.id}"><i class="fa-solid fa-microphone-lines"></i> Lirik</button>
        </div>
      </div>
    </div>
    <div class="detail-actions">
      <span>${song.genre}</span>
      <span>${song.duration}</span>
      <span>${song.release}</span>
    </div>
    <p>"${song.title}" adalah bagian dari karya Eben yang menggabungkan emosi personal, warna visual, dan pengalaman mendengar yang intim.</p>
    <p>Detail lagu ini bisa dikembangkan lebih lanjut dengan story lyric, chord, atau note produksi sesuai kebutuhan.</p>
  `;

  detailOverlay?.classList.add("is-open");

  detailContent
    .querySelector("[data-song-id]")
    ?.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("playSelectedSong", { detail: { songId } }),
      );
      closeSongDetail();
    });

  detailContent
    .querySelector("[data-open-lyrics]")
    ?.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("playSelectedSong", { detail: { songId } }),
      );
      document.getElementById("lyricsButton")?.click();
      closeSongDetail();
    });
}

function closeSongDetail() {
  detailOverlay?.classList.remove("is-open");
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains("theme-light")
    ? "light"
    : "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-light", theme === "light");
  const icon = themeToggle?.querySelector("i");
  if (icon) {
    icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  localStorage.setItem("music-theme", theme);
}

function parseDuration(value) {
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
