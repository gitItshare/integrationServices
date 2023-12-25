import axios from "axios";
import querystring from "querystring"
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
        //  console.log(error)
    }
}
const consulta =async (data,token) => {
  try {
    const url = "https://api-hml.safra.com.br/suporte-negocio/gerenciamentos-documentos-arquivos/servicos-documentos/workflow/v1/empresas/representantes/filter"
    let templateField = data.Params.TemplateFieldData
    let avalistas = 	templateField.Avalistas.Tabela_Avalistas_Container.Tabela_Avalistas
    let emitenteData = templateField.Emitente

    let emitente = 	
    {
        "tipoPessoa": "1",
        "cpfCnpjCliente": "36614473867",
        "codigoAgencia": "00000",
        "numeroConta": "0000000",
        "valorContrato": "100.43",
        "tipoRepresentante": "R",
        "codigoObjeto": "CCB",
        "codigoAto": "AS",
        "dataPoder": "05/12/2023",
        "tipoPessoaCondicaoEspecial": "0",
        "cnpjClienteCondicaoEspecial": "00000000000000",
        "codigoAgenciaCondicaoEspecial": "00000",
        "numeroContaCondicaoEspecial": "0000000"
    }	
    let avalistasList = avalistas.map(avalista => {
      return {
        tipoPessoa: "PJ",    
        cpfCnpjCliente:avalista.Emitente_CNPJ,
        codigoAgencia:avalista["Emitente_Agencia"],
        valorContrato:templateField["Valor"],
        codigoObjeto:templateField.CodForm,
        dataPoder:templateField["Emissao_e_outros_dados_dessa_cedula"]["Data_da_emissao"],
        numeroConta:"0",
        tipoPessoaCondicaoEspecial:"0",
        cnpjClienteCondicaoEspecial:"0",
        codigoAgenciaCondicaoEspecial:"0",
        numeroContaCondicaoEspecial:"0",
        tipoRepresentante:"C",
        codigoAto:"Validar com Carol"
      }
    })

    let body = {empresas:[
      emitente
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
    console.log(error)
  }
}

export default {auth, consulta}