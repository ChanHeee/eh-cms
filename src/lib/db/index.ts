import { MONGODB_URI } from "$lib/env"
import mongoose from "mongoose"

export const conn = await mongoose.createConnection(MONGODB_URI)
