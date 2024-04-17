import Docusign from "../esignature/index.js";
import Csv from "./utils/csv.js";
import fs from "fs";


class ExtracaoMassiva {
    constructor() {
        this.fileName
        this.folder
        this.dayOfWeek
        this.errorLogger
        this.logger
        this.limite
        this.nameFile
    }
    async authentication() {
        const credentials = {
            userID: process.env.userProd || "",
            integrationKey: process.env.estrategiaIK || "",
            privateKey: process.env.estrategiaKey || "",
            dsOauthServer: process.env.dsOauthServer || "",
            accountID: process.env.estrategiaaccountID || "",
        }
        const scope = "signature impersonation spring_read spring_write";
        const docusign = new Docusign(credentials, scope);
        await docusign.jwt();
        await docusign.authenticate();
        return docusign
    }
    downloader(grupo, arrayPromises, docusign) {
        return new Promise((resolve, reject) => {
            let idDocumento;
            try {
                setTimeout(async () => {
                    let date = new Date()
                    if (date.getMinutes() > 55) {
                        await docusign.jwt();
                        await docusign.authenticate();
                    }
                    for (let idDoc of grupo) {
                        if (idDoc) {
                            idDocumento = idDoc;
                            arrayPromises.push(
                                docusign
                                .getEnvelopeDocuments(idDoc, this.folder)
                            );
                        }
                    }
                    await Promise.all(arrayPromises).catch(err => {
                        console.log(err)
                    })
                    console.log("LOTE FINALIZADO")
                    resolve(true);
                }, 35000);
            } catch (error) {
                console.log(error)
                reject(false);
            }
        });
    }
    async runner(splitedArray, docusign) {
        try {
            for (let grupo of splitedArray) {
                let arrayPromises = [];

                this.logger = await fs.createWriteStream(`${global.appRoot +"/uploads/"}${this.folder}/${this.fileName}.csv`, {
                    flags: 'a' // 'a' means appending (old data will be preserved)
                })

                this.errorLogger = await fs.createWriteStream(`${global.appRoot +"/uploads/"}Errorlog/Erros${this.fileName}.csv`, {
                    flags: 'a'
                })
     
                console.log("CHAMANDO DOWNLOADER")
                await this.downloader(grupo, arrayPromises, docusign)
                const stringcsv = docusign.getStringCsv()
                this.errorLogger.write(docusign.getStringErroCsv())
                this.errorLogger.end()
                this.logger.write(stringcsv)
                this.logger.end()
                docusign.resetStringCsv()
                docusign.resetStringErroCsv()
                arrayPromises = [];
            }
            return {
                baixados: docusign.contadorSucessos,
                falhas: docusign.contadorErros,
                carga: Csv.qtdLote
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async getMaxPeriod(docusign,periodo, notCalcPeriod=false){

        let limite = process.env.totalBaixaIds||"50000"
        this.limite = parseInt(limite)
        console.log("LIMITE: ", this.limite)

        periodo.start_position=0
        console.log("TESTE PERIODO", periodo)
        let response = await docusign.getEnvelopeIds(periodo,1)
        console.log("TESTE akii", response)
        let totalSetSize = parseInt(response.totalSetSize)
        let lastDayTo = periodo.to
        let fristDayFrom = periodo.from
        let totalSetSizeCorrigido = totalSetSize
        if(notCalcPeriod){
          return {
            from: fristDayFrom,
            to: lastDayTo,
            start_position:0,
            totalSetSize: totalSetSizeCorrigido
          }
        }
        while(totalSetSize < this.limite){
          periodo.from = periodo.to
          let date = new Date(periodo.to)
          let to = date.setDate(date.getDate() + 1);
          periodo.to = new Date(to).toISOString()
          console.log("totalSetSize", totalSetSize, new Date(to))
          lastDayTo = periodo.to
          let response = await docusign.getEnvelopeIds(periodo)
          totalSetSize += parseInt(response.totalSetSize)
  
          if(totalSetSize > this.limite){
            let lastDate = new Date(periodo.to)
            let to = lastDate.setDate(lastDate.getDate() - 1);
            periodo.to = new Date(to).toISOString()
            lastDayTo = periodo.to
            totalSetSizeCorrigido = totalSetSize - parseInt(response.totalSetSize)
          }
        }
        return {
          from: fristDayFrom,
          to: lastDayTo,
          start_position:0,
          totalSetSize: totalSetSizeCorrigido
        }
    }
    async makeInputCsv(periodo) {
        try {
            let textFrom = periodo.from.split("T")[0]
            let textTo = periodo.to.split("T")[0]
            let nameFile = `IdsEnvelopesDe${textFrom}Ate${textTo}.csv`
            this.nameFile = nameFile
            await fs.writeFileSync(`${global.appRoot}/uploads/${nameFile}`, "")
            let docusign = await this.authentication()
            let maxPeriod = await this.getMaxPeriod(docusign,periodo,true)

            console.log("AQUII", maxPeriod)
            let start_position = 0
            let csvString = ""
            let writable = await fs.createWriteStream(`${global.appRoot}/uploads/${nameFile}`, {
                flags: 'a'
            })
            while (start_position < maxPeriod.totalSetSize) {
                console.log("PERIODO", maxPeriod)
                let date = new Date()
                if (date.getMinutes() > 55) {
                    await docusign.jwt();
                    await docusign.authenticate();
                }
                let response = await docusign.getEnvelopeIds(maxPeriod)
                if (response.envelopes) {
                    response.envelopes.forEach(el => {

                        csvString += el.envelopeId + "\n";
                    })
                    writable.write(csvString);
                    start_position += response.envelopes.length
                }
                console.log("Writing...", maxPeriod.totalSetSize, "Position: ", start_position)
                csvString = ""
                maxPeriod.start_position = start_position
            }
            console.log(maxPeriod)
            maxPeriod.namefile = nameFile
            return maxPeriod
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async prepareFiles(isErro=false) {

        this.folder = new Date().toLocaleDateString('en-CA').replace(/[^\w ]/g, "")
        this.fileName = `Docusign${this.folder}`
    
    
        const headerDoc = "accredited;contractNumber;headerState;technicianLogin;city;dataEnvio;idEnvelope;arquivo\n";
        
        this.errorLogger = await fs.createWriteStream(`${global.appRoot +"/uploads/"}Errorlog/Erros${this.fileName}.csv`, {
          flags: 'a'
        })
    
        this.logger = await fs.createWriteStream(`${global.appRoot +"/uploads/"}${this.folder}/${this.fileName}.csv`, {
          flags: 'a'
        })
    
        this.logger.write(headerDoc)
      }
    async makeDir() {
    
        const dirExist = await fs.existsSync(global.appRoot +"/uploads/" + this.folder)
        if (!dirExist)
          await fs.mkdirSync(global.appRoot +"/uploads/"+ this.folder)
      }
    async start() {
        try {
            await this.prepareFiles()
            await this.makeDir()

            await Csv.HandleCsv("IdsEnvelopesDe2017-10-10Ate2024-02-27.csv")
            let splitedArray = Csv.SplitArray(parseInt(process.env.quantidadeEnvelopesBaixados || ""), null)
            console.log(splitedArray)
            let docusign = await this.authentication()

            let response = await this.runner(splitedArray, docusign)
            const arquvivosBaixados = await fs.readdirSync(`${global.appRoot +"/uploads/"}${this.folder}`)
            return {
                ...response,
                baixados: arquvivosBaixados.length - 1,
                folder: this.folder
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async makeCsvFile(periodo) {
        try {      
            console.log("running makeCsvFile")

            const rangePeriodoEnv = process.env.rangePeriodoDias || "1"
            const rangePeriodo = parseInt(rangePeriodoEnv)

            const newPeriod = await this.makeInputCsv(periodo)
            let date = new Date(newPeriod.to)
            newPeriod.from = new Date(date.setDate(date.getDate() + 1)).toLocaleDateString("en-En");
            date = new Date(newPeriod.from)
            newPeriod.to = new Date(date.setDate(date.getDate() + rangePeriodo)).toLocaleDateString("en-En");
            console.log(newPeriod)
            newPeriod.start_position = 0
            newPeriod.namefile = this.nameFile
            return newPeriod
            
        } catch (error) {
            console.log("chamei o log!!!")
            console.log(error)
        }
    }
    async uploadLotes(){
        try {
            let docusign = await this.authentication()
            let file = fs.createReadStream(global.appRoot +"/uploads/teste.csv")
             await docusign.updateDocumentCLM({pathToFile: global.appRoot +"/uploads/teste.csv", name:"teste.csv"}, "61487f0d-b57f-421b-b2f7-7b4a97429e40", "b5b26a41-2cd6-ee11-b829-48df37a6f7d0")
        } catch (error) {
            console.log(error.response.data)
        }
    }
}


export default new ExtracaoMassiva();