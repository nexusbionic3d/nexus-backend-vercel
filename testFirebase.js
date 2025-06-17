import admin from './firebaseAdmin.js';

async function testFirebase() {
  try {
    const db = admin.firestore();
    const docRef = db.collection('testCollection').doc('testDoc');
    await docRef.set({ message: 'Conexión correcta a Firestore' });
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      console.log('Documento guardado y leído con éxito:', docSnap.data());
    } else {
      console.log('No se encontró el documento');
    }
  } catch (error) {
    console.error('Error al conectar con Firestore:', error);
  }
}

testFirebase();
