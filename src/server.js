require("dotenv").config();
const express = require("express");
const eventsRoutes = require("./routes/events.routes");

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/v3/app/events", eventsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
