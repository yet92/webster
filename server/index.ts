import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { auth, projects } from "./src/api";

dotenv.config();

const app = express();
app.use(
    cookieSession({
        name: "session",
        keys: ["openreplay"],
        maxAge: 24 * 60 * 60 * 100,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);
const port = process.env.PORT || 4000;

app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use("/api/auth", auth);
app.use("/api/projects", projects);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
