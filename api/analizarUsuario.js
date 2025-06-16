// api/analizarUsuario.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

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

const app = express();

app.use(cors({
  origin: 'https://nexus-bionic-frontend.vercel.app', // Ajusta a tu frontend
  methods: ['POST'],
}));

app.use(express.json());

app.post('/api/analizarUsuario', async (req, res) => {
  const { texto, usuarioId } = req.body;

  if (!texto || !usuarioId) {
    return res.status(400).json({ error: "Faltan campos requeridos: texto o usuarioId" });
  }

  try {
    const resultado = await analizarConHuggingFace(texto, usuarioId);

    // Opcional: guarda resultado en Firestore
    // await db.collection('analisis').add({ usuarioId, texto, resultado, fecha: new Date() });

    return res.json({
      mensaje: "Texto analizado correctamente",
      resultado,
      fecha: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en analizarUsuario:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
});

export default app;
