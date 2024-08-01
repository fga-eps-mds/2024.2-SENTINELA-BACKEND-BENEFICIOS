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
})

const benefitsCreate = mongoose.model('Benefits', benefitsCreateSchema);
module.exports = benefitsCreate;