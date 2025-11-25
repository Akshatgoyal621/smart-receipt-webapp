import {Schema, model, Document} from "mongoose";

export interface IReceipt extends Document {
  user: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  imageUrl?: string;
  notes?: string;
}

const ReceiptSchema = new Schema<IReceipt>(
  {
    user: {type: Schema.Types.ObjectId as any, ref: "User", required: true},
    title: {type: String, required: true},
    amount: {type: Number, required: true},
    category: {type: String, default: "uncategorized"},
    date: {type: Date, default: Date.now},
    imageUrl: {type: String},
    notes: {type: String},
  },
  {timestamps: true}
);

export default model<IReceipt>("Receipt", ReceiptSchema);
