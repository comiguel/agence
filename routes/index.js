const express = require('express');
const consultorController = require('../controllers/consultor');

const api = express.Router();

api.get('/consultor', consultorController.getConsultors);
api.post('/relatorio', consultorController.getRelatorio);

module.exports = api;