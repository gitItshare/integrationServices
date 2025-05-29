
import axios from 'axios';
import Docusign from '../Docusign/index.js';
class Druid {
    constructor() {
    }
    gerarXml(response) {

        const dados = response.data;
        console.log(dados)
        const doc = dados.documents;
        const endereco = dados.address;
        const email = dados.email || dados.alternative_email ;
        const valorExtenso = dados.custom_fields.find((item) => item.name == "Valor por extenso") || {value: "teste"};
        const razaoSocialContratante = dados.custom_fields.find((item) => item.name == "razao_social") || {value: "teste"};
        const cnpjContratante = dados.custom_fields.find((item) => item.name == "cnpj") || {value: "teste"};
        const razaoSocialContratada = dados.custom_fields.find((item) => item.name == "Informações pessoais - Razão Social") || {value: "teste"};
        const cnpjContratada = dados.custom_fields.find((item) => item.name == "Informações pessoais - CNPJ") || {value: "00.000.000/0001-00"};
        const naturezaJuridica = dados.custom_fields.find((item) => item.name == "Informações pessoais - Natureza Jurídica") || {value: "teste"};
        const nomeCompleto = dados.custom_fields.find((item) => item.name == "nome_completo") || {value: "Nome Completo do Contratado"};
        const sedeEmpresa = dados.custom_fields.find((item) => item.name == "Informações pessoais - Sede de Empresa") || {value: "Sede da Empresa"};
        const cpf = dados.custom_fields.find((item) => item.name == "cpf")  || {value: "000.000.000-00"};
        const rg = dados.custom_fields.find((item) => item.name == "rg") || {value: "00.000.000-0"};
        const area = dados.custom_fields.find((item) => item.name == "departamento") || {value: "Área de Atuação"};
        const salario = dados.custom_fields.find((item) => item.name == "salario") || {value: "0.00"};
        const salarioExtenso = dados.custom_fields.find((item) => item.name == "salario_por_extenso") || {value: "Salário por Extenso"};
        const inicioVigencia = dados.custom_fields.find((item) => item.name == "data_contratacao") || {value: "teste"};
        const fimVigencia = dados.custom_fields.find((item) => item.name == "Informações de trabalho - Encerramento do contrato") || {value: "teste"};
        const xml = `
      <TemplateFieldData>
      <integracao>true</integracao>
        <Dados_Contratante>
          <CNPJ_Contratante>${this.formatarCPF(cnpjContratante?.value || "000.000.000-00")}</CNPJ_Contratante>
          <Razao_Social_Contratante>${razaoSocialContratante?.value || "Razão Social do Contratante"}</Razao_Social_Contratante>
        </Dados_Contratante>
        <Dados_Contratada>
          <Pessoa_Fisica>${nomeCompleto.value}</Pessoa_Fisica>
          <Email_Contraparte>${email}</Email_Contraparte>
          <Endereco_Contratada>${endereco.address}, ${endereco.number}, ${endereco.complement}, ${endereco.district}, ${endereco.city} - ${endereco.state}, ${endereco.zip_code}</Endereco_Contratada>
          <Data_fim_vigencia>${fimVigencia?.value}</Data_fim_vigencia>
          <Natureza_Juridica>${naturezaJuridica?.value}</Natureza_Juridica>
          <Razao_Social_Contratada>${razaoSocialContratada?.value}</Razao_Social_Contratada>
          <Sede_Empresa>${sedeEmpresa?.value}</Sede_Empresa>
          <Valor>${salario?.value}</Valor>
          <Salario_Extenso>${salarioExtenso?.value}</Salario_Extenso>
          <Data_inicio_vigencia>${inicioVigencia?.value}</Data_inicio_vigencia>
          <CNPJ_Contratada>${this.formatarCPF(cnpjContratada?.value || "00.000.000/0001-00")}</CNPJ_Contratada>
          <Email_Contratada>${email}</Email_Contratada>
          <CPF_Contratada>${this.formatarCPF(cpf?.value || "000.000.000-00")}</CPF_Contratada>
          <RG_Contratada>${rg?.value || "00.000.000-0"}</RG_Contratada>
          </Dados_Contratada>
        <Objeto>
          <Area_Prestado_Servico>${area?.value}</Area_Prestado_Servico>
        </Objeto>
      </TemplateFieldData>`
      
        return xml.trim();;
      }
      
    formatarCPF(cpf) {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
      }
      
    async getEmployees(id) {
        try {
            const resp = await axios.get(`https://public-api.convenia.com.br/api/v3/employees/${id}`, {
                headers: {
                    "Token": "a0f2166d-9515-40cc-88ac-059e3b5a706d",
                    "Content-Type": "application/json"
                }
            });
            return resp.data;
        } catch (error) {
            return error.response.data;
        }

    }

    async startWorkFlow(params) {
      try {
        const credentials = {
          userID: "7ee9dacf-8321-4e59-a00a-8f0d952b1a88",
          integrationKey: process.env.druidIntegrationKey,
          privateKey: process.env.druidKey,
          dsOauthServer: "account-d.docusign.com",         
          accountID: process.env.druidAccountID,
        }
        const scope = "signature impersonation spring_read spring_write"
        const docusign = new Docusign(credentials, scope);
        await docusign.jwt();
        await docusign.authenticate();
        await docusign.startWorkflow("DRUID", params);
      } catch (error) {
        console.log("Error ao iniciar o workflow", error)
        return error.response.data;
      }

    }

}
export default Druid