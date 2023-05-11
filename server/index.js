"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const _api_1 = require("@api");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: "*" }));
const port = process.env.PORT || 4000;
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.use("/auth", _api_1.auth);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
