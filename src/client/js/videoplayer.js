import fetch from "node-fetch";

const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");

const mute = document.getElementById("mute");
const muteIcon = mute.querySelector("i");

const fullbtn = document.getElementById("fullscreen");
const fullscreenIcon = fullbtn.querySelector("i");

const currentTime = document.getElementById("currenttime");
const totalTime = document.getElementById("totaltime");
const volumeRange = document.getElementById("volume");
const video = document.querySelector("video");
const timeline = document.getElementById("timeline");
const screencontainer = document.getElementById("screencontainer");
const videocontrols = document.getElementById("videocontrols");

video.controls = false;

let showingHandleControl = null;
let showingControl = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtnClick = () => {
  console.log("playbtnclick");
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolume = (e) => {
  const {
    target: { value },
  } = e;
  if (video.muted) {
    video.muted = false;
    muteIcon.className = "fas fa-volume-up";
  }
  if (value == 0) muteIcon.className = "fas fa-volume-mute";
  else muteIcon.className = "fas fa-volume-up";
  video.volume = value;
  volumeValue = value;
};

const timeFormat = (second) =>
  new Date(second * 1000).toISOString().substr(11, 8);

const handleMetaData = () => {
  totalTime.innerText = timeFormat(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = timeFormat(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimeline = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleFullscreen = (e) => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullscreenIcon.className = "fas fa-expand";
  } else {
    screencontainer.requestFullscreen();
    fullscreenIcon.className = "fas fa-expand-arrows-alt";
  }
};

const removeShowing = () => videocontrols.classList.remove("showing");

const handleMousemove = () => {
  if (showingControl) {
    clearTimeout(showingControl);
    showingControl = null;
  }
  if (showingHandleControl) {
    clearTimeout(showingHandleControl);
    showingHandleControl = null;
  }
  showingHandleControl = setTimeout(removeShowing, 2000);
  videocontrols.classList.add("showing");
};

const handleMouseleave = () => {
  showingControl = setTimeout(removeShowing, 2000);
};

const handleKeydown = (e) => {
  if (e.key === " " || e.key === "Enter") handlePlayBtnClick();
};

const handleEnded = () => {
  const { id } = screencontainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

video.addEventListener("loadedmetadata", handleMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
playBtn.addEventListener("click", handlePlayBtnClick);
video.addEventListener("click", handlePlayBtnClick);
mute.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolume);
timeline.addEventListener("input", handleTimeline);
// 'change' Event
fullbtn.addEventListener("click", handleFullscreen);
screencontainer.addEventListener("mousemove", handleMousemove);
screencontainer.addEventListener("mouseleave", handleMouseleave);
document.addEventListener("keydown", handleKeydown);
// api
video.addEventListener("ended", handleEnded);
