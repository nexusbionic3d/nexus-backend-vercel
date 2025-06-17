// api/analizarUsuario.js
import { db } from "../firebaseAdmin.js";

export default async function handler(req, res) {
  // Manejo de CORS manual
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { usuarioId, texto } = req.body;

  if (!usuarioId || !texto) {
    return res.status(400).json({ error: "Faltan campos requeridos: texto o usuarioId" });
  }

  try {
    const resultado = {
      emocional: "Estado emocional simulado basado en el texto.",
      cognitivo: "Interpretación cognitiva simulada.",
      fisico: "Descripción física simulada.",
      ocupacional: "Aspectos ocupacionales simulados.",
      resumen: "Resumen general del análisis simulado.",
      mensaje: `Análisis generado para el texto: "${texto}"`,
    };

    const fechaActual = new Date();

    const docRef = await db.collection("analisisUsuarios").add({
      usuarioId,
      texto,
      resultado,
      fecha: fechaActual,
    });

    res.status(200).json({
      mensaje: "Texto analizado y guardado correctamente",
      resultado,
      consultaId: docRef.id,
      fecha: fechaActual.toISOString(),
    });
  } catch (error) {
    console.error("Error en analizarUsuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
