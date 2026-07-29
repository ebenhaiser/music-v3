import { formatTime } from "./ui.js";

let currentSongIndex = 0;
let audio = null;
let isPlaying = false;
let shuffleEnabled = false;
let repeatEnabled = false;
let currentQueue = [];

const elements = {
  playPauseButton: document.getElementById("playPauseButton"),
  prevButton: document.getElementById("prevButton"),
  nextButton: document.getElementById("nextButton"),
  shuffleButton: document.getElementById("shuffleButton"),
  repeatButton: document.getElementById("repeatButton"),
  seekBar: document.getElementById("seekBar"),
  volumeControl: document.getElementById("volumeControl"),
  playerTitle: document.getElementById("playerTitle"),
  playerArtist: document.getElementById("playerArtist"),
  playerArtwork: document.getElementById("playerArtwork"),
  currentProgress: document.getElementById("currentProgress"),
  totalProgress: document.getElementById("totalProgress"),
  playHeroButton: document.getElementById("playHeroButton"),
  heroArtwork: document.getElementById("heroArtwork"),
  heroTitle: document.getElementById("heroTitle"),
  heroArtist: document.getElementById("heroArtist"),
};

export function initializePlayer() {
  currentQueue = [...songs];
  audio = new Audio();
  audio.volume = 0.8;

  bindEvents();
  setActiveSong(0);
  updateButtonStates();
}

function bindEvents() {
  elements.playPauseButton?.addEventListener("click", togglePlayback);
  elements.playHeroButton?.addEventListener("click", () => playSong(0));
  elements.prevButton?.addEventListener("click", playPrevious);
  elements.nextButton?.addEventListener("click", playNext);
  elements.shuffleButton?.addEventListener("click", toggleShuffle);
  elements.repeatButton?.addEventListener("click", toggleRepeat);
  elements.seekBar?.addEventListener("input", handleSeek);
  elements.volumeControl?.addEventListener("input", handleVolume);
  document.addEventListener("playSelectedSong", handlePlaySelectedSong);

  audio.addEventListener("timeupdate", updateTimeDisplay);
  audio.addEventListener("ended", handleSongEnd);
  audio.addEventListener("loadedmetadata", () => {
    elements.totalProgress.textContent = formatTime(audio.duration || 0);
    elements.seekBar.max = String(Math.floor(audio.duration || 0));
  });
}

export function playSong(index) {
  if (!currentQueue[index]) return;
  currentSongIndex = index;
  const song = currentQueue[index];
  audio.src = song.audio;
  audio.currentTime = 0;
  audio.play().catch(() => {});
  isPlaying = true;
  setActiveSong(index);
  updateButtonStates();
}

function togglePlayback() {
  if (!audio.src) {
    playSong(currentSongIndex);
    return;
  }

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().catch(() => {});
    isPlaying = true;
  }
  updateButtonStates();
}

function handlePlaySelectedSong(event) {
  const { songId, index } = event.detail || {};

  if (songId !== undefined) {
    const targetIndex = currentQueue.findIndex((song) => song.id === songId);
    if (targetIndex >= 0) {
      playSong(targetIndex);
      return;
    }
  }

  if (Number.isInteger(index)) {
    playSong(index);
  }
}

function playPrevious() {
  const nextIndex =
    currentSongIndex > 0 ? currentSongIndex - 1 : currentQueue.length - 1;
  playSong(nextIndex);
}

function playNext() {
  const nextIndex =
    currentSongIndex < currentQueue.length - 1 ? currentSongIndex + 1 : 0;
  playSong(nextIndex);
}

function handleSongEnd() {
  if (repeatEnabled) {
    playSong(currentSongIndex);
    return;
  }
  playNext();
}

function toggleShuffle() {
  shuffleEnabled = !shuffleEnabled;
  updateButtonStates();
}

function toggleRepeat() {
  repeatEnabled = !repeatEnabled;
  updateButtonStates();
}

function handleSeek(event) {
  audio.currentTime = Number(event.target.value);
}

function handleVolume(event) {
  audio.volume = Number(event.target.value) / 100;
}

function updateTimeDisplay() {
  const currentTime = audio.currentTime || 0;
  elements.currentProgress.textContent = formatTime(currentTime);
  elements.seekBar.value = String(Math.floor(currentTime));
  document.dispatchEvent(
    new CustomEvent("player:timeupdate", {
      detail: { currentTime, duration: audio.duration || 0 },
    }),
  );
}

function updateButtonStates() {
  const playIcon = elements.playPauseButton?.querySelector("i");
  if (playIcon) {
    playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }

  elements.shuffleButton?.classList.toggle("active", shuffleEnabled);
  elements.repeatButton?.classList.toggle("active", repeatEnabled);
}

function setActiveSong(index) {
  const song = currentQueue[index];
  if (!song) return;

  window.__currentSong = song;
  elements.playerTitle.textContent = song.title;
  elements.playerArtist.textContent = song.artist;
  elements.playerArtwork.src = song.artwork;
  elements.heroArtwork.src = song.artwork;
  elements.heroTitle.textContent = song.title;
  elements.heroArtist.textContent = song.artist;
  elements.totalProgress.textContent = song.duration;
  elements.seekBar.value = "0";

  document.dispatchEvent(
    new CustomEvent("player:songchange", { detail: { song, index } }),
  );
}

export function getCurrentSong() {
  return currentQueue[currentSongIndex] || null;
}

export function getCurrentQueue() {
  return currentQueue;
}
