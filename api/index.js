const express = require('express');
const router = express.Router();
const analizarUsuario = require('./analizarUsuario');

router.post('/analizarUsuario', analizarUsuario);

module.exports = router;
