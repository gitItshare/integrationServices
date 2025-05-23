
import axios from 'axios';
import Docusign from '../Docusign/index.js';
class Druid {
    constructor() {
    }
    gerarXml(response) {
        const dados = response.data;
        const doc = dados.documents;
        const endereco = dados.address;
        const salario = dados.salary;
        const email = dados.email || dados.alternative_email;
        const nomeCompleto = `${dados.name} ${dados.last_name}`;
        const dataFim = dados.custom_fields.find((item) => item.name == "Data fim"); 
        const naturezaJuridica = dados.custom_fields.find((item) => item.name == "Natureza Jurídica");
        const departamento = dados.custom_fields.find((item) => item.name == "Departamento");
        const valorExtenso = dados.custom_fields.find((item) => item.name == "Valor por extenso");
        const xml = `
      <TemplateFieldData>
      <integracao>true</integracao>
        <Dados_Contratada>
          <Pessoa_Fisica>${nomeCompleto}</Pessoa_Fisica>
          <CPF_Contratada>${this.formatarCPF(doc.cpf)}</CPF_Contratada>
          <CNPJ_Contratada>${doc.cnpj}</CNPJ_Contratada>
          <RG_Contratada>${doc.rg}</RG_Contratada>
          <Email_Contraparte>${email}</Email_Contraparte>
          <Data_inicio_vigencia>${dados.hiring_date}</Data_inicio_vigencia>
          <Valor>${salario}</Valor>
          <Endereco_Contratada>${endereco.address}, ${endereco.number}, ${endereco.complement}, ${endereco.district}, ${endereco.city} - ${endereco.state}, ${endereco.zip_code}</Endereco_Contratada>
          <Data_fim_vigencia>${dataFim?.value}</Data_fim_vigencia>
          <Natureza_Juridica>${naturezaJuridica?.value}</Natureza_Juridica>
          <Valor_Extenso>${valorExtenso?.value}</Valor_Extenso>
          </Dados_Contratada>
        <Objeto>
          <Area_Prestado_Servico>${departamento?.value}</Area_Prestado_Servico>
        </Objeto>
      </TemplateFieldData>`.trim();
      
        return xml;
      }
      
    formatarCPF(cpf) {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
      }
      
    async getEmployees(id) {
        try {
            const resp = await axios.get(`https://public-api.convenia.com.br/api/v3/employees/${id}`, {
                headers: {
                    "Token": `a0f2166d-9515-40cc-88ac-059e3b5a706d`,
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
          userID: process.env.druidUserID,
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