import express from 'express';
import estrategiaServices from "../services/estrategia/index.js";
import fs, { readFileSync } from "fs"
const router = express.Router();
router.get('/csv', async function(req, res) {
    let periodo = {
        from:new Date("10/10/2017").toISOString(),
        to:new Date().toISOString(),
        offset: 0
    }
   await estrategiaServices.baixaMassiva.makeCsvFile(periodo)
   res.send("ok");
});

router.get('/baixaMassiva', async function(req, res) {
    let periodo = {
        from:new Date("10/10/2017").toISOString(),
        to:new Date().toISOString(),
        offset: 0
    }
    // let resp = await fs.readdirSync(global.appRoot + "/uploads/2272024")
    // let doc = await fs.readFileSync(global.appRoot + "/uploads/IdsEnvelopesDe2017-10-10Ate2024-02-27.csv")
    // doc = doc.toString().split("\n")
    // resp = resp.map(row => row.replace(".pdf", ""))
    // let novoArray = []
    // for(let id of doc) {
    //     console.log(id)
    //     if(resp.includes(id)){
    //     }else{
    //         novoArray.push(id)
    //     }
    // }
    // console.log(novoArray.length)
    // await fs.writeFileSync(global.appRoot + "/uploads/IdsEnvelopesDe2017-10-10Ate2024-02-27TEST.csv", novoArray.join("\n"))

     estrategiaServices.baixaMassiva.start()
   res.send("ok");
});
router.get('/upload', async function(req, res) {

    await estrategiaServices.baixaMassiva.uploadLotes()
   res.send("ok");
});
router.get('/deleteFiles', async function(req, res) {

    const filesUploaded = await readFileSync(`C:/Users/kevin/Documents/projects/integrationServices/uploads/baixados.csv`).toString()
    let arrFiles = filesUploaded.split("\n")
    console.log(arrFiles)
     for(let file of arrFiles){
        try {
            let aUniqueNameHere = "aUniqueNameHere.pdf"
            let namefile = `C:/Users/kevin/Documents/projects/2272024/` + file.replace(".pdf", "")
            // await fs.unlinkSync(`C:/Users/kevin/Documents/projects/2272024/` + file.replace(".pdf", ""))
            if(fs.existsSync(namefile))
                await fs.renameSync(namefile, aUniqueNameHere);
            if(fs.existsSync(`C:/Users/kevin/Documents/projects/2272024/${aUniqueNameHere}`))
                await fs.unlinkSync(`C:/Users/kevin/Documents/projects/2272024/${aUniqueNameHere}`);
            console.log("removi ", file)
        } catch (error) {
            console.log("nao removi", error)
        }   

     }
    res.send("ok");
});

export default router
