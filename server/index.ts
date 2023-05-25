import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {auth} from "./src/api";
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({ credentials: true, origin: "*" }));
const port = process.env.PORT || 4000;

app.use(morgan('combined'));

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use("/auth", auth);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
