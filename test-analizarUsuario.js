import fetch from 'node-fetch';

const url = 'http://localhost:3000/api/analizarUsuario';

const data = {
  texto: 'Tengo molestias en el hombro derecho',
  usuarioId: 'usuario123',
};

async function testAnalizarUsuario() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      console.error(errorData);
      return;
    }

    const json = await response.json();
    console.log('Respuesta del servidor:', json);
  } catch (error) {
    console.error('Error al hacer la petición:', error);
  }
}

testAnalizarUsuario();
