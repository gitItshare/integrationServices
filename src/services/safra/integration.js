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
    const url = "https://api-hml.safra.com.br/suporte-negocio/gerenciamentos-documentos-arquivos/servicos-documentos/workflow/v1/representantes/consultar"
    // let templateField = data.Params.TemplateFieldData
    // let avalistas = 	templateField.Avalistas.Tabela_Avalistas_Container.Tabela_Avalistas
    // let emitenteData = templateField.Emitente
    // let terceirosData = templateField.Terceiro_Garantidor.Tabela_Terceiro_Garantidor_Container.Tabela_Terceiro_Garantidor

    let emitente = 	{
      "DocumentoCliente": "02974733000152",
      "Agencia": "",
      "Conta": "",
      "valorContrato": 100.43,
      "tipoRepresentante": "REPRESENTANTE",
      "codigoObjeto": "CCB",
      "codigoAto": "ASSINA",
      "dataPoder": "2019-12-13"
    }	
    // let terceiro = {
    //   tipoPessoa: "1",    
    //   cpfCnpjCliente:terceirosData.CPF_CNPJ,
    //   codigoAgencia:"0",
    //   valorContrato:"100.43",
    //   codigoObjeto:"GARP P/ TERC",
    //   dataPoder:templateField["Emissao_e_outros_dados_dessa_cedula"]["Data_da_emissao"],
    //   numeroConta:"0",
    //   tipoPessoaCondicaoEspecial:"0",
    //   cnpjClienteCondicaoEspecial:"0",
    //   codigoAgenciaCondicaoEspecial:"0",
    //   numeroContaCondicaoEspecial:"0",
    //   tipoRepresentante:"R",
    //   codigoAto:"AS"
    // }
    // let cliente = {
    //   tipoPessoa: "1",    
    //   cpfCnpjCliente:emitenteData.Emitente_CNPJ,
    //   codigoAgencia:"0",
    //   valorContrato:"100.43",
    //   codigoObjeto:"CCB",
    //   dataPoder:templateField["Emissao_e_outros_dados_dessa_cedula"]["Data_da_emissao"],
    //   numeroConta:"0",
    //   tipoPessoaCondicaoEspecial:"0",
    //   cnpjClienteCondicaoEspecial:"0",
    //   codigoAgenciaCondicaoEspecial:"0",
    //   numeroContaCondicaoEspecial:"0",
    //   tipoRepresentante:"R",
    //   codigoAto:"AS"
    // }
    // let avalistasList = avalistas.map(avalista => {
    //   return {
    //     tipoPessoa: "1",    
    //     cpfCnpjCliente:avalista.Avalistas_CPF_CNPJ,
    //     codigoAgencia:"0",
    //     valorContrato:"100.43",
    //     codigoObjeto:"GARP P/ TERC",
    //     dataPoder:templateField["Emissao_e_outros_dados_dessa_cedula"]["Data_da_emissao"],
    //     numeroConta:"0",
    //     tipoPessoaCondicaoEspecial:"0",
    //     cnpjClienteCondicaoEspecial:"0",
    //     codigoAgenciaCondicaoEspecial:"0",
    //     numeroContaCondicaoEspecial:"0",
    //     tipoRepresentante:"R",
    //     codigoAto:"AS"
    //   }
    // })

    let body = {empresas:[
      // cliente,
      // terceiro,
      // ...avalistasList
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