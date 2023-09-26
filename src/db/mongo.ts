import mongoose, { Schema, connect, createConnection, model } from "mongoose"
const MONGO_URI = "mongodb://localhost:27017/nodejs"

export const conn = await mongoose.createConnection(MONGO_URI)
