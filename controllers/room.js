import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {

  // Convertimos las fechas a objetos Date
  const newUnavailablePeriod = {
    startDate: new Date(req.body.dates[0]['startDate']),
    endDate: new Date(req.body.dates[0]['endDate']),
  };

  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Agregar el nuevo periodo de fechas al array de unavailableDates
    room.unavailableDates.push(newUnavailablePeriod);

    // Guardar los cambios
    await room.save();

    res.status(200).json("Room availability has been updated.");
  } catch (err) {
    next(err);
  }
};


export const deleteRoom = async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomsByHotel = async (req, res, next) => {
  try {
    let idhotel = req.params.id_hotel;

    // Obtener el hotel por su ID
    const hotel = await Hotel.findById(idhotel);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    // Obtener las habitaciones por los IDs almacenados en el campo 'rooms' del hotel
    const rooms = await Room.find({
      '_id': { $in: hotel.rooms }  // Usamos $in para obtener habitaciones por los IDs en el array
    });

    // Retornar el hotel junto con sus habitaciones
    res.status(200).json({ hotel, rooms });
  } catch (err) {
    next(err);
  }
};

export const deleteRoomAvailability = async (req, res, next) => {
  try {
    // Validar datos de entrada
    if (!req.params.id || !req.body.dates) {
      return res.status(400).json("Invalid request data.");
    }

    // Convertir las fechas a objetos Date
    const datesToDelete = {
      startDate: req.body.dates.startDate,
      endDate: req.body.dates.endDate,
    };

    // Actualizar la habitación y eliminar las fechas correspondientes
    const result = await Room.updateOne(
      { _id: req.params.id }, // Aquí usamos el ID de la habitación directamente
      {
        $pull: {
          unavailableDates: datesToDelete,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json("No reservation dates were deleted.");
    }

    res.status(200).json("Reservation dates have been deleted.");
  } catch (err) {
    next(err);
  }
};




export const checkAvailability = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    const { dates } = req.body;

    const isAvailable = dates.every((date) => {
      return room.unavailableDates.every((unavailableDate) =>
        new Date(unavailableDate.startDate).getTime() !== new Date(date).getTime() &&
        new Date(unavailableDate.endDate).getTime() !== new Date(date).getTime()
      );
    });

    if (isAvailable) {
      res.status(200).json({ available: true, message: "Room is available." });
    } else {
      res.status(200).json({ available: false, message: "Room is not available for the selected dates." });
    }
  } catch (err) {
    next(err);
  }
};