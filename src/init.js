import "regenerator-runtime";
import "dotenv/config";
import "./db";
// import 파일 이름만 하면 헤더파일 같은 느낌
import "./models/video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4002;

const handleListener = () =>
  console.log(`👀(connection) - http://localhost:${PORT}👍`);

app.listen(PORT, handleListener);
