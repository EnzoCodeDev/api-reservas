import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    unavailableDates: [
      {
        startDate: { type: Date },  // Fecha de inicio
        endDate: { type: Date },    // Fecha de fin
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
