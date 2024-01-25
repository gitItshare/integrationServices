import express from 'express';
const router = express.Router();
import bnyService from "../services/BNYM/index.js";
import { xml2json } from 'xml-js';

let token = ""

//Middle ware that is specific to this router

// Define the home page route
router.post('/templates',async function(req, res) {
  let resp = ""
    console.log(req.body)
    let {recipients} = JSON.parse(xml2json(req.body.Params,  { spaces: 2, compact: true }))
    let param = recipients.agents.map(el => {
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
        assinaturas:assinaturas
      }
    });
    console.log(param)

  //https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation%20spring_read%20spring_write&client_id=bba97b1a-65fc-4e70-99ef-2fb268137beb&redirect_uri=https://www.bnymellon.com/br/pt.html
  let auth = {
    userID: process.env.userIDSafra,
    integrationKey: process.env.integrationKeySafra,
    dsOauthServer: process.env.dsOauthServerSafra,
    accountID: process.env.accountIDSafra,
    privateKey: process.env.privatekeyDemo
}
  const scope = "signature impersonation spring_read spring_write";
    const bny = new bnyService (auth, scope)
    await bny.jwt()
    await bny.authenticate()
    resp = await bny.makeTemplate(param)
  res.send('templates');
});

export default router