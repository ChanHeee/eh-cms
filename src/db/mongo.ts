import mongoose from "mongoose"

export const conn = await mongoose.createConnection(import.meta.env.MONGODB_URI)
