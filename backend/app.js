import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));               // ✅ JSON body
app.use(express.urlencoded({ limit: "40kb", extended: true })); // ✅ FORM body

app.use("/api/v1/users", userRoutes);

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://wwwpratik4696_db_user:DP7dYjhKgSkkYM40@callify.4trrlax.mongodb.net/"
    );
    console.log(`MongoDB connected: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`Server running on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("Server start error:", err);
  }
};

start();
