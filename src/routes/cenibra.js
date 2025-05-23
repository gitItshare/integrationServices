import express from 'express';
import fs, { readFileSync } from "fs"
import Docusign from '../services/Docusign/index.js';
const credentials = {
    userID: "b511a95c-da29-4a20-9aa2-ec58754b3e69",
    integrationKey: "8240cf32-4824-4c6b-b2e1-80df3116b1be",
    privateKey: process.env.cenibraKEY,
    dsOauthServer: "account-d.docusign.com",           
    accountID: "apiEstrategia",
}
const router = express.Router();

router.get('/', async function(req, res) {
    const docusign = new Docusign(credentials, "signature impersonation spring_read spring_write")
    await docusign.jwt()
    await docusign.authenticate()
   res.send("ok");
});


export default router
