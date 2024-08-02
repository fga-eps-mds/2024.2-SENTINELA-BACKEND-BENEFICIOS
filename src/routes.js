const express = require("express");
const routes = express.Router();
//const NewController = require("../Controllers/benefitsFormController");
const NewController = require("./Controllers/benefitsFormController");

// Private
// routes.get('/benefits', tokenValidation, ???.getUsers);
// routes.get('/benefits/:id', tokenValidation,  ???.getUserById);

// Public
routes.post("/benefits/create", NewController.createBenefitsForm);
routes.get("/benefits", NewController.getBenefitsForm);

module.exports = routes;
