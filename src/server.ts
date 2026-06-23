import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config(); 
import app from "./app";
import { env } from "./config/env";
import { AppDataSource } from "./config/database";

const startServer =  async()=>{
    try {
       await AppDataSource.initialize();
       console.log("✅ Database connected");

       app.listen(env.PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${env.PORT}`);
        });

    } catch (error) {
         console.error("❌ Failed to start server:", error);
         process.exit(1);
    }
}

startServer();