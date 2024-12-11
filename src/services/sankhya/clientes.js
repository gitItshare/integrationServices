import axios from "axios";

const sankhyaClient = (token) => axios.create({
   headers: {
      'Authorization': "Bearer " + token
   }
});

const dicionario = {
   "Professor_PF_ou_PJ": "TIPPESSOA",
   "Nome_Externo": "NOMEPARC",
   "CPF_ou_CNPJ": "CGC_CPF",
   "Endereco__com_numero": "ENDERECO",
   "Bairro": "BAIRRO",
   "Complemento": "COMPLEMENTO",
   "Cidade": "CIDADE",
   "CEP": "CEP",
   "Pais": "PAIS",
   "Endereco_eletronico_principal": "EMAIL",
   "Nome_Completo_Pessoa_Juridica": "RAZAOSOCIAL",
   "Administrada_por": "ADM",
   "CPF_Administrador": "CPFADM",
   "Data_Contrato_unformatted": "DTCON"
}
const dicionarioInterveniente = {
   "Nome_Professor": "NOME_PARCINT",
   "CPF": "CGC_CPF_PARCINT",
   "Endereco__com__o_numero": "ENDERECO_PARCINT",
   "Bairro__IA": "BAIRRO_PARCINT",
   "Complemento__IA": "COMPLEMENTO_PARCINT",
   "Cidade__IA": "CODCID_PARCINT",
   "CEP__IA": "CEP_PARCINT",
   "Pais__IA": "CODPAIS_PARCINT",
   "Endereco_eletronico": "EMAIL_PARCINT",
   "Data_Contrato_unformatted": "DTCON"
}

const cadastro = async (data, token) => {
   try {
      let cedente
      if(data.Params.TemplateFieldData.CEDENTE)
         cedente = data.Params.TemplateFieldData.CEDENTE
      if(data.Params.TemplateFieldData.PRESTADOR)
         cedente = data.Params.TemplateFieldData.PRESTADOR
      if(data.Params.TemplateFieldData.DADOS_CONTRATADA )
         cedente = data.Params.TemplateFieldData.DADOS_CONTRATADA 

      let cpfcnpj = cedente["CPF_ou_CNPJ"].replace(/[^a-zA-Z0-9 ]/g, '')
      let parceiro = await consultar(`this.CGC_CPF = '${cpfcnpj}' AND CLIENTE = 'S'`, token)
      let parceiroAD = await consultarAD(`this.CGC_CPF = '${cpfcnpj}'`, token)
      if (!parceiro) {
         console.log("CADASTREI....")
         parceiro = await cadastrar(data, token,cedente)
      }

      let clienteAD = await cadastrarAD(data, token, parceiro,cedente)
      return true
   } catch (error) {
      console.log(error.message)
   }
}
const cadastrar = async (data, token,cedente) => {
   try {
      const url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json"
      const client = sankhyaClient(token)
      const localFields = {
         "TIPPESSOA": {
            "$": cedente["Professor_PF_ou_PJ"]['@key']
         },
         "NOMEPARC": {
            "$": cedente["Nome_Completo_Pessoa_Juridica"]
         },
         "CODCID": {
            "$": "490"
         },
         "ATIVO": {
            "$": "S"
         },
         "CLIENTE": {
            "$": "N"
         },
         "CGC_CPF": {
            "$": cedente["CPF_ou_CNPJ"].replace(/[^a-zA-Z0-9 ]/g, '')
         },
         "CLASSIFICMS": {
            "$": "C"
         }
      }

      const body = {
         "serviceName": "CRUDServiceProvider.saveRecord",
         "requestBody": {
            "dataSet": {
               "rootEntity": "Parceiro",
               "includePresentationFields": "S",
               "dataRow": {
                  "localFields": {
                     "TIPPESSOA": {
                        "$": cedente["Professor_PF_ou_PJ"]['@key'].replace("P", "")
                     },
                     "NOMEPARC": {
                        "$": cedente["Nome_Completo_Pessoa_Juridica"] || cedente["Nome_Completo"]
                     },
                     "CODCID": {
                        "$": "10"
                     },
                     "ATIVO": {
                        "$": "S"
                     },
                     "CLIENTE": {
                        "$": "S"
                     },
                     "CLASSIFICMS": {
                        "$": "C"
                     },
                     "CGC_CPF": {
                        "$": cedente["CPF_ou_CNPJ"].replace(/[^a-zA-Z0-9 ]/g, '')
                     }
                  }
               },
               "entity": {
                  "fieldset": {
                     "list": "CODPARC,TIPPESSOA,NOMEPARC,CODCID,ATIVO,CLIENTE,CLASSIFICMS"
                  }
               }
            }
         }
      }
      let {
         data
      } = await client.post(url, body)
      let codParc = data.responseBody.entities.entity["CODPARC"]["$"]
      return codParc
   } catch (error) {
      console.log(error.message)
   }
}

