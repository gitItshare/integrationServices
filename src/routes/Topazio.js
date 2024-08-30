import express from 'express';
import topazioService from "../services/topazio/index.js";
import fs, { readFileSync } from "fs"
const router = express.Router();
router.get('/csv', async function(req, res) {
    let periodo = {
        from:new Date("10/10/2017").toISOString(),
        to:new Date().toISOString(),
        offset: 0
    }
   let arrCsv = await topazioService.baixaMassiva.readCsvFile()
   let writable = await fs.createWriteStream(`./uploads/idsCsv.csv`)
    writable.write(`${arrCsv}\n`)
    writable.end()
   console.log(arrCsv)

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
