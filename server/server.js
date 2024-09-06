import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/msg.route.js";
import userRoutes from "./routes/user.route.js";
import connectdb from "./db/connect.js";

dotenv.config();
const PORT = process.env.PORT;
console.log("passed 1");
const __dirname = path.resolve();
console.log("passed 2");

app.use(express.json());
app.use(cookieParser());

console.log("passed 3");
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

console.log("passed 4");
app.use(express.static(path.join(__dirname, "/client/dist")));
console.log("passed 5");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

console.log("passed 6");
server.listen(PORT, () => {
  connectdb();
  console.log("server is on");
});
