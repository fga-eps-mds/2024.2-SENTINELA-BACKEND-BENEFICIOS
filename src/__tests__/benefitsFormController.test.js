const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const BenefitsModel = require("../Models/benefitsFormSchema");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const mockedBenefit = {
    nome: "Health Benefits",
    razaoSocial: "Empresa Saúde S/A",
    statusConvenio: "Ativo",
    considerarIr: "Sim",
    descontoAut: "Não",
};

const app = express();
let mongoServer;

mockedToken = () => {
    let jwtTemp = {
        id: "6783471ed9b501ccc074f977",
        _id: "6783471ed9b501ccc074f96a",
        name: "administrador",
        permissions: [
            "perfis_editar",
            "perfis_deletar",
            "perfis_visualizar",
            "orgaos_criar",
            "orgaos_editar",
            "orgaos_deletar",
            "orgaos_visualizar",
            "fornecedores_criar",
            "fornecedores_editar",
            "fornecedores_deletar",
            "fornecedores_visualizar",
            "contas_bancarias_criar",
            "contas_bancarias_editar",
            "contas_bancarias_deletar",
            "contas_bancarias_visualizar",
            "movimentacao_financeira_criar",
            "movimentacao_financeira_editar",
            "movimentacao_financeira_deletar",
            "movimentacao_financeira_visualizar",
            "permissoes_criar",
            "permissoes_editar",
            "permissoes_deletar",
            "permissoes_visualizar",
            "beneficios_criar",
            "beneficios_visualizar",
            "beneficios_editar",
            "beneficios_deletar",
            "usuarios_visualizar",
            "usuarios_editar",
            "usuarios_deletar",
            "usuarios_criar",
            "create",
            "read",
            "update",
            "delete",
            "usuarios_visualizar_historico\t",
            "associados_criar",
            "associados_deletar",
            "associados_editar",
            "associados_visualizar",
            "perfis_criar",
            "filiados_cadastrar",
            "usuarios_visualizar_historico",
            "sindicalizado_visualizar_status",
            "filiado_visualizar_carteirinha",
        ],
        user: {
            situation: "",
            description: "",
            _id: "6783471ed9b501ccc074f977",
            name: "Admin",
            email: "admin@admin.com",
            phone: "1234567890",
            role: "6783471ed9b501ccc074f96a",
            status: true,
            isProtected: true,
            createdAt: "2025-01-12T04:37:50.966Z",
            updatedAt: "2025-01-12T04:37:50.966Z",
            __v: 0,
        },
    };
    const token = jwt.sign(jwtTemp, "S3T1N3L3L4", {
        expiresIn: "30d",
    });
    return token.trim();
};

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Aplicar o middleware antes das rotas
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", routes);

describe("BenefitsForm Controller Tests", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await BenefitsModel.deleteMany({});
    });

    it("should create a new benefit", async () => {
        const res = await request(app)
            .post("/benefits/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send(mockedBenefit);

        expect(res.status).toBe(201);
    });

    it("should not create an invalid benefit", async () => {
        const invalid = {
            nome: "",
            razaoSocial: "",
            statusConvenio: "",
            considerarIr: "",
            descontoAut: "",
        };

        const res = await request(app)
            .post("/benefits/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send(invalid);

        expect(res.status).toBe(400);
    });

    it("should get benefit by id", async () => {
        const { body: createdBenefit } = await request(app)
            .post("/benefits/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                ...mockedBenefit,
                nome: "Get By ID Mock",
            });

        const res = await request(app)
            .get(`/benefits/${createdBenefit._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdBenefit);
        expect(res.status).toBe(200);
    });

    it("should not get benefit without id", async () => {
        const res = await request(app)
            .get(`/benefits/A1`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(400);
    });

    it("should get benefits", async () => {
        const benefitsModelCount = await BenefitsModel.countDocuments({});
        const res = await request(app)
            .get("/benefits")
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body.length).toBe(benefitsModelCount);
        expect(res.status).toBe(200);
    });

    it("should delete benefit", async () => {
        const { body: createdBenefit } = await request(app)
            .post("/benefits/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                ...mockedBenefit,
                nome: "Delete By ID Mock",
            });

        const res = await request(app)
            .delete(`/benefits/delete/${createdBenefit._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);
        expect(res.body).toMatchObject(createdBenefit);
        expect(res.status).toBe(200);
    });

    it("should not delete benefit without id", async () => {
        const res = await request(app)
            .delete(`/benefits/delete/A1`)
            .set("Authorization", `Bearer ${mockedToken()}`);
        expect(res.status).toBe(400);
    });

    it("should update benefit", async () => {
        const { body: createdBenefit } = await request(app)
            .post("/benefits/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                ...mockedBenefit,
                nome: "Update By ID Mock",
            });

        const res = await request(app)
            .patch(`/benefits/update/${createdBenefit._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);
        expect(res.status).toBe(200);
    });

    it("should fail to update benefit", async () => {
        const res = await request(app)
            .patch(`/benefits/update/A1`)
            .set("Authorization", `Bearer ${mockedToken()}`);
        expect(res.status).toBe(400);
    });
});
