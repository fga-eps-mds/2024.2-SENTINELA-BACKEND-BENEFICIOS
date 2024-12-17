const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const BenefitsModel = require("../Models/benefitsFormSchema");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mockedBenefit = {
    nome: "Health Benefits",
    razaoSocial: "Empresa Saúde S/A",
    statusConvenio: "Ativo",
    considerarIr: "Sim",
    descontoAut: "Não",
};

const app = express();
let mongoServer;

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

        const res = await request(app).post("/benefits/create").send(invalid);

        expect(res.status).toBe(400);
    });

    it("should get benefit by id", async () => {
        const { body: createdBenefit } = await request(app)
            .post("/benefits/create")
            .send({
                ...mockedBenefit,
                nome: "Get By ID Mock",
            });

        const res = await request(app).get(`/benefits/${createdBenefit._id}`);

        expect(res.body).toMatchObject(createdBenefit);
        expect(res.status).toBe(200);
    });

    it("should not get benefit without id", async () => {
        const res = await request(app).get(`/benefits/A1`);

        expect(res.status).toBe(400);
    });

    it("should get benefits", async () => {
        const benefitsModelCount = await BenefitsModel.countDocuments({});
        const res = await request(app).get("/benefits");

        expect(res.body.length).toBe(benefitsModelCount);
        expect(res.status).toBe(200);
    });

    it("should delete benefit", async () => {
        const { body: createdBenefit } = await request(app)
            .post("/benefits/create")
            .send({
                ...mockedBenefit,
                nome: "Delete By ID Mock",
            });

        const res = await request(app).delete(
            `/benefits/delete/${createdBenefit._id}`
        );

        expect(res.body).toMatchObject(createdBenefit);
        expect(res.status).toBe(200);
    });

    it("should not delete benefit without id", async () => {
        const res = await request(app).delete(`/benefits/delete/A1`);

        expect(res.status).toBe(400);
    });

    it("should update benefit", async () => {
        const { body: createdBenefit } = await request(app)
            .post("/benefits/create")
            .send({
                ...mockedBenefit,
                nome: "Update By ID Mock",
            });

        const res = await request(app).patch(
            `/benefits/update/${createdBenefit._id}`
        );

        expect(res.status).toBe(200);
    });

    it("should fail to update benefit", async () => {
        const res = await request(app).patch(`/benefits/update/A1`);

        expect(res.status).toBe(400);
    });
    it("should fail to update benefit with invalid id", async () => {
        const res = await request(app).patch(`/benefits/update/A1`);
        expect(res.status).toBe(400);
    });

    it("should fail to update benefit if not found", async () => {
        const res = await request(app).patch(
            `/benefits/update/60f5f4c0f0f0f0f0f0f0f0f0`
        );
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe("Not Found");
    });
    it("should return validation error when invalid data is provided", async () => {
        const invalidData = {
            nome: "",
            statusConvenio: "Ativo",
        };

        const res = await request(app)
            .post("/benefits/create")
            .send(invalidData);

        expect(res.status).toBe(400);
        expect(res.body.erro).toBeDefined();
    });
});
