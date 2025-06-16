require('dotenv').config();
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const fetch = require('node-fetch');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = getFirestore();

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const construirPrompt = (texto, usuarioId) => `
Eres un asistente experto en salud integral. Analiza el siguiente texto escrito por un usuario desde cuatro dimensiones: emocional, cognitiva, física y ocupacional.

Texto del usuario:
"""${texto}"""

Instrucciones:
1. Devuelve un análisis breve por cada dimensión mencionada.
2. Genera un resumen profesional de máximo 3 líneas.
3. Crea un mensaje empático y directo al usuario con lenguaje positivo.

Formato de respuesta (en JSON):

{
  "emocional": "...",
  "cognitivo": "...",
  "fisico": "...",
  "ocupacional": "...",
  "resumen": "...",
  "mensaje": "..."
}

Este análisis es parte del perfil inteligente de usuario (ID: ${usuarioId}).
`;

const analizarConHuggingFace = async (texto, usuarioId) => {
  const prompt = construirPrompt(texto, usuarioId);
  console.log("📤 Prompt enviado a Hugging Face:\n", prompt);

  const respuesta = await fetch(HUGGINGFACE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  const contenido = await respuesta.text();
  console.log("📥 Respuesta cruda de Hugging Face:\n", contenido);

  if (!respuesta.ok) {
    throw new Error(`Error de HuggingFace: ${contenido}`);
  }

  const datos = JSON.parse(contenido);
  const textoRespuesta = datos[0]?.generated_text || datos.generated_text;

  const jsonStart = textoRespuesta.indexOf('{');
  const jsonEnd = textoRespuesta.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No se encontró JSON válido en la respuesta del modelo");
  }
  const jsonString = textoRespuesta.substring(jsonStart, jsonEnd + 1);

  return JSON.parse(jsonString);
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { texto, usuarioId } = req.body;

  if (!texto || !usuarioId) {
    return res.status(400).json({ error: "Faltan campos requeridos: texto o usuarioId" });
  }

  try {
    const resultado = await analizarConHuggingFace(texto, usuarioId);

    // Guardar resultado en Firestore si deseas:
    // await db.collection('analisis').add({ usuarioId, texto, resultado, fecha: new Date() });

    return res.json({
      mensaje: "Texto analizado correctamente",
      resultado,
      fecha: new Date().toLocaleString(),
    });
  } catch (error) {
    console.error("Error en analizarUsuario:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};
