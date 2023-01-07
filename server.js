require("dotenv").config()
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const recipesRouter = require("./routes/recipes-route");
const port = process.env.PORT || 3200;

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection;
app.use(express.json())

db.on("error", (error) => {
    console.error(error);
})

db.once("open", () => {
    console.log("Connected to database");
})

app.use("/recipes", recipesRouter);


app.listen(port, () => {
    console.log("Server running on port 5000");
})