import express from "express"
import morgan from "morgan"
import session from "express-session"
import flash from "express-flash"
import MongoStore from "connect-mongo"
import rootRouter from "./routers/rootRouter"
import videoRouter from "./routers/videoRouter"
import userRouter from "./routers/userRouter"
import { localsMiddware } from "./middwares"
import apiRouter from "./routers/apiRouter"

const app = express();
const logger = morgan("dev");
process.cwd();
app.use(logger);
app.set('view engine', 'pug');
app.set('views', process.cwd() + "/src/views");

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session(
    {
        secret: process.env.SECRET_CODE,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.MONGO_URL})
    }
));

app.get("/add-one", (req, res) => {
    return res.send(req.session);
})
app.use(flash())
app.use(localsMiddware);
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app