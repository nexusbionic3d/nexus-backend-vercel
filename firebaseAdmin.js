import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('Falta la variable FIREBASE_SERVICE_ACCOUNT en el archivo .env');
}

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccount = JSON.parse(serviceAccountRaw);

// Corrige los saltos de línea escapados en private_key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
export { db };
