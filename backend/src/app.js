import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";


const app = express();


app.use(express.json());

app.use("/", routes);

mongoose.connect(process.env.MONGO_URI)
    .then(console.log(`Connected to DB: ${process.env.MONGO_URI}`));

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})
