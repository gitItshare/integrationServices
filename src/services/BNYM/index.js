import axios from "axios";
import fs from "fs"
import path from 'path';
import jwt from "../jwt.js"
import querystring from "querystring"

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
                let recipientId = "2132" + index
                let signers = []
                if (el.assinaturas[0]) {
                    signers = el.assinaturas.map((sign, i) => {
                        let signer = {
                            "defaultRecipient": "false",
                            "signInEachLocation": "false",
                            "tabs": {
                                "signHereTabs": [{
                                        "stampType": "signature",
                                        "name": "SignHere",
                                        "tabLabel": "Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                        "scaleValue": "1",
                                        "optional": "false",
                                        "documentId": "1",
                                        "recipientId": recipientId ,
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
                                        "recipientId": recipientId,
                                        "pageNumber": "1",
                                        "xPosition": "",
                                        "yPosition": "",
                                        "anchorString": "\\car" + sign.ancora["_text"].trim() + "\\",
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
                            "agentCanEditEmail": "false",
                            "agentCanEditName": "false",
                            "name": sign.nome["_text"],
                            "email": "",
                            "recipientId": recipientId,
                            "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                            "accessCode": "",
                            "requireIdLookup": "false",
                            "identityVerification": {
                                "inputOptions": [],
                                "workflowLabel": ""
                            },
                            "routingOrder": indexAgent,
                            "note": "",
                            "roleName": sign.nome["_text"],
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
                    testemunhas = el.testemunhas.map((testemunha) => {
                        let signer = {
                            "defaultRecipient": "false",

                            "signInEachLocation": "false",
                            // "recipientSignatureProviders": [
                            //     {
                            //         "sealDocumentsWithTabsOnly": "false",
                            //         "signatureProviderName": "universalsignaturepen_imageonly",
                            //         "signatureProviderOptions": {}
                            //     }
                            // ],
                            "tabs": {
                                "signHereTabs": [{
                                    "stampType": "signature",
                                    "name": "SignHere",
                                    "tabLabel": "Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                    "scaleValue": "1",
                                    "optional": "false",
                                    "documentId": "1",
                                    "recipientId": recipientId + 2,
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
                                    "recipientId": recipientId + 2,
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
                            "agentCanEditEmail": "false",
                            "agentCanEditName": "false",
                            "name": testemunha.nome["_text"],
                            "email": "",
                            "recipientId": recipientId + 2,
                            "recipientIdGuid": "00000000-0000-0000-0000-000000000000",
                            "accessCode": "",
                            "requireIdLookup": "false",
                            "identityVerification": {
                                "inputOptions": [],
                                "workflowLabel": ""
                            },
                            "routingOrder": indexAgent,
                            "note": "",
                            "roleName": testemunha.nome["_text"],
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
                        tabs.initialHereTabs = []
                        tabs.initialHereTabs.push(signer.tabs.initialHereTabs[0])
                        return signer
                    })
                }

                recipients.push(...testemunhas)
                recipients.push(...signers)

                let agent ={
                    "name": el.tipo["_text"] + " - CENTRALIZADOR",
                    "email": el.email["_text"].trim(),
                    recipientId: "6640"+index,
                    "accessCode": "",
                    "requireIdLookup": "false",
                    "routingOrder": indexAgent,
                    "note": "",
                    "roleName": "CENTRALIZADOR",
                    "completedCount": "0",
                    "deliveryMethod": "email",
                    "templateLocked": "false",
                    "templateRequired": "false",
                    "inheritEmailNotificationConfiguration": "false",
                    "recipientType": "agent",
                    "agentCanEditEmail": "true",
                    "agentCanEditName": "true"
                }
                return agent
            })

            template.signers = recipients
            template.agents = agents


            console.log(template.agents)
            await axios.delete(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients`, {
                headers: {
                    'Authorization': this.authToken
                },
                data: {signers:[{'recipientId': '1'}]}
            });
            const resp = await axios.put(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients`, template, {
                headers: {
                    'Authorization': this.authToken
                }
            });
            for (let tab of tabs.signHereTabs) {
                try {
                    // console.log(tab)

                    await axios.post(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients/${tab.recipientId}/tabs`, {
                        signHereTabs: [tab]
                    }, {
                        headers: {
                            'Authorization': this.authToken
                        }
                    });
                    console.log("tab inserida..")
                } catch (error) {
                    console.log("tab nao inserida")
                }
            }
            for (let tab of tabs.initialHereTabs) {
                try {
                    // console.log(tab)

                    await axios.post(`https://na2.docusign.net/restapi/v2/accounts/107905117/envelopes/${envelopeId}/recipients/${tab.recipientId}/tabs`, {
                        initialHereTabs: [tab]
                    }, {
                        headers: {
                            'Authorization': this.authToken
                        }
                    });
                    console.log("tab inserida..")
                } catch (error) {
                    console.log(error)
                }
            }

            return "resp.data"
        } catch (error) {
            console.log(error)
        }
    }

}

export default Bnym