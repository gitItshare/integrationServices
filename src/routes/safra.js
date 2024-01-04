import express from 'express';
const router = express.Router();
import safraServices from "../services/safra/index.js";
let token = ""
let resp ={
  "data": [
      {
          "documentoCliente": "02974733000152",
          "representantes": [
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "10203062892",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "JOSE MAURICIO DE SOUZA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                  "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "18148332851",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "PATRICIA ZANINI MERELLO",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                  "descricaoTipoAssinatura": "ICP-BRASIL"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "10203062892",
                  "identificacaoSequenciaGrupoAssinatura": 2,
                  "nome": "JOSE MAURICIO DE SOUZA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                  "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "21842466895",
                  "identificacaoSequenciaGrupoAssinatura": 2,
                  "nome": "JEFFERSON FRANCISCO PEREIRA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "18148332851",
                  "identificacaoSequenciaGrupoAssinatura": 3,
                  "nome": "PATRICIA ZANINI MERELLO",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                  "descricaoTipoAssinatura": "ICP-BRASIL"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "21842466895",
                  "identificacaoSequenciaGrupoAssinatura": 3,
                  "nome": "JEFFERSON FRANCISCO PEREIRA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 5000000,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "06284481802",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "FABIO TORRETTA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 5000000,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "08926237800",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "YUJI HAMADA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 0,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "06284481802",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "FABIO TORRETTA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 0,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "08926237800",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "YUJI HAMADA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "10203062892",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "JOSE MAURICIO DE SOUZA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                  "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "18148332851",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "PATRICIA ZANINI MERELLO",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                  "descricaoTipoAssinatura": "ICP-BRASIL"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "10203062892",
                  "identificacaoSequenciaGrupoAssinatura": 2,
                  "nome": "JOSE MAURICIO DE SOUZA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                  "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "21842466895",
                  "identificacaoSequenciaGrupoAssinatura": 2,
                  "nome": "JEFFERSON FRANCISCO PEREIRA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "18148332851",
                  "identificacaoSequenciaGrupoAssinatura": 3,
                  "nome": "PATRICIA ZANINI MERELLO",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": "andre.cunha@safra.com.br",
                  "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                  "descricaoTipoAssinatura": "ICP-BRASIL"
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 300000,
                  "identificacaoTipoDocumento": "CP1",
                  "documento": "21842466895",
                  "identificacaoSequenciaGrupoAssinatura": 3,
                  "nome": "JEFFERSON FRANCISCO PEREIRA",
                  "dataFimMandato": "2020-01-31T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 5000000,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "06284481802",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "FABIO TORRETTA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 5000000,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "08926237800",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "YUJI HAMADA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 0,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "06284481802",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "FABIO TORRETTA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              },
              {
                  "quantidadeAssinaturasConjunto": 4,
                  "indicadorCondicaoEspecial": false,
                  "valorLimiteAlcada": 0,
                  "identificacaoTipoDocumento": "CPF",
                  "documento": "08926237800",
                  "identificacaoSequenciaGrupoAssinatura": 1,
                  "nome": "YUJI HAMADA",
                  "dataFimMandato": "2022-04-01T00:00:00",
                  "emailContatoAssinatura": null,
                  "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                  "descricaoTipoAssinatura": null
              }
          ]
      },
      { 
        "documentoCliente": "02974733000155",
        representantes: [{
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 5000000,
          "identificacaoTipoDocumento": "CPF",
          "documento": "06284481802",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "FABIO TORRETTA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 5000000,
          "identificacaoTipoDocumento": "CPF",
          "documento": "08926237800",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "YUJI HAMADA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 0,
          "identificacaoTipoDocumento": "CPF",
          "documento": "06284481802",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "FABIO TORRETTA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 0,
          "identificacaoTipoDocumento": "CPF",
          "documento": "08926237800",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "YUJI HAMADA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
        }]
      },
      { 
        "documentoCliente": "02974733000153",
        nome:"Cleyton",
        tipo:"A",
        representantes: [{
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 5000000,
          "identificacaoTipoDocumento": "CPF",
          "documento": "06284481802",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "FABIO TORRETTA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 5000000,
          "identificacaoTipoDocumento": "CPF",
          "documento": "08926237800",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "YUJI HAMADA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 0,
          "identificacaoTipoDocumento": "CPF",
          "documento": "06284481802",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "FABIO TORRETTA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 0,
          "identificacaoTipoDocumento": "CPF",
          "documento": "08926237800",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "YUJI HAMADA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
        }]
      },
      { 
        "documentoCliente": "02974733000154",
        tipo:"A",
        nome: "Josivaldo",
        representantes: [{
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 5000000,
          "identificacaoTipoDocumento": "CPF",
          "documento": "06284481802",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "FABIO TORRETTA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      },
      {
          "quantidadeAssinaturasConjunto": 4,
          "indicadorCondicaoEspecial": false,
          "valorLimiteAlcada": 5000000,
          "identificacaoTipoDocumento": "CPF",
          "documento": "08926237800",
          "identificacaoSequenciaGrupoAssinatura": 1,
          "nome": "YUJI HAMADA",
          "dataFimMandato": "2022-04-01T00:00:00",
          "emailContatoAssinatura": null,
          "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
          "descricaoTipoAssinatura": null
      }]
      }
  ]
}
const auth = async (req,res,next) => {
    req.token = await safraServices.integration.auth()
    console.log("TOKEN", req.token)
    next()
}
//Middle ware that is specific to this router

// Define the home page route
router.post('/representantes',auth, async function(req, res) {
    const Params = req.body.Params
    console.log("boody", req.body)
   const representantes = await safraServices.integration.consulta(Params, req.token)
   console.log("TEKE", req.token)
   res.json(representantes);
});

export default router