import express from 'express';
import ExtracaoMassiva from "../services/Highstill/baixaMassiva.js";
import fs, { readFileSync } from "fs"
import dotenv from "dotenv"
import pdf from 'pdf-parse';
import nlp from 'compromise';
import nlpDates from 'compromise-dates';
import { lerPDFsDaPasta, extrairTextoPDF, enviarParaOpenAI } from "../services/Highstill/extracaoDadosPdf.js";
import Docusign from '../services/Docusign/index.js';
import csv from '../utils/csv.js';
nlp.extend(nlpDates);
dotenv.config()
const router = express.Router();
const credentials = {
    userID: process.env.userHighStill,
    integrationKey: process.env.integrationKeyHighStill,
    privateKey: process.env.keyHighStill,
    dsOauthServer: "account.docusign.com",
    accountID: process.env.apiHighStill,
}
// https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation%20spring_read%20spring_write%20api&client_id=0386f217-ae81-4789-bf5c-1b88e2ba6fc8&redirect_uri=https://apps-d.docusign.com/
const extracaoMassiva = new ExtracaoMassiva(credentials)

router.get('/csv', async function(req, res) {
    console.log("CREDENDIAYS", credentials)
    let periodo = {
        from:new Date("10/10/2017").toISOString(),
        to:new Date().toISOString(),
        offset: 0
    }

    await extracaoMassiva.makeCsvFile(periodo, "Highstil")
    
   res.send("ok");
});
router.get('/pdf', async function(req, res) {

const buffer = fs.readFileSync('./uploads/20250403/HighstilIdsEnvelopesDe2017-10-10Ate2025-04-10.pdf');
console.log(buffer)
pdf(buffer).then(data => {
    const texto = data.text;

    const doc = nlp(texto);

    const datas = doc.dates().out('array');

    const valores = texto.match(/R\$ ?[\d\.]+,\d{2}/g);

    const nomes = doc.people().out('array');

    console.log('Datas encontradas:', datas);
    console.log('Valores encontrados:', valores);
    console.log('Nomes encontrados:', nomes);

    const cnpj = texto.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/);
    console.log('CNPJ:', cnpj ? cnpj[0] : 'Não encontrado');
    res.json({ datas, valores, nomes, cnpj });
});

});
router.get('/baixaMassiva', async function(req, res) {
    let periodo = {
        from:new Date("10/10/2017").toISOString(),
        to:new Date().toISOString(),
        offset: 0
    }
     extracaoMassiva.start("HighstilIdsEnvelopesDe2017-10-10Ate2025-04-17.csv")
   res.send("ok");
});
router.get('/upload', async function(req, res) {

    await extracaoMassiva.uploadLotes()
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

router.get('/gpt', async function(req, res) {

    lerPDFsDaPasta("./uploads/20250417/").then(resultado => {
        console.log(resultado);
    });
    res.json("ok");
});

router.get('/filter', async function(req, res) {
    const pdfsBaixados = await readFileSync(`./uploads/envelopesHighStil2.csv`).toString();
    let arrbaixados = pdfsBaixados.split("\n");

    // Remove duplicates while keeping the entire row
    const uniqueRows = [...new Map(arrbaixados.map(row => [row.split(";")[10], row])).values()];
    console.log(uniqueRows);

    const writable = await fs.createWriteStream(`${global.appRoot}/uploads/filtrados.csv`, {
        flags: 'a'
    });

    // Write unique rows to the file
    uniqueRows.forEach((row) => writable.write(`${row}\n`));

    res.send("ok");

})

router.get('/transform', async function(req, res) {
    const json = await readFileSync(`C:/Users/User/Documents/projects/integrationServices/uploads/envelopesHighStil2.json`).toString();
    const writable = await fs.createWriteStream(`${global.appRoot}/uploads/envelopesHighStil2.csv`, {
        flags: 'a'
    });
    writable.write("tipoDocumento;valorcontrato;valormulta;vigência_inicio;vigência_fim;data_rescisao;contraparteCNPJ;parteCNPJ;razaoSocialParte;razaoSocialContraparte;local;idEnvelope\n");
    const json2 = JSON.parse(json);
    console.log(json2);
    let array = [];
    json2.forEach((el, index) => {
        const valorcontrato = el.valorcontrato ? el.valorcontrato : "---";
        const valormulta = el.valormulta ? el.valormulta : "---";
        const local = el.local ? el.local : "---";
        const tipoDocumento = el.tipoDocumento ? el.tipoDocumento : "---";
        const vigencia_fim = el["vigência_fim"] ? el["vigência_fim"]: "---";
        const data_rescisao = el.data_rescisao ? el.data_rescisao : "---";
        const contraparteCNPJ = el.contraparteCNPJ ? el.contraparteCNPJ : "--";
        const parteCNPJ = el.parteCNPJ ? el.parteCNPJ : "---";
        const razaoSocialParte = el.razaoSocialParte ? el.razaoSocialParte : "---";
        const razaoSocialContraparte = el.razaoSocialContraparte ? el.razaoSocialContraparte : "---";
        const vigencia_inicio = el["vigência_inicio"] ? el["vigência_inicio"] : "---";
        let csvstring = "";
        csvstring += tipoDocumento + ";";
        csvstring += valorcontrato + ";";
        csvstring += valormulta + ";";
        csvstring += vigencia_inicio + ";";
        csvstring += vigencia_fim + ";";
        csvstring += data_rescisao + ";";
        csvstring += contraparteCNPJ + ";";
        csvstring += parteCNPJ + ";";
        csvstring += razaoSocialParte + ";";
        csvstring += razaoSocialContraparte + ";";
        csvstring += local + ";";
        csvstring += el.idEnvelope + "\n";
        writable.write(csvstring);
    });

    res.send("ok");
});
export default router
