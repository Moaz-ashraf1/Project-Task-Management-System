import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import  globalErrorHandler  from "./shared/middlewares/error.middleware";


const app = express();


app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});


app.use(globalErrorHandler);

export default app;