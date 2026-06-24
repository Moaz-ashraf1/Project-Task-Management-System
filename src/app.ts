import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import  globalErrorHandler  from "./shared/middlewares/error.middleware";
import authRouter from "./domain_modules/auth/auth.router";
import projectRoutes from "./domain_modules/project/project.routes";


const app = express();


app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRoutes);



app.use(globalErrorHandler);

export default app;