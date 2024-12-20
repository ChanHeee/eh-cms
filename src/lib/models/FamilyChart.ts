import { conn } from "$lib/db"
import type {
  IChart,
  IFamilyChart,
  IFamilyChartRelation,
} from "$lib/interfaces"
import { Schema } from "mongoose"

const relationSchema = new Schema<IFamilyChartRelation>({
  father: { type: Schema.Types.ObjectId, ref: "seongdo" },
  mother: { type: Schema.Types.ObjectId, ref: "seongdo" },
  spouses: [{ type: Schema.Types.ObjectId, ref: "seongdo" }],
  children: [{ type: Schema.Types.ObjectId, ref: "seongdo" }],
})

const chartSchema = new Schema<IChart>({
  id: { type: Schema.Types.ObjectId, ref: "seongdo" },
  rels: { type: relationSchema },
})
const familyChartSchema = new Schema<IFamilyChart>({
  charts: [{ type: chartSchema, default: [] }],
})

export const FamilyChart = conn.model<IFamilyChart>(
  "familyChart",
  familyChartSchema
)
