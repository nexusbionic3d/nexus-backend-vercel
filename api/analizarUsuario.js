// api/analizarUsuario.js
import { db } from '../firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { texto, usuarioId } = req.body;

    if (!texto || !usuarioId) {
      return res.status(400).json({ error: 'Faltan campos requeridos: texto o usuarioId' });
    }

    const resultado = {
      emocional: 'Estado emocional simulado basado en el texto.',
      cognitivo: 'Interpretación cognitiva simulada.',
      fisico: 'Descripción física simulada.',
      ocupacional: 'Aspectos ocupacionales simulados.',
      resumen: 'Resumen general del análisis simulado.',
      mensaje: `Análisis generado para el texto: "${texto}"`,
    };

    const fechaActual = new Date();

    await db.collection('analisisUsuarios').add({
      usuarioId,
      texto,
      resultado,
      fecha: fechaActual,
    });

    res.json({
      mensaje: 'Texto analizado y guardado correctamente',
      resultado,
      fecha: fechaActual.toISOString(),
    });

  } catch (error) {
    console.error('Error en analizarUsuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
