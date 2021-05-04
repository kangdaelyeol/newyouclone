import express from "express"

const app = express();

const PORT = 4000;

const handleListener = () => console.log(`👀(connection) - http://localhost:${PORT}👍`);

app.listen(PORT, handleListener);