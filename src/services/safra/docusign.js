import axios from "axios";
import fs from "fs"
import path from 'path';
import jwt from "../jwt.js"
import querystring from "querystring"
import {
    sign
} from "crypto";

let dirname = path.resolve(path.dirname(''));


class Docusign {
    constructor(docusignCredentials, scope) {
        this.userID = docusignCredentials.userID
        this.integrationKey = docusignCredentials.integrationKey
        this.dsOauthServer = docusignCredentials.dsOauthServer
        this.accountID = docusignCredentials.accountID
        this.privateKey = docusignCredentials.privateKey
        this.scope = scope
        this.authUrl = 'https://account-d.docusign.com/oauth/token?'
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
                "aud": "account-d.docusign.com",
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
    async makeTemplate(params, data) {

        try {
            console.log(this.authToken)
            let testemunhastabs = {
                signHereTabs: []
            }

            let template = {
                "signers": [],
                "carbonCopies": [{
                    "agentCanEditEmail": "false",
                    "agentCanEditName": "false",
                    "name": "BO Contratos",
                    "email": "regcont@safra.com.br",
                    "recipientId": "123",
                    "accessCode": "",
                    "requireIdLookup": "false",
                    "routingOrder": "5",
                    "note": "",
                    "roleName": "BO Contratos",
                    "completedCount": "0",
                    "deliveryMethod": "email",
                    "templateLocked": "false",
                    "templateRequired": "false",
                    "inheritEmailNotificationConfiguration": "false",
                    "recipientType": "carboncopy"
                }],
                agents: []
            }
            let recipients = []
            console.log(params)

            let signers = []
            params.forEach((el, index) => {
                let recipientId = "123" + index
                let signer = {}
                if (el.tipoAss["_text"] != "validador") {
                    signer = {
                        "defaultRecipient": "false",
                        "signInEachLocation": "false",
                        "recipientSignatureProviders": [{
                            "sealDocumentsWithTabsOnly": "false",
                            "signatureProviderName": "universalsignaturepen_imageonly",
                            "signatureProviderOptions": {}
                        }],
                        "tabs": {
                            "signHereTabs": [{
                                "stampType": "signature",
                                "name": "SignHere",
                                "tabLabel": "Assinatura cfde0f5e-01fe-44f1-b9d7-994352857a80",
                                "scaleValue": "1",
                                "optional": "false",
                                "documentId": "1",
                                "recipientId": recipientId,
                                "pageNumber": "1",
                                "xPosition": "",
                                "yPosition": "",
                                "anchorString": "\\" + el.tag["_text"] + "\\",
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
                            }]
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
                        "roleName": el.role["_text"],
                        "deliveryMethod": "email",
                        "templateLocked": "false",
                        "templateRequired": "false",
                        "inheritEmailNotificationConfiguration": "false"
                    }
                    if (el.tag["_text"] == "sign_RC1") {

                        if(data.seguroPrestamista["_text"] == "Sim"){
                            testemunhastabs.radioGroupTabs = [{
                                "radios": [{
                                        "pageNumber": "sample string 1",
                                        "xPosition": "",
                                        "yPosition": "",
                                        "anchorString": "\\sign_RC1Radio1\\",
                                        "anchorXOffset": "",
                                        "anchorYOffset": "",
                                        "value": "true",
                                        "selected": "true",
                                        "required": "true"
                                    },
                                    {
                                        "pageNumber": "sample string 1",
                                        "xPosition": "",
                                        "yPosition": "",
                                        "anchorString": "\\sign_RC1Radio2\\",
                                        "anchorXOffset": "",
                                        "anchorYOffset": "",
                                        "value": "false",
                                        "selected": "false",
                                        "required": "true"
                                    }
                                ],
                                "shared": "false",
                                "tooltip": "sample string 11",
                                "recipientId": recipientId,
                            }]
                            testemunhastabs.checkboxTabs = [{
                                    "name": "check1",
                                    "recipientId": recipientId,
                                    "anchorString": "\\sign_RC1Check1\\",
                                    "tabOrder": "1",
                                    "tabGroupLabels": [
                                        "sample string 1"
                                    ]
                                },
                                {
                                    "name": "check2",
                                    "recipientId": recipientId,
                                    "anchorString": "\\sign_RC1Check2\\",
                                    "tabOrder": "2",
                                    "tabGroupLabels": [
                                        "sample string 1"
                                    ]
                                }
                            ]
                        }

                    }
                    if (el.tipoAss["_text"] == "ICP") {
                        signer.recipientSignatureProviders = [{
                            "sealDocumentsWithTabsOnly": "false",
                            "signatureProviderName": "universalsignaturepen_icp_smartcard_tsp",
                            "signatureProviderOptions": {
                                "cpfNumber": el.cpf["_text"],
                                "signerRole": ""
                            }
                        }]
                    }

                    if (el.tipoAss["_text"] == "BIOMETRIA") {
                        signer.clientUserId = el.cpf["_text"]
                        signer.embeddedRecipientStartURL = `https://portalspa-hml.safra.com.br/dcs/identification?envelopeId=0f153270-9036-4381-ba6f-9de77e00f5d0&recipientId=${recipientId}`
                    }
                    signers.push(signer)
                    // testemunhastabs.signHereTabs.push(signer.tabs.signHereTabs[0])
                } else {
                    signer = {
                        "defaultRecipient": "false",
                        "signInEachLocation": "false",
                        "tabs": {
                            "approveTabs": [{
                                "buttonText": "Approve",
                                "tabLabel": "Approve 23167709-51a6-4753-b3ae-5ff522747962",
                                "font": "helvetica",
                                "fontColor": "black",
                                "fontSize": "size9",
                                "localePolicy": {},
                                "documentId": "83374671",
                                "recipientId": recipientId,
                                "pageNumber": "1",
                                "xPosition": "",
                                "yPosition": "",
                                "width": "70",
                                "height": "22",
                                "anchorString": "/validadorA/",
                                "anchorXOffset": "0",
                                "anchorYOffset": "0",
                                "anchorUnits": "pixels",
                                "anchorCaseSensitive": "false",
                                "anchorMatchWholeWord": "true",
                                "anchorHorizontalAlignment": "left",
                                "anchorTabProcessorVersion": "v1_3",
                                "tabId": "955bc722-9a2f-4b1b-a72b-c2f16f777b33",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "tabType": "approve"
                            }],
                            "declineTabs": [{
                                "buttonText": "Decline",
                                "declineReason": "",
                                "tabLabel": "Decline 7da7a2eb-44bc-46f1-b283-b6d719441441",
                                "font": "helvetica",
                                "fontColor": "black",
                                "fontSize": "size9",
                                "localePolicy": {},
                                "documentId": "83374671",
                                "recipientId": recipientId,
                                "pageNumber": "2",
                                "xPosition": "",
                                "yPosition": "",
                                "width": "70",
                                "height": "22",
                                "anchorString": "/validadorD/",
                                "anchorXOffset": "0",
                                "anchorYOffset": "0",
                                "anchorUnits": "pixels",
                                "anchorCaseSensitive": "false",
                                "anchorMatchWholeWord": "true",
                                "anchorHorizontalAlignment": "left",
                                "anchorTabProcessorVersion": "v1_3",
                                "tabId": "248ddb9d-8dc7-4be4-a576-e840bbbca86a",
                                "templateLocked": "false",
                                "templateRequired": "false",
                                "tabType": "decline"
                            }]
                        },
                        "agentCanEditEmail": "false",
                        "agentCanEditName": "false",
                        "name": el.nome["_text"],
                        "email": el.email["_text"],
                        "recipientId": recipientId,
                        "accessCode": "",
                        "requireIdLookup": "false",
                        "identityVerification": {
                            "inputOptions": [],
                            "workflowLabel": ""
                        },
                        "routingOrder": "3",
                        "note": "",
                        "roleName": el.role["_text"],
                        "deliveryMethod": "email",
                        "templateLocked": "false",
                        "templateRequired": "false",
                        "inheritEmailNotificationConfiguration": "false"
                    }
                    signers.push(signer)
                    testemunhastabs.approveTabs = []
                    testemunhastabs.approveTabs.push(signer.tabs.approveTabs[0])
                    testemunhastabs.declineTabs = []
                    testemunhastabs.declineTabs.push(signer.tabs.declineTabs[0])
                }
            })


            const uniques = signers.filter((obj, index) => {
                return index === signers.findIndex(o => obj.email === o.email);
            });

            uniques.forEach((unique, index) => {
                let signHereTabs = []
                signers.forEach(signer => {
                    if (signer.email == unique.email && signer.tabs.signHereTabs) {
                        console.log("TABS", signer.tabs.signHereTabs[0])
                        // // signer.tabs.signHereTabs[0].recipientId = unique.recipientId
                        // uniques[index].tabs.signHereTabs.push(signer.tabs.signHereTabs[0])
                        signer.tabs.signHereTabs[0].recipientId = unique.recipientId
                        signHereTabs.push(signer.tabs.signHereTabs[0])
                    }
                })
                if (unique.tabs.signHereTabs)
                    unique.tabs.signHereTabs = signHereTabs
            })

            template.signers = uniques

            testemunhastabs.signHereTabs = uniques.map(el => el.tabs.signHereTabs)
            console.log(uniques)
            const templateSigners = await axios.get(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients`, {
                headers: {
                    'Authorization': this.authToken
                }
            });
            const recipient = templateSigners.data
            console.log("OPOORA", testemunhastabs)
            if (templateSigners.data.signers.length > 0)
                await axios.delete(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients`, {
                    headers: {
                        'Authorization': this.authToken
                    },
                    data: recipient
                });
            const resp = await axios.put(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients`, template, {
                headers: {
                    'Authorization': this.authToken
                }
            });

            for (let tab of testemunhastabs.signHereTabs) {
                try {
                    console.log(tab)
                    if (tab) {
                        await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients/${tab[0].recipientId}/tabs`, {
                            signHereTabs: tab
                        }, {
                            headers: {
                                'Authorization': this.authToken
                            }
                        });
                        console.log("tab inserida..")
                    }


                } catch (error) {
                    console.log("tab nao inserida")
                }
            }

            for (let tab of testemunhastabs.approveTabs) {
                try {
                    console.log(tab)

                    await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients/${tab.recipientId}/tabs`, {
                        approveTabs: [tab]
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
            for (let tab of testemunhastabs.declineTabs) {
                try {
                    console.log(tab)

                    await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients/${tab.recipientId}/tabs`, {
                        declineTabs: [tab]
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
            if(data.seguroPrestamista["_text"] == "Sim"){
                for (let tab of testemunhastabs.radioGroupTabs) {
                    try {
                        console.log(tab)
    
                        await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients/${tab.recipientId}/tabs`, {
                            radioGroupTabs: [tab]
                        }, {
                            headers: {
                                'Authorization': this.authToken
                            }
                        });
                        console.log("tab inserida..")
                    } catch (error) {
                        console.log(error)
    
                        console.log("tab nao inserida")
                    }
                }
                for (let tab of testemunhastabs.checkboxTabs) {
                    try {
                        console.log(tab)
    
                        await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/recipients/${tab.recipientId}/tabs`, {
                            checkboxTabs: [tab]
                        }, {
                            headers: {
                                'Authorization': this.authToken
                            }
                        });
                        console.log("tab inserida..")
                    } catch (error) {
                        console.log(error)
    
                        console.log("tab nao inserida")
                    }
                }
            }

            let custom_fields = {
                textCustomFields: [{
                "fieldId": "1",
                "name": "Agência",
                "show": "true",
                "required": "false",
                "value": data.agencia["_text"]
            },
            {
                "fieldId": "2",
                "name": "Nome cliente",
                "show": "true",
                "required": "false",
                "value": data.nomeCli["_text"]
            },
            {
                "fieldId": "3",
                "name": "CNPJ cliente",
                "show": "true",
                "required": "false",
                "value": data.cnpjCli["_text"]
            },
            {
                "fieldId": "4",
                "name": "Num contrato",
                "show": "true",
                "required": "false",
                "value": data.numContrato["_text"]
            }]}
            await axios.post(`https://demo.docusign.net/restapi/v2/accounts/20465950/templates/0f153270-9036-4381-ba6f-9de77e00f5d0/custom_fields`, custom_fields,
            {
                headers: {
                    'Authorization': this.authToken
                }
            });
            return "resp"
        } catch (error) {
            console.log(error)
        }
    }
}

export default Docusign