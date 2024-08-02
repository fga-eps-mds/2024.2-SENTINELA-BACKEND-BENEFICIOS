const mongoose = require("mongoose");

const benefitsFormSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    razaoSocial: {
        type: String,
        required: true,
        enum: ["Jurídica", "Física"],
    },
    descricao: {
        type: String,
        required: true,
        unique: true,
    },
    tipoPessoa: {
        type: String,
        required: true,
        enum: ["Jurídica", "Física"],
    },
    cpfCnpj: {
        type: String,
        required: true,
        unique: true,
        //immutable: true
    }, //verificar
    ans: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
        enum: ["Alimentação", "Artes", "Escolas", "Academias", "Outros"],
    },
    statusConvenio: {
        type: String,
        required: true,
        enum: ["Ativo", "Inativo"],
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
    considerarIr: {
        type: String,
        required: true,
        enum: ["Sim", "Não"],
    },
    descontoAut: {
        type: String,
        required: true,
        enum: ["Sim", "Não"],
    },

    //logotipo

    site: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    telefCelular: {
        type: String,
        required: true,
    },
    dataAssinatura: {
        type: Date,
        default: Date.now,
    },
    dataInicio: {
        type: Date,
        default: Date.now,
    },
    sitContrato: {
        type: String,
        required: true,
        enum: ["Concluído", "Pendência", "Cancelado"],
    },
    dataFinal: {
        type: Date,
        default: Date.now,
    },
    //contratosit
});

const benefitsForm = mongoose.model("Benefits", benefitsFormSchema);
module.exports = benefitsForm;
