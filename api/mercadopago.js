import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Cargar credenciales desde una variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Inicializar Firebase solo una vez
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Función API para Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Falta el email en la solicitud' });
  }

  const password = Math.random().toString(36).slice(-8); // genera una contraseña aleatoria de 8 caracteres

  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
    });

    return res.status(200).json({
      message: 'Usuario creado con éxito',
      uid: userRecord.uid,
      email: userRecord.email,
      password,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
