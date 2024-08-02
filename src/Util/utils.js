const validator = (dados) => {
    console.log("Validator");

    if (typeof dados.nome !== "string" || dados.nome === "") {
        return "Nome inválido";
    }

    if (typeof dados.razaoSocial !== "string" || dados.razaoSocial === "") {
        return "Nome inválido";
    }

    if (dados.tipoPessoa !== null) {
        const tipoPessoaValidas = ["Jurídica", "Física"];
        if (!tipoPessoaValidas.includes(dados.tipoPessoa)) {
            return "Tipo de pessoa inválida";
        }
    }

    if (dados.cpfCnpj !== null) {
        const cpfValido = /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/;
        const cnpjValido = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
        if (
            (!cpfValido.test(dados.cpfCnpj) && dados.tipoPessoa === "Física") ||
            (!cnpjValido.test(dados.cpfCnpj) && dados.tipoPessoa === "Jurídica")
        ) {
            return "CPF ou CNPJ inválido";
        }
    }

    //so testando aqui

    return null;
};

module.exports = {
    validator,
};
