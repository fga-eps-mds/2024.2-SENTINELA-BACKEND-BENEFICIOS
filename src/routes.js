const express = require("express");
const routes = express.Router();
const benefitsFormController = require("./Controllers/benefitsFormController");
const { checkPermissions } = require("./Middlewares/accessControlMiddleware");

routes.post(
    "/benefits/create",
    checkPermissions("beneficios_criar"),
    benefitsFormController.createBenefitsForm
);
routes.get(
    "/benefits",
    checkPermissions("beneficios_visualizar"),
    benefitsFormController.getBenefitsForm
);
routes.get(
    "/benefits/:id",
    checkPermissions("beneficios_visualizar"),
    benefitsFormController.getBenefitsFormById
);
routes.delete(
    "/benefits/delete/:id",
    checkPermissions("beneficios_deletar"),
    benefitsFormController.deleteBenefitsFormById
);
routes.patch(
    "/benefits/update/:id",
    checkPermissions("beneficios_editar"),
    benefitsFormController.updateBenefitsFormById
);
module.exports = routes;
