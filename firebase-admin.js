import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Carga las credenciales desde variables de entorno (Vercel)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Evita inicializar múltiples veces
if (!initializeApp().apps.length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

export const FirebaseAdmin = {
  auth: getAuth,
  firestore: getFirestore
};
