import admin from "../firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo se permiten solicitudes POST" });
  }

  const { email, plan } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  const password = Math.random().toString(36).slice(-8); // contraseña temporal

  try {
    const user = await admin.auth().createUser({
      email,
      password,
    });

    // Opcional: guardar info adicional en Firestore
    await admin.firestore().collection("usuarios").doc(user.uid).set({
      email,
      plan,
      creadoEn: new Date(),
    });

    return res.status(200).json({
      message: "Usuario creado exitosamente",
      email,
      password,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
