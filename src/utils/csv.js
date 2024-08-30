import fs from 'fs'
class Csv {
    constructor() {
        this.idEnvelopes = []
        this.qtdLote = 0
        this.files = ""
    }
 
     async HandleCsv(namefile,erros){
        const date = new Date()
        const dayOfWeek = date.toLocaleDateString("en-En", { weekday: 'long' });
        let filePath = `${global.appRoot}/uploads/${namefile}`
        if(erros)
            filePath = `${process.env.fileErrorPath}/${namefile}`
        const buffer = await fs.readFileSync(`${filePath}`, { encoding: 'utf8' });
        const csv = buffer.toString()
        const arrayCsvLinhas = csv.split('\n')
        this.qtdLote = arrayCsvLinhas.length
        this.idEnvelopes = arrayCsvLinhas.map(el => el.replace("\r", "").replace("x,x,x,", ""))
        console.log(this.idEnvelopes)
    }
     SplitArray(pices, array){
        if (array)
            this.idEnvelopes = array
        const arrayLength = this.idEnvelopes.length
        console.log("envelop lenght", arrayLength)
        const splitedArray = [];
        let splitedpiece= [];
        let lastLote= []; 
        let frozenPiece = pices
        let contador = this.idEnvelopes.length
    
        for(let j =0; j <= arrayLength; j++){
            splitedpiece.push(this.idEnvelopes[j])
            if(j > pices){
                splitedArray.push(splitedpiece)
                splitedpiece = []
                pices +=frozenPiece
                contador -= frozenPiece
                if(pices > arrayLength){
                    lastLote = this.idEnvelopes.slice(-contador)
                }
            }
            if(lastLote.length > 0){
                splitedArray.push(lastLote)
                break;
            }
        }
        return splitedArray
    }
     async getFileNames() {
        const date = new Date()
        const dayOfWeek = date.toLocaleDateString("en-En", { weekday: 'long' });
        let fileNames = await fs.readdirSync(`${global.appRoot}/uploads/Arquivos/${dayOfWeek}/files`)
        return fileNames.join("; ");
    }
     async mergeCsvErros() {
        return new Promise(async (resolve,reject)=> {
            try {
                const date = new Date()
                const pathFiles = `${process.env.fileErrorPath}`
                const files = await fs.readdirSync(pathFiles)
                // await fs.mkdirSync(`${process.env.fileErrorPath}/${nameFolder}`)
                let logger = await fs.createWriteStream(`${process.env.fileErrorPath}/errosDelta.csv`, {
                    flags: 'a'
                })
                console.log("rodando merge csv",pathFiles)
                for (let file of files) {
                    try {
                        console.log(file)
                        if(file != "errosSemanais.csv"){
                            let dataBuffer = await fs.readFileSync(`${pathFiles}/${file}`)
                            let dataString = dataBuffer.toString()
            
                            await logger.write(dataString)
                        }
                        } catch (error) {
                        console.log("Deu erro")
                    }
                }
                await fs.readdirSync(pathFiles)
                logger.end()
                setTimeout(()=>{resolve(true)}, 5000)
            } catch (error) {
                console.log(error);
            }
        })

    }
}
export default new Csv()