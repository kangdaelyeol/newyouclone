import mongoose from "mongoose"

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;


const dbOpenListening = () => console.log("✔connect db👍");

db.on("error", (error) => console.log("error DB!", error));
db.once("open", dbOpenListening);