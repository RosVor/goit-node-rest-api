import "dotenv/config";
import express from "express";
import cors from "cors"
import morgan from "morgan";;
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

const { DB_HOST, PORT = 3000 } = process.env;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

export default app;