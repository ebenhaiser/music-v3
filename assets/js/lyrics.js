import { getCurrentSong } from "./player.js";

let currentMode = "lyrics";
let transpose = 0;
let activeIndex = 0;

const lyricElements = {
  overlay: document.getElementById("lyricsOverlay"),
  title: document.getElementById("lyricsTitle"),
  artist: document.getElementById("lyricsArtist"),
  artwork: document.getElementById("lyricsArtwork"),
  content: document.getElementById("lyricsContent"),
  progressFill: document.getElementById("lyricsProgressFill"),
  currentTime: document.getElementById("currentTime"),
  durationTime: document.getElementById("durationTime"),
  lyricsButton: document.getElementById("lyricsButton"),
  closeLyrics: document.getElementById("closeLyrics"),
  lyricsModeButton: document.getElementById("lyricsModeButton"),
  chordModeButton: document.getElementById("chordModeButton"),
  transposeButtons: document.getElementById("transposeButtons"),
};

export function initializeLyrics() {
  bindEvents();
  renderTransposeButtons();
  document.addEventListener("player:songchange", handleSongChange);
  document.addEventListener("player:timeupdate", handleTimeUpdate);
}

function bindEvents() {
  lyricElements.lyricsButton?.addEventListener("click", openLyrics);
  lyricElements.closeLyrics?.addEventListener("click", closeLyrics);
  lyricElements.lyricsModeButton?.addEventListener("click", () =>
    setMode("lyrics"),
  );
  lyricElements.chordModeButton?.addEventListener("click", () =>
    setMode("chord"),
  );
}

function openLyrics() {
  lyricElements.overlay?.classList.add("is-open");
}

function closeLyrics() {
  lyricElements.overlay?.classList.remove("is-open");
}

function setMode(mode) {
  currentMode = mode;
  lyricElements.lyricsModeButton?.classList.toggle("active", mode === "lyrics");
  lyricElements.chordModeButton?.classList.toggle("active", mode === "chord");
  renderLyrics();
}

function renderTransposeButtons() {
  const values = [-3, -2, -1, 0, 1, 2, 3];
  lyricElements.transposeButtons.innerHTML = values
    .map((value) => {
      const label = value > 0 ? `+${value}` : `${value}`;
      return `<button class="${value === transpose ? "active" : ""}" data-value="${value}">${label}</button>`;
    })
    .join("");

  lyricElements.transposeButtons
    .querySelectorAll("button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        transpose = Number(button.dataset.value);
        renderTransposeButtons();
        renderLyrics();
      });
    });
}

function handleSongChange(event) {
  const song = event.detail?.song || getCurrentSong();
  if (!song) return;
  lyricElements.title.textContent = song.title;
  lyricElements.artist.textContent = song.artist;
  lyricElements.artwork.src = song.artwork;
  lyricElements.currentTime.textContent = "00:00";
  lyricElements.durationTime.textContent = song.duration;
  activeIndex = 0;
  renderLyrics();
}

function handleTimeUpdate(event) {
  const { currentTime, duration } = event.detail;
  const progress = duration ? (currentTime / duration) * 100 : 0;
  lyricElements.progressFill.style.width = `${progress}%`;
  lyricElements.currentTime.textContent = formatTime(currentTime);
  lyricElements.durationTime.textContent = formatTime(duration);

  if (!currentSongLyrics()) return;

  const lyrics = currentSongLyrics();
  for (let index = lyrics.length - 1; index >= 0; index -= 1) {
    if (lyrics[index].time <= currentTime) {
      activeIndex = index;
      break;
    }
  }
  renderLyrics();
}

function renderLyrics() {
  const song = getCurrentSong();
  if (!song || !song.lyrics) {
    lyricElements.content.innerHTML =
      '<p class="lyric-line">Lirik belum tersedia.</p>';
    return;
  }

  const lyrics = song.lyrics;
  const content = lyrics
    .map((line, index) => {
      let className = "lyric-line";
      if (index === activeIndex) className += " is-current";
      else if (index === activeIndex - 1) className += " is-prev";
      else if (index === activeIndex + 1) className += " is-next";
      return `<div class="${className}">${line.text}</div>`;
    })
    .join("");

  lyricElements.content.innerHTML = content;
}

function currentSongLyrics() {
  const song = getCurrentSong();
  return song?.lyrics || [];
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
