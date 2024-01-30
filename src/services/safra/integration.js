import axios from "axios";
import querystring from "querystring"
import { cpf } from 'cpf-cnpj-validator'; 
import dayjs from 'dayjs'
const auth = async () => {
    try {
        const url = "https://sts-api-hml.safra.com.br/api/oauth/token"
        const client = await axios.create({
          headers: {
            'Content-Type': "application/x-www-form-urlencoded",
          }
        });
        let data = querystring.stringify({
          client_id: process.env.clientIDSafra,
          client_secret: process.env.secretSafra,
          grant_type: "client_credentials"
        })
        
        console.log(data)
        let resp = await client.post(url, data)
        console.log(resp)
        return resp.data.access_token
    } catch (error) {
          console.log(error)
    }
}
const consulta =async (data,token) => {
  try {
    const url = "https://api-hml.safra.com.br/suporte-negocio/gerenciamentos-documentos-arquivos/servicos-documentos/workflow/v1/representantes/consultar"
    let templateField = data.Params.TemplateFieldData
    let avalistas = 	templateField.Avalistas.Tabela_Avalistas_Container.Tabela_Avalistas
    let emitenteData = templateField.Emitente
    let terceirosData = templateField.Terceiro_Garantidor.Tabela_Terceiro_Garantidor_Container.Tabela_Terceiro_Garantidor
    let dataPoder = dayjs(new Date(templateField["Emissao_e_outros_dados_dessa_cedula"]["Data_da_emissao"])).format("YYYY-MM-DD")
    
    let emitente = 	{
      "DocumentoCliente": emitenteData.Emitente_CNPJ,
      "Agencia": "",
      "Conta": "",
      // "valorContrato": templateField.Valor,
      "valorContrato": 100.43,
      "tipoRepresentante": "REPRESENTANTE",
      "codigoObjeto": cpf.isValid(emitenteData.Emitente_CNPJ)? "CCB" : "CCB",
      "codigoAto": "ASSINA",
      "dataPoder": dataPoder
    }	

    let terceirosList = terceirosData.map(avalista => {
      return {
        "DocumentoCliente": avalista.CPF_CNPJ,
        "Agencia": "",
        "Conta": "",
        "valorContrato": templateField.Valor,
        "tipoRepresentante": "REPRESENTANTE",
        "codigoObjeto": cpf.isValid(avalista.CPF_CNPJ)? "CCB" : "GAP P/TERC",
        "codigoAto": "ASSINA",
        "dataPoder": dataPoder,
      }
    })

    let avalistasList = avalistas.map(avalista => {
      return {
        "DocumentoCliente": avalista.Avalistas_CPF_CNPJ,
        "Agencia": "",
        "Conta": "",
        "valorContrato": templateField.Valor,
        "tipoRepresentante": "REPRESENTANTE",
        "codigoObjeto": cpf.isValid(avalista.Avalistas_CPF_CNPJ)? "CCB" : "GAP P/TERC",
        "codigoAto": "ASSINA",
        "dataPoder": dataPoder,
      }
    })

    let body = {empresas:[
        emitente
      //   terceiro,
      //  ...avalistasList
      ]}
    const clientSafra = axios.create({
      headers: {
        'Content-Type': "application/json",
        'Safra-Aplicacao': 'ITS',
        'Authorization': `Bearer ${token}`
      }
    });
    let resp = await clientSafra.post(url, body)
    // console.log(resp)
    return resp.data
  } catch (error) {
    console.log(error.message)
  }
}

export default {auth, consulta}