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
        ancora: el.ancora
      }
    });
    console.log(param)
    //https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation%20spring_read%20spring_write&client_id=d2c169da-974c-40c5-ae3d-b3b47b029391&redirect_uri=http://localhost:3000/
    let auth = {
    userID: process.env.clientIDBNY,
    integrationKey: process.env.integratorKeyBny,
    dsOauthServer: process.env.dsOauthServerSafra,
    accountID: process.env.accountIDBny,
    privateKey: process.env.privatekeyBny
}
  const scope = "signature impersonation spring_read spring_write";
    const bny = new bnyService (auth, scope)
    await bny.jwt()
    await bny.authenticate()

    await bny.makeTemplate(param) 

    
    res.send("resp");
});

export default router