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
   "CPF_Administrador": "CPFADM"
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
   "Endereco_eletronico": "EMAIL_PARCINT"
}
const cadastro = async(data, token) => {
   try {
      const cedente = data.Params.Params.TemplateFieldData.CEDENTE
      let cpfcnpj = cedente["CPF_ou_CNPJ"].replace(/[^a-zA-Z0-9 ]/g, '')
      let parceiro = await consultar(`this.CGC_CPF = '${cpfcnpj}' AND CLIENTE = 'S'`,token)

      if(!parceiro)
          parceiro = await cadastrar(data, token)

       let clienteAD = await cadastrarAD(data, token, parceiro)
      return "codParc"
   } catch (error) {
      console.log(error)
   }
}
const cadastrar = async (data, token) => {
   try {
      const cedente = data.Params.Params.TemplateFieldData.CEDENTE
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
      console.log("data", cedente)
      console.log("data", localFields)

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
                        "$": cedente["Nome_Completo_Pessoa_Juridica"]
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
      let resp = await client.post(url, body)
      let codParc = resp.responseBody.entities.entity["CODPARC"]["$"]
      console.log(resp)
      return codParc
   } catch (error) {
      console.log(error)
   }
}

const cadastrarAD = async (data, token, codParc) => {
   try {

      const cedente = data.Params.Params.TemplateFieldData.CEDENTE
      let dataCt = data.Params.Params.TemplateFieldData["Data_Contrato_unformatted"]
      let tipoCt = data.Params.Params.TemplateFieldData["Tipo_Contrato"]["@key"]
      const intervenienteAnuente = data.Params.Params.TemplateFieldData["INTERVENIENTE_ANUENTE"]
      const url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json"
      const client = sankhyaClient(token)
      const localFields = {
         "CODPARC": {
            "$": codParc
         },
         "DTCON": {
            "$": dataCt
         },
         "TIPCON": {
            "$": tipoCt
         }
      }
      const fieldsetlist = []
      console.log("data", cedente)
      for (var attributename in cedente) {
         console.log(cedente[attributename]);
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
         console.log(intervenienteAnuente[attributename]);
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
      console.log("data", fieldsetlist.join(","))
      console.log("data", localFields)

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
                     "list": fieldsetlist.join(",")
                  }
               }
            }
         }
      }
      let resp = await client.post(url, body)
      console.log(resp.data.responseBody)
   } catch (error) {
      console.log(error)
   }
}
const consultar = async(expression,token) => {
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
      let {data} = await client.post(url, body)
      console.log(data.responseBody.entities)
      let total = data.responseBody.entities.total
      
      if(total == 0)
       return undefined
      else {
         let codParc = data.responseBody.entities.entity.f2["$"]
         return codParc
      }
         
   } catch (error) {
      throw error
   }
}
export default {
   cadastro
}
