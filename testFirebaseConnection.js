import { db } from './firebaseAdmin.js';

async function test() {
  try {
    const docRef = await db.collection('testConnection').add({
      mensaje: 'Conexión exitosa',
      timestamp: new Date()
    });
    console.log("✅ Documento creado con ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error al conectar con Firebase:", error.message);
  }
}

test();
