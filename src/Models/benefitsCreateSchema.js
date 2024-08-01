const mongoose = require('mongoose');

const benefitsCreateSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,
        unique: true
    },
    razaoSocial: {
        type: String,
        required: true,
        enum: ['Jurídica', 'Física']
    },
    descricao: {
        type: String,
        required: true,
        unique: true
    },  
    tipoPessoa: {
        type: String,
        required: true,
        enum: ['Jurídica', 'Física']
    },
    cpfCnpj: {
        type: Number,
        required: true,
        unique: true
        //immutable: true
    }, //verificar
    ans: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Alimentação','Artes','Escolas','Academias','Outros']
    },
    statusConvenio: {
        type: String,
        required: true,
        enum: ['Ativo', 'Inativo']
    },


    //dataCadastro
    
    considerarIr: { 
        type: String,
        required: true,
        enum: ['Sim', 'Não']
    },
    descontoAut: { 
        type: String,
        required: true,
        enum: ['Sim', 'Não']
    },

    //logotipo

    site: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefCelular: {
        type: String,
        required: true
    },

    //dataassinatura

    //data inicio

    sitContrato: {
        type: String,
        required: true,
        enum: ['Concluído', 'Pendência', 'Cancelado']
    },

    //datafinal
    //contratosit




})

const benefitsCreate = mongoose.model('Benefits', benefitsCreateSchema);
module.exports = benefitsCreate;