const cadastrarAD = async (data, token, codParc,cedente) => {
   try {

      let dataCt = data.Params.TemplateFieldData["Data_Contrato_unformatted"]
      let tipoCt = data.Params.TemplateFieldData["Tipo_Contrato"]["@key"]
      const intervenienteAnuente = data.Params.TemplateFieldData["INTERVENIENTE_ANUENTE"]
      const url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json"
      const client = sankhyaClient(token)
      const localFields = {
         "CODPARC": {
            "$": codParc
         },
         "DTCON": {
            "$": new Date(dataCt)
         },
         "TIPCON": {
            "$": tipoCt
         }
      }
      const fieldsetlist = []
      for (var attributename in cedente) {
         if (attributename == "Professor_PF_ou_PJ") {
            fieldsetlist.push(dicionario[attributename])
            localFields[dicionario[attributename]] = {
               "$": cedente[attributename]['#text']
            }
         } else
         if (dicionario[attributename]) {
            fieldsetlist.push(dicionario[attributename])
            localFields[dicionario[attributename]] = {
               "$": cedente[attributename]
            }
         }
      }
      for (var attributename in intervenienteAnuente) {
         if (attributename == "Professor_PF_ou_PJ1") {
            fieldsetlist.push(dicionarioInterveniente[attributename])
            localFields[dicionarioInterveniente[attributename]] = {
               "$": intervenienteAnuente[attributename]['#text'].replace("P", "")
            }
         } else
         if (dicionarioInterveniente[attributename]) {
            fieldsetlist.push(dicionarioInterveniente[attributename])
            localFields[dicionarioInterveniente[attributename]] = {
               "$": intervenienteAnuente[attributename]
            }
         }
      }

      const body = {
         "serviceName": "CRUDServiceProvider.saveRecord",
         "requestBody": {
            "dataSet": {
               "rootEntity": "AD_TCPASSCON",
               "includePresentationFields": "S",
               "dataRow": {
                  "localFields": localFields
               },
               "entity": {
                  "fieldset": {
                     "list": fieldsetlist.join(",") + ",DTCON"
                  }
               }
            }
         }
      }
      let resp = await client.post(url, body)
      return resp
   } catch (error) {
      console.log(error.message)
   }
}
const consultar = async (expression, token) => {
   try {
      const url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.loadRecords&outputType=json"
      const client = sankhyaClient(token)
      const body = {
         "serviceName": "CRUDServiceProvider.loadRecords",
         "requestBody": {
            "dataSet": {
               "rootEntity": "Parceiro",
               "includePresentationFields": "N",
               "offsetPage": "0",
               "criteria": {
                  "expression": {
                     "$": expression
                  }
               },
               "entity": {
                  "fieldset": {
                     "list": "CGC_CPF,CLIENTE"
                  }
               }
            }
         }
      }
      let {
         data
      } = await client.post(url, body)
      let total = data.responseBody.entities.total

      if (total == 0)
         return undefined
      else {
         let codParc = data.responseBody.entities.entity.f2["$"]
         return codParc
      }

   } catch (error) {
      throw error
   }
}
const consultarAD = async (expression, token) => {
   try {
      const url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.loadRecords&outputType=json"
      const client = sankhyaClient(token)
      const body = {
         "serviceName": "CRUDServiceProvider.loadRecords",
         "requestBody": {
            "dataSet": {
               "rootEntity": "AD_TCPASSCON",
               "includePresentationFields": "N",
               "offsetPage": "0",
               "criteria": {
                  "expression": {
                     "$": expression
                  }
               },
               "entity": {
                  "fieldset": {
                     "list": "CGC_CPF,DTCON,TIPCON"
                  }
               }
            }
         }
      }
      let {
         data
      } = await client.post(url, body)
      let total = data.responseBody.entities.total

      return true


   } catch (error) {
      throw error
   }
}
export default {
   cadastro
}