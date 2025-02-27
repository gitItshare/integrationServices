import express from 'express';
import topazioService from "../services/topazio/index.js";
import fs, { readFileSync } from "fs"
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


export default router
