import { FirebaseAdmin } from '../firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten solicitudes POST' });
  }

  try {
    const { email, payment_id } = req.body; // Datos esperados del webhook

    if (!email || !payment_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (email, payment_id)' });
    }

    // 1. Crear usuario en Firebase Auth
    const password = Math.random().toString(36).slice(-8); // Contraseña aleatoria
    const userRecord = await FirebaseAdmin.auth().createUser({
      email: email,
      password: password,
    });

    // 2. Guardar datos en Firestore
    await FirebaseAdmin.firestore().collection('usuarios').doc(userRecord.uid).set({
      email: email,
      payment_id: payment_id,
      created_at: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ 
      success: true, 
      userId: userRecord.uid,
      email: email
    });

  } catch (error) {
    console.error('Error en el webhook:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message 
    });
  }
}
