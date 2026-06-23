import {z} from "zod";

const envSchema = z.object({
    NODE_ENV:z.enum(["development", "test", "production"]).default("production"),
    PORT :z.string().default("3000"),
    DATABASE_URL:z.string().url(),
    JWT_ACCESS_SECRET:z.string().min(32),
    JWT_REFRESH_SECRET:z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});


const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}   


export const env = parsed.data;
