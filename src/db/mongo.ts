import mongoose from "mongoose"
import { env } from "$env/dynamic/private"

export const conn = await mongoose.createConnection(env.MONGODB_URI as string)
