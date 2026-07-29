import { getCurrentQueue, getCurrentSong } from "./player.js";

const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const queueButton = document.getElementById("queueButton");
const closeQueue = document.getElementById("closeQueue");

export function initializeQueue() {
  bindEvents();
  renderQueue();
  document.addEventListener("player:songchange", renderQueue);
}

function bindEvents() {
  queueButton?.addEventListener("click", () =>
    queuePanel?.classList.add("is-open"),
  );
  closeQueue?.addEventListener("click", () =>
    queuePanel?.classList.remove("is-open"),
  );
}

function renderQueue() {
  const queue = getCurrentQueue();
  const currentSong = getCurrentSong();
  queueList.innerHTML = queue
    .map((song) => {
      const isCurrent = currentSong && currentSong.id === song.id;
      return `
      <div class="queue-item ${isCurrent ? "is-current" : ""}">
        <div>
          <strong>${song.title}</strong>
          <div class="song-footer">${song.artist} • ${song.genre}</div>
        </div>
        <span>${song.duration}</span>
      </div>`;
    })
    .join("");
}
