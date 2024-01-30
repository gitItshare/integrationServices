
import axios from "axios";
import fs from "fs"
import path from 'path';
import jwt from "../jwt.js"
import  querystring from "querystring"

let dirname = path.resolve(path.dirname(''));


 class Docusign {
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
            const iat = Math.floor(+new Date() / 1000);
            const exp = Math.floor(+new Date() * 1000);
             const payload = {
                "iss": this.integrationKey,
                "sub": this.userID,
                "aud":"account-d.docusign.com",
                "iat": exp,
                "exp":iat,
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
            let testemunhastabs = []
            
            let template = {
                    "signers": [
                        {
                            "defaultRecipient": "false",
            
                            "signInEachLocation": "false",
                            "recipientSignatureProviders": [
                                {
                                    "sealDocumentsWithTabsOnly": "false",
                                    "signatureProviderName": "",
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
                    ]
            }
            let recipients = []
            console.log(params)

            let signers = params.map((el, index) => {
                    let recipientId = "2132"+index
                    let tabs = {
                                "signHereTabs":[
                                   {
                                      "stampType":"signature",
                                      "name":"SignHere",
                                      "tabLabel":"Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                      "scaleValue":"1",
                                      "optional":"false",
                                      "documentId":"1",
                                      "recipientId":recipientId,
                                      "pageNumber":"1",
                                      "xPosition":"",
                                      "yPosition":"",
                                      "anchorString":"/"+el.tag["_text"]+"/",
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
                                ]
                             }
                             testemunhastabs.push(tabs.signHereTabs[0])
                    let signer = {
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
                                  "recipientId":recipientId,
                                  "pageNumber":"1",
                                  "xPosition":"",
                                  "yPosition":"",
                                  "anchorString":"\\"+el.tag["_text"]+"\\",
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
                            ]
                         },
                        "agentCanEditEmail": "false",
                        "agentCanEditName": "false",
                        "name": el.nome["_text"],
                        "email": el.email["_text"],
                        "recipientId": recipientId,
                        "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                        "accessCode": "",
                        "requireIdLookup": "false",
                        "identityVerification": {
                            "inputOptions": [],
                            "workflowLabel": ""
                        },
                        "routingOrder": el.ordem["_text"],
                        "note": "",
                        "roleName": el.nome["_text"].split(" ")[0],
                        "deliveryMethod": "email",
                        "templateLocked": "false",
                        "templateRequired": "false",
                        "inheritEmailNotificationConfiguration": "false"
                    }
                    if(el.tipoAss["_text"] == "ICP"){
                        signer.recipientSignatureProviders = [{
                            "sealDocumentsWithTabsOnly": "false",
                            "signatureProviderName": "universalsignaturepen_icp_smartcard_tsp",
                            "signatureProviderOptions": {
                                "cpfNumber":el.cpf["_text"],
                                "signerRole":el.nome["_text"].split(" ")[0]
                            }
                        }]
                    }
   
                    if(el.tipoAss["_text"] == "BIOMETRIA"){
                        signer.clientUserId = el.cpf["_text"]
                        signer.embeddedRecipientStartURL =  `https://portalspa-hml.safra.com.br/dcs/identification?envelopeId=0f153270-9036-4381-ba6f-9de77e00f5d0&recipientId=${recipientId}`
                    }
                    return signer
            })
             template.signers = signers
            console.log(template.signers)
            const templateSigners = await axios.get(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients`, {
                headers: {
                    'Authorization': this.authToken
                }
            }); 
            const recipient = templateSigners.data
            console.log("OPOORA", testemunhastabs)
            if(templateSigners.data.signers.length > 0)
                await axios.delete(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients`,{
                    headers: {
                        'Authorization': this.authToken
                    },
                    data:recipient
                }); 
            const resp = await axios.put(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients`, template, {
                headers: {
                    'Authorization': this.authToken
                }
            }); 

            for(let tab of testemunhastabs){
                console.log(tab)
                
                await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients/${tab.recipientId}/tabs`, {signHereTabs: [tab]}, {
                headers: {
                     'Authorization': this.authToken
                 }
             }); 
             console.log("tab inserida..")
            }
            console.log(resp.data.recipientUpdateResults)
             return "resp"
        } catch (error) {
             console.log(error)
        }
    }

}

export default  Docusign

