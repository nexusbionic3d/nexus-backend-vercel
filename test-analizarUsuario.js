const axios = require('axios');

const ejecutarTest = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/analizarUsuario', {
      texto: "Últimamente me siento sin energía y me cuesta concentrarme. No he dormido bien por el trabajo y me duele el cuello.",
      usuarioId: "usuario123"
    });

    console.log("✅ Respuesta exitosa del backend:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error al hacer la solicitud:");

    if (error.response) {
      console.error("Código:", error.response.status);
      console.error("Detalles:", error.response.data);
    } else if (error.request) {
      console.error("No hubo respuesta del servidor. Verifica que esté corriendo.");
    } else {
      console.error("Error desconocido:", error.message);
    }
  }
};

ejecutarTest();
