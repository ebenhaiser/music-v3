import { initializePlayer } from "./player.js";
import { initializeLyrics } from "./lyrics.js";
import { initializeQueue } from "./queue.js";
import { initializeUI } from "./ui.js";

window.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  initializePlayer();
  initializeLyrics();
  initializeQueue();
});
