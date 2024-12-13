import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
  getRoomsByHotel,
  deleteRoomAvailability,
  checkAvailability
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", updateRoom);
//DELETE
router.delete("/:id", deleteRoom);
//GET

router.get("/:id", getRoom);
//GET ALL

router.get("/", getRooms);
router.get("/byHotel/:id_hotel", getRoomsByHotel);
router.put("/availability/delete/:id", deleteRoomAvailability);
router.post("/availability/check/:id", checkAvailability);

export default router;
