import jwt from "../jwt.js"
import fs from 'fs'
import querystring from 'querystring';
import axios from "axios";
import { Blob } from "buffer";

import fetch, {
    Headers
} from 'node-fetch'
import {
    pipeline
} from 'node:stream';
import {
    promisify
} from 'node:util'
import { json } from "node:stream/consumers";

//new Date("03-01-2022").toISOString()

class Docusign {

    constructor(docusignCredentials, scope) {
        this.userID = docusignCredentials.userID
        this.integrationKey = docusignCredentials.integrationKey
        this.dsOauthServer = docusignCredentials.dsOauthServer || "account.docusign.com"
        this.accountID = docusignCredentials.accountID
        this.privateKey = docusignCredentials.privateKey
        this.scope = scope
        this.agent = null
        this.apiURL = "https://na2.docusign.net/restapi/v2.1/accounts/"
        this.arrayPromiseWriteFile = []
        this.stringCsv = ""
        this.stringErroCsv = ""
    }

    async jwt() {
        try {
            const iat = Math.floor(+new Date() / 1000);
            const exp = Math.floor((+new Date() / 1000) + 16000);
            const payload = {
                "iss": this.integrationKey,
                "sub": this.userID,
                "aud": this.dsOauthServer,
                "exp": exp,
                "iat": iat,
                "scope": this.scope
            }
            const JWT = new jwt(payload, this.privateKey)
            const token = await JWT.getToken();
            this.jwtToken = token
            console.log(payload)

            console.log(token)
        } catch (error) {
            console.log(error)
            this.jwtToken = ''
        }
    }
    promisefyPipe(data, writer) {
        return new Promise((resolve, reject) => {
            try {
                data.pipe(writer)
                writer.on("finish", () => {
                    resolve("done")
                })
            } catch (err) {
                reject(err)
            }
        })
    }
    async getToken() {
        return this.authToken
    }
    async authenticate() {
        let response
        try {
            let queryData = querystring.stringify({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: this.jwtToken,
            });
            const resp = await fetch(`https://${this.dsOauthServer}/oauth/token`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: queryData,
                agent: this.agent,
            });
            let data = await resp.json();

            this.authToken = "Bearer " + data.access_token
            console.log("AUTH resp", data)

            console.log("teste auth", this.authToken)
        } catch (error) {
            console.log(error)
            this.authToken = 'error'
        }
    }

    async getEnvelopeDocuments(idDocumento, folder) {
        return new Promise(async (resolve, reject) => {
            try {   
                let url = `${this.apiURL}${this.accountID}/envelopes/${idDocumento}/documents/combined`
                const meta = {
                    'Authorization': this.authToken,
                };
                const headers = new Headers(meta);
                const response = await fetch(url, {
                    method: 'get',
                    agent: this.agent,
                    headers: headers
                });
                if (!response.ok) throw new Error(`unexpected response ${response.statusText}, \n na url: ${url} `);
                const streamPipeline = promisify(pipeline);
                console.log("response", response.body)
                this.arrayPromiseWriteFile.push(streamPipeline(response.body, fs.createWriteStream(`${global.appRoot +"/uploads/"}${folder}/${idDocumento}.pdf`)));

                this.burstLimit = response.headers["x-burstlimit-remaining"]
                if (this.burstLimit == "0")
                    throw new Error("burstLimitExecedido")
                // await this.getEnvelopeFormData(idDocumento)
                resolve("true")
            } catch (error) {
                console.log("Deu erro0", error)
                this.stringErroCsv += "x,x,x," + idDocumento + "\n"
                this.contadorErros++
                reject(error)
            }
        })
    }
    async writeFiles() {
        await Promise.all(this.arrayPromiseWriteFile).catch(err => {
            console.log(err)
        })
        this.arrayPromiseWriteFile = []
    }
    getStringCsv(){
        let string = this.stringCsv
        return string
    }
    getStringErroCsv(){
        let string = this.stringErroCsv
        return string
    }
    resetStringCsv(){
        this.stringCsv =""
    }
    resetStringErroCsv(){
        this.stringErroCsv = ""
    }
    async getEnvelopeIds(periodo, count = 10000) {
        try {
            let url = `${this.apiURL}${this.accountID}/envelopes?from_date=${periodo.from}&to_date=${periodo.to}&start_position=${periodo.start_position}&count=${count}&status=completed&include=custom_fields,recipients`
            const meta = {
                'Authorization': this.authToken,
            };
            console.log("AUTH ", this.authToken)
            const resp = await axios.get(url, {
                headers: meta
            })
            const data = resp.data
            console.log(data)
            // const resp = await instace.get(url)
            // this.burstLimit = resp.headers["x-burstlimit-remaining"]
            // const data = resp.data
            return {
                totalSetSize: data.totalSetSize,
                envelopes: data.envelopes,
                start_position: data.start_position,
                end_position: data.end_position
            }
        } catch (error) {
            console.log("error")
            // throw new Error(error);
        }
    }
    async getEnvelopeTemplates(envelopeId) {
        try {
            let url = `${this.apiURL}${this.accountID}/envelopes/${envelopeId}/templates`
            const meta = {
                'Authorization': this.authToken,
            };
            console.log("AUTH ", this.authToken)
            const resp = await axios.get(url, {
                headers: meta
            })
            const data = resp.data
            console.log("TEMPLATES", data)
            // const resp = await instace.get(url)
            // this.burstLimit = resp.headers["x-burstlimit-remaining"]
            // const data = resp.data
            return data
        } catch (error) {
            console.log("error")
            // throw new Error(error);
        }
    }
    async getEnvelopeFormData(idDocumento) {
        let response
        try {
            let url = `${this.apiURL}${this.accountID}/envelopes/${idDocumento}/form_data`
            const meta = {
                'Content-Type': 'application/json',
                'Authorization': this.authToken,
                'Accept': 'application/json',
            };
            const headers = new Headers(meta);
            const resp = await fetch(url, {
                method: 'get',
                agent: this.agent,
                headers,
            });
            let data = await resp.json();
            console.log("FORMDATAAAAA ", data, idDocumento)

            this.burstLimit = resp.headers["x-burstlimit-remaining"]
            let arraycampos = ["accredited", "contractNumber", "headerState", "technicianLogin", "county"]
            arraycampos = ["accredited", "contractNumber", "headerState", "technicianLogin", "county"]
            let linhaDoc = ""
  
            linhaDoc += data.sentDateTime + ";"
            linhaDoc += data.envelopeId + ";"
            linhaDoc += data.envelopeId + ".pdf" + "\n"
            return linhaDoc
        } catch (error) {
            this.stringErroCsv += "x,x,x," + idDocumento + "\n"
            console.log(error)
            return ""
            //this.burstLimit = error.response.headers["x-burstlimit-remaining"]
        }
    }
    async updateDocumentCLM(data,ds_account_id,folder_id) {
        return new Promise(async(resolve, reject) => {
            try {
                const form = new FormData();
                let buffer = fs.readFileSync(data.pathToFile);
                let blob = new Blob([buffer]);
                console.log("blob", buffer)
                form.set("file", blob, data.name);
                console.log("uploaded...", data.name)
                let baixados = await fs.createWriteStream(`${global.appRoot +"/uploads/"}/baixados.csv`, {
                    flags: 'a' 
                })
                const resp = await axios({
                    method: 'post',
                    url: `https://apiuploadna11.springcm.com/v2/${ds_account_id}/folders/${folder_id}/documents?name=TESTPDF.pdf`,
                    data: form,
                    headers: {
                        'Content-Type': `multipart/form-data`,
                        'Authorization': this.authToken
                    }
                })
                baixados.write(data.name+"\n")
                baixados.end()
                resolve(resp)
            } catch (error) {
                let fails = await fs.createWriteStream(`${global.appRoot +"/uploads/"}/errosUpload.csv`, {
                    flags: 'a' 
                })
                console.log(error.response.data)
                fails.write(data.name+"\n")
                fails.end()
                reject("err")
            }
        })

    }
    async pathAtributes(idEnvelope, accountId, jsonAttributes) {

        // const json = jsonAttributes.find((item) => item.envelopeId == envelopeId)

        const resp = await axios("https://apiuatna11.springcm.com/v2/" + accountId + "/documents/" + idEnvelope, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authToken
            },
            data: jsonAttributes
        })
        .catch(error => {
            console.log(error.response.data)
        })
        console.log("resp", resp, jsonAttributes, idEnvelope)
    }
    async startWorkflow(name, params) {
        const resp = await axios(`https://apiuatna11.springcm.com/v2/${this.accountID}/workflows`, {
            method: 'POST',
            data: {
                "Name": name,
                "Params": params
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authToken
            }
        })
        .catch(error => {
            console.log(error)
        })
        console.log("resp", resp)
        return resp
    }
}
export default Docusign