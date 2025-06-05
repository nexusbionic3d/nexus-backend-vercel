const axios = require('axios');

async function probarAnalisis() {
  try {
    const response = await axios.post('http://localhost:3000/api/analizarUsuario', {
      texto: 'Este es un texto de prueba para Nexus Bionic.'
    });

    console.log('Respuesta del servidor:');
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error en respuesta del servidor:', error.response.data);
    } else {
      console.error('Error al conectar con el servidor:', error.message);
    }
  }
}

probarAnalisis();
