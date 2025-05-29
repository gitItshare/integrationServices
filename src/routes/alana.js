import express from 'express';
import topazioService from "../services/topazio/index.js";
import fs, { readFileSync } from "fs"
import Docusign from '../services/Docusign/index.js';
const router = express.Router();
router.get('/csv', async function(req, res) {

   let {xml, csv} = await topazioService.baixaMassiva.readCsvFile()
   let writable = await fs.createWriteStream(`./uploads/idsCsv.csv`)
    writable.write(`${csv}\n`)
    writable.end()
    writable = await fs.createWriteStream(`./uploads/idsCsv.xml`)
    writable.write(`${xml}\n`)
    writable.end()
   res.send("ok");
});

router.get('/baixaMassiva', async function(req, res) {
 
    topazioService.baixaMassiva.start()
    res.send("ok");
});
router.get('/upload', async function(req, res) {

    await topazioService.baixaMassiva.uploadLotes()
   res.send("ok");
});

router.get('/test', async function(req, res) {
    const credentials = {
    userID: process.env.alanaUser || "",
    integrationKey: process.env.alanaIK || "",
    privateKey: process.env.alanaPk || "",
    dsOauthServer: process.env.alanaDsServer || "",
    accountID:  process.env.alanaAccount || "",
}
const scope = "signature impersonation spring_read spring_write api";
 const docusign = new Docusign(credentials, scope);

    try {
        await docusign.jwt();
        await docusign.authenticate();
        const periodo = {
            from: "2025-01-01T00:00:00Z",
            to: "2025-03-31T23:59:59Z",
            start_position: 0,
            totalSetSize: 1000
        }
        for(let i = 0; i < 20; i++) {
        await docusign.getEnvelopeIds(periodo)
        }
        res.send("ok");
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).send('Error fetching document');
    }
})

export default router
