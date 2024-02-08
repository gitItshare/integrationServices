
import axios from "axios";
import fs from "fs"
import path from 'path';
import jwt from "../jwt.js"
import  querystring from "querystring"

let dirname = path.resolve(path.dirname(''));


 class Bnym {
    constructor(docusignCredentials, scope){
        this.userID = docusignCredentials.userID
        this.integrationKey = docusignCredentials.integrationKey
        this.dsOauthServer = docusignCredentials.dsOauthServer
        this.accountID = docusignCredentials.accountID
        this.privateKey = docusignCredentials.privateKey
        this.scope = scope
        this.authUrl  = 'https://account.docusign.com/oauth/token?'
        this.jwtToken = ""
        this.authToken = ""
    }
    async authenticate() {
        try {
            const queryData = querystring.stringify({
                grant_type : 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion : this.jwtToken
            });
            const resp = await axios.post(`${this.authUrl}${queryData}`); 
            let data =  resp.data;
            
            this.authToken = "Bearer "+data.access_token

        } catch (error) {
            console.log(error)
            this.authToken = 'error'
        }   
    }
    async jwt() {
        try {
            const iat = Math.floor(+new Date() / 1000);
            const exp = Math.floor(+new Date() * 1000);
             const payload = {
                "iss": this.integrationKey,
                "sub": this.userID,
                "aud":"account.docusign.com",
                "iat": exp,
                "exp": iat,
                "scope": this.scope
             }
             console.log(payload)
             const JWT = new jwt(payload, this.privateKey)
            const token = await JWT.getToken();
            console.log(token)
            this.jwtToken = token
         } catch (error) {
             console.log(error)
             this.jwtToken = ''
         }
     }
    async makeTemplate (params) {
        let Username = process.env.usernameBny
let Password = process.env.passwordBny
let IntegratorKey = process.env.integratorKeyBny
        try {
            console.log(this.authToken)
            let document = await fs.readFileSync(dirname+"\/templateteste.pdf")
            console.log(document)
            let template = {
                "envelopeTemplateDefinition": {
                    "name": "TESTE API1",
                    "shared": "true",
                    },
                    "documents": [{
                        "documentId": "1",
                        "uri": "/envelopes/e181bd1f-348e-4df7-aca9-e006ee328e3f/documents/1",
                        "name": "template teste",
                        "order": "1",
                        "pages": "2",
                        "documentBase64": document.toString("base64"),
                        "display": "inline",
                        "includeInDownload": "true",
                        "signerMustAcknowledge": "no_interaction",
                        "templateLocked": "false",
                        "templateRequired": "false"
                    }],
                    recipients:{
                        "signers": [
                            {
                                "defaultRecipient": "false",
                
                                "signInEachLocation": "false",
                                "recipientSignatureProviders": [
                                    {
                                        "sealDocumentsWithTabsOnly": "false",
                                        "signatureProviderName": "universalsignaturepen_imageonly",
                                        "signatureProviderOptions": {}
                                    }
                                ],
                                "agentCanEditEmail": "false",
                                "agentCanEditName": "false",
                                "name": "",
                                "email": "",
                                "recipientId": "57207250",
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": "1",
                                "note": "",
                                "roleName": "AjustarFluxo",
                                "deliveryMethod": "email",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            },
                            {
                                "defaultRecipient": "false",
                
                                "signInEachLocation": "false",
                                "recipientSignatureProviders": [
                                    {
                                        "sealDocumentsWithTabsOnly": "false",
                                        "signatureProviderName": "universalsignaturepen_imageonly",
                                        "signatureProviderOptions": {}
                                    }
                                ],
                                "agentCanEditEmail": "false",
                                "agentCanEditName": "false",
                                "name": "",
                                "email": "",
                                "recipientId": "20046505",
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": "2",
                                "note": "",
                                "roleName": "GESTOR DO FUNDO INVESTIDO 1",
                                "deliveryMethod": "email",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            }
                        ],
                        "agents": [
                            {
                                "name": "Administrador ITShare",
                                "email": "administrador@itshare.com.br",
                                "recipientId": "74075348",
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": "1",
                                "note": "",
                                "roleName": "GESTOR DO FUNDO INVESTIDO",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            },
                            {
                                "name": "Administrador ITShare",
                                "email": "administrador@itshare.com.br",
                                "recipientId": "15515990",
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": "2",
                                "note": "",
                                "roleName": "DISTRIBUIDOR AAI",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            }
                        ]    
                    }
         
            }
            let recipients = []
            let agents = params.map((el, index) => {
                    let recipientId = "2132"+index
  
                    let recipient = {
                        "defaultRecipient": "false",
        
                        "signInEachLocation": "false",
                        "recipientSignatureProviders": [
                            {
                                "sealDocumentsWithTabsOnly": "false",
                                "signatureProviderName": "universalsignaturepen_imageonly",
                                "signatureProviderOptions": {}
                            }
                        ],
                        "tabs":{
                            "signHereTabs":[
                               {
                                  "stampType":"signature",
                                  "name":"SignHere",
                                  "tabLabel":"Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                  "scaleValue":"1",
                                  "optional":"false",
                                  "documentId":"1",
                                  "recipientId":recipientId+1+1,
                                  "pageNumber":"1",
                                  "xPosition":"",
                                  "yPosition":"",
                                  "anchorString":"\\ass"+el.tipo["_text"].trim()+"\\",
                                  "anchorXOffset":"0",
                                  "anchorYOffset":"0",
                                  "anchorUnits":"pixels",
                                  "anchorCaseSensitive":"false",
                                  "anchorMatchWholeWord":"true",
                                  "anchorHorizontalAlignment":"left",
                                  "anchorTabProcessorVersion":"v1_3",
                                  "tabId":"15bdf337-9e98-43af-b560-6019d250e5bb",
                                  "templateLocked":"false",
                                  "templateRequired":"false",
                                  "tabType":"signhere"
                               }, 
                               {
                                "stampType":"stamp",
                                "name":"SignHereOptional",
                                "tabLabel":"Selo 15fef517-430d-4336-b092-6686a4f9ccec",
                                "scaleValue":"1",
                                "optional":"true",
                                "documentId":"1",
                                "recipientId":recipientId+1+1,
                                "pageNumber":"1",
                                "xPosition":"",
                                "yPosition":"",
                                "anchorString":"\\car"+el.tipo["_text"].trim()+"\\",
                                "anchorXOffset":"0",
                                "anchorYOffset":"0",
                                "anchorUnits":"pixels",
                                "anchorCaseSensitive":"false",
                                "anchorMatchWholeWord":"true",
                                "anchorHorizontalAlignment":"left",
                                "anchorTabProcessorVersion":"v1_3",
                                "tabId":"5746ff3b-1d40-48e5-a9f4-a8dcea0839b8",
                                "templateLocked":"false",
                                "templateRequired":"false",
                                "tabType":"signhereoptional"
                             }
                            ]
                         },
                        "agentCanEditEmail": "false",
                        "agentCanEditName": "false",
                        "name": el.tipo["_text"],
                        "email": el.email["_text"],
                        "recipientId": recipientId+1+1,
                        "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                        "accessCode": "",
                        "requireIdLookup": "false",
                        "identityVerification": {
                            "inputOptions": [],
                            "workflowLabel": ""
                        },
                        "routingOrder": index+1,
                        "note": "",
                        "roleName": el.tipo["_text"],
                        "deliveryMethod": "email",
                        "templateLocked": "false",
                        "templateRequired": "false",
                        "inheritEmailNotificationConfiguration": "false"
                    }
                    let signers = []
                    if(el.assinaturas[0]){
                        signers = el.assinaturas.map((sign, i) => {
                            return {
                                "defaultRecipient": "false",
                
                                "signInEachLocation": "false",
                                "recipientSignatureProviders": [
                                    {
                                        "sealDocumentsWithTabsOnly": "false",
                                        "signatureProviderName": "universalsignaturepen_imageonly",
                                        "signatureProviderOptions": {}
                                    }
                                ],
                                "tabs":{
                                    "signHereTabs":[
                                       {
                                          "stampType":"signature",
                                          "name":"SignHere",
                                          "tabLabel":"Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                          "scaleValue":"1",
                                          "optional":"false",
                                          "documentId":"1",
                                          "recipientId":recipientId+1+index+i,
                                          "pageNumber":"1",
                                          "xPosition":"",
                                          "yPosition":"",
                                          "anchorString":"\\ass"+sign.ancora["_text"].trim()+"\\",
                                          "anchorXOffset":"0",
                                          "anchorYOffset":"0",
                                          "anchorUnits":"pixels",
                                          "anchorCaseSensitive":"false",
                                          "anchorMatchWholeWord":"true",
                                          "anchorHorizontalAlignment":"left",
                                          "anchorTabProcessorVersion":"v1_3",
                                          "tabId":"15bdf337-9e98-43af-b560-6019d250e5bb",
                                          "templateLocked":"false",
                                          "templateRequired":"false",
                                          "tabType":"signhere"
                                       },
                                       {
                                        "stampType":"stamp",
                                        "name":"SignHereOptional",
                                        "tabLabel":"Selo 15fef517-430d-4336-b092-6686a4f9ccec",
                                        "scaleValue":"1",
                                        "optional":"true",
                                        "documentId":"1",
                                        "recipientId":recipientId+1+1,
                                        "pageNumber":"1",
                                        "xPosition":"",
                                        "yPosition":"",
                                        "anchorString":"\\car"+sign.ancora["_text"].trim()+"\\",
                                        "anchorXOffset":"0",
                                        "anchorYOffset":"0",
                                        "anchorUnits":"pixels",
                                        "anchorCaseSensitive":"false",
                                        "anchorMatchWholeWord":"true",
                                        "anchorHorizontalAlignment":"left",
                                        "anchorTabProcessorVersion":"v1_3",
                                        "tabId":"5746ff3b-1d40-48e5-a9f4-a8dcea0839b8",
                                        "templateLocked":"false",
                                        "templateRequired":"false",
                                        "tabType":"signhereoptional"
                                     }
                                    ],

                                 },
                                "agentCanEditEmail": "false",
                                "agentCanEditName": "false",
                                "name": sign.nome["_text"],
                                "email": "",
                                "recipientId": recipientId+1+index+i,
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": index+1,
                                "note": "",
                                "roleName": sign.nome["_text"],
                                "deliveryMethod": "email",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            }
                        })
                    }
                    let testemunhas = []
                    if(el.testemunhas[0]){
                        testemunhas = el.testemunhas.map((testemunha, index) => {
                            return {
                                "defaultRecipient": "false",
                
                                "signInEachLocation": "false",
                                "recipientSignatureProviders": [
                                    {
                                        "sealDocumentsWithTabsOnly": "false",
                                        "signatureProviderName": "universalsignaturepen_imageonly",
                                        "signatureProviderOptions": {}
                                    }
                                ],
                                "tabs":{
                                    "signHereTabs":[
                                       {
                                          "stampType":"signature",
                                          "name":"SignHere",
                                          "tabLabel":"Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                          "scaleValue":"1",
                                          "optional":"false",
                                          "documentId":"1",
                                          "recipientId":recipientId+2+index,
                                          "pageNumber":"1",
                                          "xPosition":"",
                                          "yPosition":"",
                                          "anchorString":"\\ass"+testemunha.ancora["_text"].trim()+"\\",
                                          "anchorXOffset":"0",
                                          "anchorYOffset":"0",
                                          "anchorUnits":"pixels",
                                          "anchorCaseSensitive":"false",
                                          "anchorMatchWholeWord":"true",
                                          "anchorHorizontalAlignment":"left",
                                          "anchorTabProcessorVersion":"v1_3",
                                          "tabId":"15bdf337-9e98-43af-b560-6019d250e5bb",
                                          "templateLocked":"false",
                                          "templateRequired":"false",
                                          "tabType":"signhere"
                                       }
                                    ],
                                    "initialHereTabs":[
                                        {
                                           "name":"InitialHereOptional",
                                           "tabLabel":"Rubrica 8ace02c6-f022-4aaa-8bd2-5b02bb19b7ec",
                                           "scaleValue":"1",
                                           "optional":"true",
                                           "documentId":"1",
                                           "recipientId":"37304",
                                           "pageNumber":"1",
                                           "xPosition":"276",
                                           "yPosition":"437",
                                           "anchorString":"\\rubrica"+testemunha.ancora["_text"].trim()+"\\",
                                           "anchorXOffset":"0",
                                           "anchorYOffset":"0",
                                           "anchorUnits":"pixels",
                                           "anchorCaseSensitive":"false",
                                           "anchorMatchWholeWord":"true",
                                           "anchorHorizontalAlignment":"left",
                                           "anchorTabProcessorVersion":"v1_3",
                                           "tabId":"f4315993-68d8-44bc-9562-b2055379111f",
                                           "templateLocked":"false",
                                           "templateRequired":"false",
                                           "tabType":"initialhereoptional"
                                        }
                                     ]
                                 },
                                "agentCanEditEmail": "false",
                                "agentCanEditName": "false",
                                "name": testemunha.nome["_text"],
                                "email": "",
                                "recipientId": recipientId+2+index,
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": index+1,
                                "note": "",
                                "roleName": testemunha.nome["_text"],
                                "deliveryMethod": "email",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            }
                        })
                    }
    
                    recipients.push(...testemunhas)
                    recipients.push(...signers)

                return   {
                            "name": "BNY Mellon - CENTRALIZADOR",
                            "email": "bnymcontratosdedistribuicao@bnymellon.com.br",
                            "accessCode": "",
                            "requireIdLookup": "false",
                            "identityVerification": {
                                "inputOptions": [],
                                "workflowLabel": ""
                            },
                            recipientId: recipientId,
                            "routingOrder": index+1,
                            "note": "",
                            "roleName": el.tipo["_text"]+" CENTRALIZADOR",
                            "templateLocked": "false",
                            "templateRequired": "false",
                            "inheritEmailNotificationConfiguration": "false"
                        }
            })

             template.recipients.signers = recipients
             template.recipients.agents = agents
            console.log(template.recipients.signers.map(el => el.tabs.signHereTabs))
            const resp = await axios.post(`https://na2.docusign.net/restapi/v2/accounts/107905117/templates`, template, {
                headers: {
                    'Authorization': this.authToken
                }
            }); 
             return resp.data
        } catch (error) {
             console.log(error)
        }
    }

}

export default  Bnym

