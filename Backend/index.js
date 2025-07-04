const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const api = require("./api");

dotenv.config();

const app = express();

app.use(cors());

app.get("/ping", (_, res) => res.status(200).json({ message: "All Good" }));
app.use("/api", api);

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, process.env.HOST, () =>
      console.log(`Server listening on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
