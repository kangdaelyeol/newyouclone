import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("startbtn");
const video = document.getElementById("videoframe");

let stream;
let recorder;
let videoURL;

const files = {
  input: "recorder",
  output: "output.mp4",
  thumb: "thumb.jpg"
}

const downFile = (fileName, fileURL) => {
  const a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  document.body.append(a);
  a.click();
}
//- for clean code method, varObj, globalVar

const handleDownloadBtn = async () => {
  actionBtn.removeEventListener("click", handleDownloadBtn);
  actionBtn.disabled = true;
  actionBtn.innerText="Transcoding..."
  const ffmpeg = createFFmpeg({
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoURL));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb,
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);


  const mp4blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbblob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4blob);
  const thumbUrl = URL.createObjectURL(thumbblob);

  
  downFile("simple.mp4", mp4Url);
  downFile("simple.jpg", thumbUrl);
  
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  ffmpeg.FS("unlink", files.input);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoURL);
  
  actionBtn.disabled = false;
  actionBtn.innerText = "Recording again";
  actionBtn.addEventListener("click", handleStartBtn);
};

const handleStopBtn = () => {
  actionBtn.innerText = "download video";
  actionBtn.removeEventListener("click", handleStopBtn);
  actionBtn.addEventListener("click", handleDownloadBtn);
  recorder.stop();
};

const handleStartBtn = () => {
  if(!video.srcObject){
    video.srcObject = stream;
    video.play();
  }
  actionBtn.innerText = "stop record";
  actionBtn.removeEventListener("click", handleStartBtn);
  actionBtn.addEventListener("click", handleStopBtn);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    videoURL = URL.createObjectURL(e.data);
    console.log(e);
    console.log(e.data);
    console.log(videoURL);
    video.srcObject = null;
    video.src = videoURL;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { height: 300, width: 300 },
    audio: false,
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStartBtn);
