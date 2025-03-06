import mongoose from "mongoose";

let connectionState: number;

async function dbConnect() {
  if (connectionState === 1) {
    console.log("✅ Conected to MongoDB");
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI || "", {
    bufferCommands: false, // Deshabilita el buffering de Mongoose
    serverSelectionTimeoutMS: 5000, // Timeout de conexión
    socketTimeoutMS: 45000, // Timeout de operaciones
  });
  
  connectionState = db.connections[0].readyState;
}

export default dbConnect;
