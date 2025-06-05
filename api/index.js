const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Inicialización de Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

// Manejador compatible con Vercel
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).send('API de Nexus Bionic funcionando');
  }

  if (req.method === 'POST' && req.url === '/api/analizarUsuario') {
    console.log('POST /api/analizarUsuario recibida');
    console.log('Cuerpo recibido:', req.body);

    let body = req.body;

    // Vercel podría no parsear el JSON automáticamente en algunos casos
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({ error: 'Cuerpo de solicitud inválido' });
      }
    }

    const { texto, usuarioId } = body;

    if (!texto || texto.trim().length < 5) {
      return res.status(400).json({ error: 'El texto debe tener al menos 5 caracteres.' });
    }

    if (!usuarioId || usuarioId.trim() === '') {
      return res.status(400).json({ error: 'usuarioId requerido' });
    }

    const fechaISO = new Date().toISOString();
    const textoLower = texto.toLowerCase();

    // Diccionario semántico básico
    const patrones = [
      {
        palabrasClave: ['agotado', 'cansado', 'fatiga', 'sin energía'],
        causas: [
          'estrés crónico',
          'trastornos del sueño',
          'déficit nutricional',
          'problemas hormonales (como tiroides baja)'
        ]
      },
      {
        palabrasClave: ['dolor de cabeza', 'migraña'],
        causas: [
          'tensión muscular',
          'deshidratación',
          'falta de sueño',
          'problemas visuales'
        ]
      },
      {
        palabrasClave: ['ansioso', 'nervioso', 'preocupado', 'estrés'],
        causas: [
          'ansiedad generalizada',
          'exceso de trabajo',
          'poca desconexión digital',
          'falta de técnicas de relajación'
        ]
      },
      {
        palabrasClave: ['triste', 'deprimido', 'sin ganas', 'desanimado'],
        causas: [
          'posible depresión leve',
          'aislamiento social',
          'falta de propósito o rutina saludable',
          'deficiencia de vitamina D'
        ]
      }
    ];

    let posiblesCausas = [];

    for (const patron of patrones) {
      if (patron.palabrasClave.some(palabra => textoLower.includes(palabra))) {
        posiblesCausas = posiblesCausas.concat(patron.causas);
      }
    }

    const resumen =
      posiblesCausas.length > 0
        ? `El texto sugiere posibles factores como: ${[...new Set(posiblesCausas)].join(', ')}.`
        : `No se detectaron patrones específicos. Se recomienda evaluación profesional para mayor precisión.`;

    const resultado = {
      mensaje: 'Texto analizado correctamente',
      resumen,
      fecha: fechaISO,
    };

    try {
      const docRef = await db.collection('consultasUsuario').add({
        usuarioId,
        textoOriginal: texto,
        resumen,
        fecha: fechaISO,
        tipo: 'consulta inicial',
      });

      console.log(`📝 Documento guardado en Firestore con ID: ${docRef.id}`);
    } catch (error) {
      console.error('❌ Error al guardar en Firestore:', error);
      return res.status(500).json({ error: 'Error al guardar en Firestore' });
    }

    return res.status(200).json(resultado);
  }

  // Método no permitido
  return res.status(405).json({ error: 'Método no permitido' });
};
