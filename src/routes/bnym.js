import express from 'express';
const router = express.Router();
import bnyService from "../services/BNYM/index.js";
import { xml2json } from 'xml-js';
import bodyParser from 'body-parser'
let token = ""

//Middle ware that is specific to this router

// Define the home page route
router.use(bodyParser.text()).post('/templates', async function (req, res) {
  let resp = ""
  console.log(req.body)
  let bodyjson = JSON.parse(req.body)
  let json = bodyjson.Params.replaceAll("'", '"')
  json = JSON.parse(json)
  console.log(json)
  let auth = {
    userID: process.env.clientIDBNY,
    integrationKey: process.env.integratorKeyBny,
    dsOauthServer: process.env.dsOauthServerSafra,
    accountID: process.env.accountIDBny,
    privateKey: process.env.privatekeyBny
  }
  const scope = "signature impersonation spring_read spring_write";
  const bny = new bnyService(auth, scope)
  let xml = bny.makexml(json)
      let {recipients} = JSON.parse(xml2json(xml,{ spaces: 2, compact: true }))
      let agents = []
      agents = Array.isArray(recipients.agents) ? [...recipients.agents] : [recipients.agents]
      let param = agents.map(el => {
        console.log(el.testemunhas)
        let testemunhas = []
        testemunhas = Array.isArray(el.testemunhas) ? [...el.testemunhas] : [el.testemunhas]
        let assinaturas = []
        assinaturas = Array.isArray(el.assinaturas) ? [...el.assinaturas] : [el.assinaturas]

        return {
          tipo: el.tipo,
          email: el.email,
          position: el.position,
          carimbo: el.carimbo,
          testemunhas: testemunhas,
          assinaturas:assinaturas,
          ancora: el.ancora,
          tipoAss: el.tipoAss
        }
      });
      console.log(param)

      await bny.jwt()
      await bny.authenticate()

      await bny.makeTemplate(param, bodyjson.envelopeId) 


  res.send("resp");
});

export default router