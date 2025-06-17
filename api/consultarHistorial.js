// api/consultarHistorial.js
import { db } from "../firebaseAdmin.js";

export default async function handler(req, res) {
  // Soporte para CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { usuarioId } = req.query;

  if (!usuarioId) {
    return res.status(400).json({ error: "Falta el parámetro usuarioId" });
  }

  try {
    const snapshot = await db
      .collection("analisisUsuarios")
      .where("usuarioId", "==", usuarioId)
      .orderBy("fecha", "desc")
      .get();

    const historial = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha.toDate().toISOString(),
    }));

    res.status(200).json({ historial });
  } catch (error) {
    console.error("Error al consultar historial:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
