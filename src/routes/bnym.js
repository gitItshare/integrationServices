import express from 'express';
const router = express.Router();
import bnyService from "../services/BNYM/index.js";
import { xml2json } from 'xml-js';
import bodyParser from 'body-parser'
let token = ""

//Middle ware that is specific to this router

// Define the home page route
router.post('/templates', function (req, res) {
  let resp = ""
  let json = req.body.Params.replaceAll("'", '"')
  json = JSON.parse(json)
  let auth = {
    userID: process.env.clientIDBNY,
    integrationKey: process.env.integratorKeyBny,
    dsOauthServer: process.env.dsOauthServerBny,
    accountID: process.env.accountIDBny,
    privateKey: process.env.privatekeyBny
  }
  const scope = "signature impersonation";
  const bny = new bnyService(auth, scope)
  let xml = bny.makexml(json)
      let {recipients} = JSON.parse(xml2json(xml,  { spaces: 2, compact: true }))
      let agents = []
      agents = Array.isArray(recipients.agents) ? [...recipients.agents] : [recipients.agents]
      let param = agents.map(el => {
        let testemunhas = []
        testemunhas = Array.isArray(el.testemunhas) ? [...el.testemunhas] : [el.testemunhas]
        let assinaturas = []
        assinaturas = Array.isArray(el.assinaturas) ? [...el.assinaturas] : [el.assinaturas]

        return {
          nome: el.nome,
          email: el.email,
          role: el.role,
          position: el.position,
          carimbo: el.carimbo,
          testemunhas: testemunhas,
          assinaturas:assinaturas,
          ancora: el.ancora,
          tipoAss: el.tipoAss,
          order: el.order
        }
      });

       bny.jwt().then(resp => {
        bny.authenticate().then(resp => {
          bny.makeTemplate(param, req.body.envelopeId).then(resp => {
            res.status(200).send({msg: "OK"})

          })
        })
       })


});
// https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=bba97b1a-65fc-4e70-99ef-2fb268137beb&redirect_uri=https://www.bnymellon.com/br/pt.html
export default router