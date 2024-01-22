
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
        this.authUrl  = 'https://account-d.docusign.com/oauth/token?'
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
            const iat = 1628496664;
            const exp = 1912493464;
             const payload = {
                "iss": this.integrationKey,
                "sub": this.userID,
                "aud":"account-d.docusign.com",
                "iat": 1628496664,
                "exp":1912493464,
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

        try {
            console.log(this.authToken)

            let template = {
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
            let recipients = []
            console.log(params)
            let agents = params.map((el, index) => {
                    let recipientId = "2132"+index
                    let indexAg = index+1
                    let y = el.position["_text"].split(",")[0]
                    let x = el.position["_text"].split(",")[1]
                    let ycar = el.carimbo["_text"].split(",")[0]
                    let xcar = el.carimbo["_text"].split(",")[1]
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
                                  "recipientId":recipientId+1,
                                  "pageNumber":"1",
                                  "xPosition":x,
                                  "yPosition":y,
                                  "anchorString":"\\ass"+el.tipo["_text"]+"\\",
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
                                "recipientId":recipientId+1,
                                "pageNumber":"1",
                                "xPosition":xcar,
                                "yPosition":ycar,
                                "anchorString":"\\car"+el.tipo["_text"]+"\\",
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
                        "recipientId": recipientId+1,
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
                                          "recipientId":recipientId+1+index,
                                          "pageNumber":"1",
                                          "xPosition":x,
                                          "yPosition":y,
                                          "anchorString":"\\asstest"+el.tipo["_text"]+"\\",
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
                                           "recipientId":"37377104",
                                           "pageNumber":"1",
                                           "xPosition":"276",
                                           "yPosition":"437",
                                           "anchorString":"\\rubricatest"+el.tipo["_text"]+"\\",
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
                                "recipientId": recipientId+1+index,
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": indexAg,
                                "note": "",
                                "roleName": testemunha.nome["_text"],
                                "deliveryMethod": "email",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            }
                        })
                    }
                    let assinaturas = []
                    if(el.assinaturas[0]){
                        assinaturas = el.assinaturas.map((assinatura, index) => {
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
                                          "recipientId":recipientId+1+index,
                                          "pageNumber":"1",
                                          "xPosition":x,
                                          "yPosition":y,
                                          "anchorString":"\\ass"+assinatura.ancora["_text"]+"\\",
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
                                 },
                                "agentCanEditEmail": "false",
                                "agentCanEditName": "false",
                                "name": assinatura.nome["_text"],
                                "email": "",
                                "recipientId": recipientId+1+index+1,
                                "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                                "accessCode": "",
                                "requireIdLookup": "false",
                                "identityVerification": {
                                    "inputOptions": [],
                                    "workflowLabel": ""
                                },
                                "routingOrder": indexAg,
                                "note": "",
                                "roleName": assinatura.nome["_text"],
                                "deliveryMethod": "email",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "inheritEmailNotificationConfiguration": "false"
                            }
                        })
                    }
    
                    recipients.push(recipient)
                    recipients.push(...testemunhas)
                    recipients.push(...assinaturas)

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
             template.signers = recipients
             template.agents = agents
            console.log(template.signers)
            const resp = await axios.put(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/76b4990a-8742-4925-aa4c-ff8636d8a612/recipients`, template, {
                headers: {
                    'Authorization': this.authToken
                }
            }); 
            console.log(resp.data.recipientUpdateResults)
             return "resp"
        } catch (error) {
             console.log(error)
        }
    }

}

export default  Bnym

