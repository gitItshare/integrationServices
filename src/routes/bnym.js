import express from 'express';
const router = express.Router();
import bnyService from "../services/BNYM/index.js";
import { xml2json } from 'xml-js';
import bodyParser from 'body-parser'
let token = ""

//Middle ware that is specific to this router

// Define the home page route
router.post('/templates', function (req, res) {
  let auth = {
    userID: process.env.clientIDBNY,
    integrationKey: process.env.integratorKeyBny,
    dsOauthServer: process.env.dsOauthServerBny,
    accountID: process.env.accountIDBny,
    privateKey: process.env.privatekeyBny
  }
  const scope = "signature impersonation";
  const bny = new bnyService(auth, scope)
  let json = req.body.Params.replaceAll("'", '"')
  const assunto = req.body.assunto || ""
  json = JSON.parse(json)
  console.log(json)
  bny.jwt().then(resp => {
  bny.authenticate().then(resp => {
    bny.makeTemplate(req.body.Params, req.body.envelopeId, json.tipo, assunto).then(resp => {
      res.status(200).send({msg: "OK"})
    })
  })
  })


});
// https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=bba97b1a-65fc-4e70-99ef-2fb268137beb&redirect_uri=https://www.bnymellon.com/br/pt.html
export default router