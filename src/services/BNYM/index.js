import axios from "axios";
import fs from "fs"
import path from 'path';
import jwt from "../jwt.js"
import querystring from "querystring"
import { v4 as uuidv4 } from 'uuid';
let dirname = path.resolve(path.dirname(''));


class Bnym {
    constructor(docusignCredentials, scope) {
        this.userID = docusignCredentials.userID
        this.integrationKey = docusignCredentials.integrationKey
        this.dsOauthServer = docusignCredentials.dsOauthServer
        this.accountID = docusignCredentials.accountID
        this.privateKey = docusignCredentials.privateKey
        this.scope = scope
        this.authUrl = 'https://account.docusign.com/oauth/token?'
        this.jwtToken = ""
        this.authToken = ""
    }
    async authenticate() {
        try {
            const queryData = querystring.stringify({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: this.jwtToken
            });
            const resp = await axios.post(`${this.authUrl}${queryData}`);
            let data = resp.data;

            this.authToken = "Bearer " + data.access_token

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
                "aud": "account.docusign.com",
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
    async makeTemplate(params, envelopeId) {
        try {
            console.log(this.authToken)
            let template = {
                "signers": [],
                "agents": []
            }
            let tabs = {
                signHereTabs: []
            }

            let recipients = []
            let indexTestemunha = 0
            let indexRepresentante = 0
            let indexAgent = 0
            let agents = params.map((el, index) => {
  
                indexAgent = index+1
                let signers = []
                if (el.assinaturas[0]) {
                    signers = el.assinaturas.map((sign, i) => {
                        let recipientIdSigner = uuidv4()

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
                            agentCanEditName:true,
                            "tabs": {
                                "signHereTabs": [{
                                        "stampType": "signature",
                                        "name": "SignHere",
                                        "tabLabel": "Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                        "scaleValue": "1",
                                        "optional": "false",
                                        "documentId": "1",
                                        "recipientId": recipientIdSigner ,
                                        "pageNumber": "1",
                                        "xPosition": "",
                                        "yPosition": "",
                                        "anchorString": "\\ass" + sign.ancora["_text"].trim() + "\\",
                                        "anchorXOffset": "0",
                                        "anchorYOffset": "0",
                                        "anchorUnits": "pixels",
                                        "anchorCaseSensitive": "false",
                                        "anchorMatchWholeWord": "true",
                                        "anchorHorizontalAlignment": "left",
                                        "anchorTabProcessorVersion": "v1_3",
                                        "tabId": "15bdf337-9e98-43af-b560-6019d250e5bb",
                                        "templateLocked": "false",
                                        "templateRequired": "false",
                                        "tabType": "signhere"
                                    },
                                    {
                                        "stampType": "stamp",
                                        "name": "SignHereOptional",
                                        "tabLabel": "Selo 15fef517-430d-4336-b092-6686a4f9ccec",
                                        "scaleValue": "1",
                                        "optional": "true",
                                        "documentId": "1",
                                        "recipientId": recipientIdSigner,
                                        "pageNumber": "1",
                                        "xPosition": "",
                                        "yPosition": "",
                                        "anchorString": "\\car" + (sign.ancora["_text"].trim().includes("distribuidoraai")? "aai"+(i+1) : sign.ancora["_text"].trim()) + "\\",
                                        "anchorXOffset": "0",
                                        "anchorYOffset": "0",
                                        "anchorUnits": "pixels",
                                        "anchorCaseSensitive": "false",
                                        "anchorMatchWholeWord": "true",
                                        "anchorHorizontalAlignment": "left",
                                        "anchorTabProcessorVersion": "v1_3",
                                        "tabId": "5746ff3b-1d40-48e5-a9f4-a8dcea0839b8",
                                        "templateLocked": "false",
                                        "templateRequired": "false",
                                        "tabType": "signhereoptional"
                                    }
                                ],
                            },
                            "name": sign.nome["_text"],
                            "email": "",
                            "recipientId": recipientIdSigner,
                            "accessCode": "",
                            "requireIdLookup": "false",
                            "routingOrder": sign.order["_text"],
                            "note": "",
                            "deliveryMethod": "email",
                            "templateLocked": "false",
                            "templateRequired": "false",
                            "inheritEmailNotificationConfiguration": "false"
                        }
                        if(el.tipoAss["_text"] == "ICP"){
                            signer.recipientSignatureProviders = [{
                                "sealDocumentsWithTabsOnly": "false",
                                "signatureProviderName": "universalsignaturepen_imageonly",
                                "signatureProviderOptions": {}
                            }]
                        }
                        tabs.signHereTabs.push(signer.tabs.signHereTabs[0])
                        tabs.signHereTabs.push(signer.tabs.signHereTabs[1])
                        return signer
                    })
                }
                let testemunhas = []
                if (el.testemunhas[0]) {
                    testemunhas = el.testemunhas.map((testemunha,i) => {
                        let recipientIdTestemunha = uuidv4()

                        let signer = {
                            "defaultRecipient": "false",
                            "recipientSignatureProviders": [
                                {
                                    "sealDocumentsWithTabsOnly": "false",
                                    "signatureProviderName": "universalsignaturepen_imageonly",
                                    "signatureProviderOptions": {}
                                }
                            ],                            
                            "signInEachLocation": "false",
                            "tabs": {
                                "signHereTabs": [{
                                    "stampType": "signature",
                                    "name": "SignHere",
                                    "tabLabel": "Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                    "scaleValue": "1",
                                    "optional": "false",
                                    "documentId": "1",
                                    "recipientId": recipientIdTestemunha,
                                    "pageNumber": "1",
                                    "xPosition": "",
                                    "yPosition": "",
                                    "anchorString": "\\ass" + testemunha.ancora["_text"].trim() + "\\",
                                    "anchorXOffset": "0",
                                    "anchorYOffset": "0",
                                    "anchorUnits": "pixels",
                                    "anchorCaseSensitive": "false",
                                    "anchorMatchWholeWord": "true",
                                    "anchorHorizontalAlignment": "left",
                                    "anchorTabProcessorVersion": "v1_3",
                                    "tabId": "15bdf337-9e98-43af-b560-6019d250e5bb",
                                    "templateLocked": "false",
                                    "templateRequired": "false",
                                    "tabType": "signhere"
                                }],
                                "initialHereTabs": [{
                                    "name": "InitialHereOptional",
                                    "tabLabel": "Rubrica 8ace02c6-f022-4aaa-8bd2-5b02bb19b7ec",
                                    "scaleValue": "1",
                                    "optional": "true",
                                    "documentId": "1",
                                    "recipientId": recipientIdTestemunha,
                                    "pageNumber": "1",
                                    "xPosition": "276",
                                    "yPosition": "437",
                                    "anchorString": "\\rubrica" + testemunha.ancora["_text"].trim() + "\\",
                                    "anchorXOffset": "0",
                                    "anchorYOffset": "0",
                                    "anchorUnits": "pixels",
                                    "anchorCaseSensitive": "false",
                                    "anchorMatchWholeWord": "true",
                                    "anchorHorizontalAlignment": "left",
                                    "anchorTabProcessorVersion": "v1_3",
                                    "tabId": "f4315993-68d8-44bc-9562-b2055379111f",
                                    "templateLocked": "false",
                                    "templateRequired": "false",
                                    "tabType": "initialhereoptional"
                                }]
                            },
                            agentCanEditName:true,
                            "name": testemunha.nome["_text"],
                            "email": "",
                            "recipientId": recipientIdTestemunha,
                            "accessCode": "",
                            "routingOrder": testemunha.order["_text"],
                            "note": "",
                            "deliveryMethod": "email",
                            "templateLocked": "false",
                            "templateRequired": "false",
                            "inheritEmailNotificationConfiguration": "false"
                        }
                        if(el.tipoAss["_text"] == "ICP"){
                            signer.recipientSignatureProviders = [
                                {
                                    "sealDocumentsWithTabsOnly": "false",
                                    "signatureProviderName": "universalsignaturepen_icp_smartcard_tsp",
                                    "signatureProviderOptions": {}
                                }
                            ]
                        }
                        tabs.signHereTabs.push(signer.tabs.signHereTabs[0])
                        tabs.initialHereTabs = []
                        tabs.initialHereTabs.push(signer.tabs.initialHereTabs[0])
                        return signer
                    })
                }

                recipients.push(...testemunhas)
                recipients.push(...signers)

                let agent ={
                    "name": el.role["_text"] + " - CENTRALIZADOR",
                    "email": el.email["_text"].trim(),
                    "recipientId": uuidv4(),
                    "accessCode": "",
                    "requireIdLookup": "false",
                    "routingOrder": el.order["_text"],
                    "note": "",
                    "roleName": el.role["_text"] + " - CENTRALIZADOR",
                    "completedCount": "0",
                    "deliveryMethod": "email",
                    "templateLocked": "false",
                    "templateRequired": "false",
                    "inheritEmailNotificationConfiguration": "false",
                    "recipientType": "agent",
                    "allowRecipientRecursion": "true"
                    
                }
                return agent
            })

            template.signers = recipients
            template.agents = agents
            console.log(template)
            let recipientsEnv = await axios.get(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients`, {
                headers: {
                    'Authorization': this.authToken
                },
            });
            try {
                await axios.delete(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients`, {
                    headers: {
                        'Authorization': this.authToken
                    },
                    data: recipientsEnv.data
                });
            } catch (error) {
                console.log("nao deletei", error.response.data)
            }
            const resp = await axios.post(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients`, template, {
                headers: {
                    'Authorization': this.authToken
                }
            });
            console.log(resp.data.signers)
            console.log(resp.data.agents)

            for (let tab of tabs.signHereTabs) {
                try {
                    // console.log(tab)
                    if(tab){
                        await axios.post(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients/${tab.recipientId}/tabs`, {
                            signHereTabs: [tab]
                        }, {
                            headers: {
                                'Authorization': this.authToken
                            }
                        });
                        console.log("tab inserida..")
                    }
                } catch (error) {
                    console.log("tab nao inserida", error.response.data)
                    
                }
            }
            for (let tab of tabs.initialHereTabs) {
                try {
                    // console.log(tab)
                    if(tab){
                        await axios.post(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients/${tab.recipientId}/tabs`, {
                            initialHereTabs: [tab]
                        }, {
                            headers: {
                                'Authorization': this.authToken
                            }
                        });
                        console.log("tab inserida..")
                    }
              
                } catch (error) {
                    console.log(error)
                }
            }

            return resp.data
        } catch (error) {
            console.log(error)
        }
    }
     makexml(json){
        var xml = "<recipients>"
        Object.keys(json).forEach(function(key, index) {
            xml+= "<agents>"
            console.log('Key : ' + key)
            console.log(json[key])
            
            xml +=  "<nome>"+json[key].nome+"</nome>"
            xml +=  "<role>"+json[key].role+"</role>"
            xml+=   "<tipoAss>"+json[key].tipoAss+"</tipoAss>"
            xml +=  "<email>"+ json[key].email +" </email>",
            xml +=  "<order>"+ (index+1) +"</order>"
            for(var f = 0; f < parseInt(json[key].qtdTestemunhas); f++) {
                xml += "<testemunhas><role>"+json[key].role+"</role> <nome> Testemunha "+ json[key].role + " " +(f+1) + "</nome> <ancora>test" + json[key].ancora.trim() + (f+1) + "</ancora>"+ "<order>"+ (index+1) +"</order> </testemunhas>";
            }
            for(var af = 0; af < parseInt(json[key].qtdAss); af++) {
                xml += "<assinaturas><role>"+json[key].role+"</role> <nome>" + json[key].role + " " +(af+1) + "</nome><ancora>" + json[key].ancora.trim() +(af+1) + "</ancora>"+ "<order>"+ (index+1) +"</order> </assinaturas>";
            }
            xml+="</agents>"
          })
          xml += "</recipients>"
          console.log("XML", xml)
          return xml
    }
}

export default Bnym

