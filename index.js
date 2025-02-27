import express from 'express'
import bodyParser from 'body-parser'
import routes from "./src/routes/index.js"
import dotenv from "dotenv"
import path from 'path';
import  Client  from 'ssh2-sftp-client'
import Jwt from './src/services/jwt.js';
import Docusign from './src/services/Docusign/index.js';
import axios from 'axios';
const app = express()
const port = 3000
dotenv.config()
let rootPath = process.env.rootPath
global.appRoot = path.resolve(rootPath)
// let sftp = new Client();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(routes);

app.get('/', async (req, res) => {
  res.send("helloWorld")
})

app.get('/ftp', async (req, res) => {
  try {
    const credentials = {
      userID: process.env.geradoraUser,
      integrationKey: process.env.geradoraIntegrationKey,
      privateKey: process.env.geradoraKey || "",
      dsOauthServer: "account-d.docusign.com",
      accountID:  "106924d5-ab04-4e9b-835f-183879fb4070",
  }
      const scope = "signature impersonation spring_read spring_write";
      const docusign = new Docusign(credentials, scope);
      await docusign.jwt();
      await docusign.authenticate();
      const token = await docusign.getToken();
      //https://<environment>.springcm.com/api/v2/<account_id>/documentGeneration
      const params = `<Params><NumeroDocumento>1</NumeroDocumento><DADOS_DA_PROPOSTA><Filial>SSA Obras</Filial><DataEmissao>2025-02-18T03:00:00Z</DataEmissao><PropostaN>142353 GERA TESTE</PropostaN><ContratoExistente>2</ContratoExistente></DADOS_DA_PROPOSTA><DadosLocadora><RazaoSocialLocadora>A GERADORA ALUGUEL DE MÁQUINAS S.A.</RazaoSocialLocadora><CNPJLocadora>33.845.322/0023-04</CNPJLocadora><LogradouroNLocadora>RUA DOUTOR ALTINO TEIXEIRA, Nº 1073</LogradouroNLocadora><BairroLocadora>PORTO SECO PIRAJA</BairroLocadora><CidadeLocadora>Salvador</CidadeLocadora><EstadoLocadora>SalvadorBahia</EstadoLocadora><CEPLocadora>41233-010</CEPLocadora></DadosLocadora><DadosLocataria><RazaoSocialLocataria>HOTEL ABROLHOS LTDA</RazaoSocialLocataria><CNPJLocataria>12239491000107</CNPJLocataria><LogradouroNLocataria /><BairroLocataria>ABROLHOS</BairroLocataria><CidadeLocataria /><EstadoLocataria /><CEPLocataria /><TelefoneLocataria /><RepresentanteLegalLocataria /><NomeObra /><LocalObra /><TelefoneObra>(11)5681-1888</TelefoneObra><EmailObra>teste@seomarketing.com.br</EmailObra></DadosLocataria><Dados_Gerais><TabelaPropostaLocacao_Container><TabelaPropostaLocacao><Quantidade>1</Quantidade><Descricao>CABO FLEXIVEL 120MM - 025 M</Descricao><Complemento>N/A</Complemento><FranquiaContratada /><ValorUnitario>113.86</ValorUnitario><ValorTotal>113.86</ValorTotal><HorasExcedentes>0</HorasExcedentes></TabelaPropostaLocacao><TabelaPropostaLocacao><Quantidade>1</Quantidade><Descricao>GERADOR DE ENERGIA 0500 KVA - CARENADO</Descricao><Complemento>220</Complemento><FranquiaContratada /><ValorUnitario>15000</ValorUnitario><ValorTotal>15900</ValorTotal><HorasExcedentes>81.25</HorasExcedentes></TabelaPropostaLocacao></TabelaPropostaLocacao_Container><ValorTotalLocacaoMensal>16013.86</ValorTotalLocacaoMensal><DetalhamentoInformacoesPropostaPrecos><![CDATA[<html><head><meta charset='UTF-8'></head><body><p>Detalhamento teste</p></body></html>]]></DetalhamentoInformacoesPropostaPrecos></Dados_Gerais><CondicoesFornecimento><InicioContrato>2025-02-18T03:00:00Z</InicioContrato><TerminoContrato>2025-03-17T03:00:00Z</TerminoContrato><PeriodoMinimoLocacao>30</PeriodoMinimoLocacao><FaturamentoAntecipado>True</FaturamentoAntecipado><PrazoPagamento /><ValidadePropostaDias>15</ValidadePropostaDias><ValidadePropostaDiasExtenso>Quinze Dias</ValidadePropostaDiasExtenso></CondicoesFornecimento><Atributos_Adicionais><DataInicioContrato>2025-02-18T03:00:00Z</DataInicioContrato><DataFimContrato>2025-03-17T03:00:00Z</DataFimContrato><ValorFatura>16013.86</ValorFatura><TipoFaturamento>True</TipoFaturamento><TipoLocacao>2</TipoLocacao><ResponsabilidadeFrete>2</ResponsabilidadeFrete><Seguro>True</Seguro></Atributos_Adicionais><Cod>Proposta Comercial</Cod></Params>`
      const body = {
        "Data":"<root>AAAA</root>",
        "DataType": "XML",
        "DestinationFolder": {
          "Href": "https://apiuatna11.springcm.com/v2/106924d5-ab04-4e9b-835f-183879fb4070/folders/70c8ab25-b9b8-ef11-bed7-9440c98d2d61"
      },
        "DocLauncherConfiguration": {
          "Name": "Proposta Comercial",
          "Href": "https://apiuatna11.springcm.com/v2/106924d5-ab04-4e9b-835f-183879fb4070/doclauncherconfigurations/8b9f02c7-7f0d-4d49-a328-25e7b5a8563c"
        }
    }
    const body2 = {
      "Data": "<Params><Informacoes_Sistema><Tipo_Contrato>Arrendamento</Tipo_Contrato></Params>",
      "DataType": "xml",
      "DestinationFolder": {
          "Href": "https://apiuatna11.springcm.com/v2/eec752d7-a8e0-4205-81e6-61cb85f54ee6/folders/51c02555-3ce0-ec11-b823-48df378a7098"
      },
      "DocLauncherConfiguration": {
          "Href": "https://apiuatna11.springcm.com/v2/eec752d7-a8e0-4205-81e6-61cb85f54ee6/doclauncherconfigurations/03c1b218-cb5a-484b-846e-fe1cabc2a837"
      }
  }
      const response = await axios({
        method: 'post',
        url: `https://apiuatna11.springcm.com/v2/${credentials.accountID}/doclaunchertasks`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
    })
    https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation%20spring_write%20spring_read&client_id=6793d79a-3051-4e5a-aa81-1611ce329991&redirect_uri=https://account-d.docusign.com/oauth/auth
    res.json(response.data)
  } catch (error) {
    res.json(error)
  }

})
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
