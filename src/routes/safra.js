import express from 'express';
import safraServices from "../services/safra/index.js";
import { xml2json } from 'xml-js';
const router = express.Router();

let token = ""
let resp = [
    {
        "documentoCliente": "02974733000152",
        "agrupamentoRepresentantes": [
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "1 - JOSE | PATRICIA",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+1@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+2@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 2,
                "nomeAgrupamento": "2 - JOSE | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+3@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+4@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 3,
                "nomeAgrupamento": "3 - PATRICIA | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+5@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+6@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 53,
                "identificacaoSequenciaGrupoAlcada": 1,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 5000000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "4 - FABIO | YUJI",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "06284481802",
                        "codigoAtribuicao": "PRESIDENTE",
                        "codigoCargo": "DIRETOR",
                        "nome": "FABIO TORRETTA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+7@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    },
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "08926237800",
                        "codigoAtribuicao": "FINANCEIRO",
                        "codigoCargo": "DIRETOR",
                        "nome": "YUJI HAMADA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+8@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 53,
                "identificacaoSequenciaGrupoAlcada": 3,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 0,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "5 - FABIO | YUJI",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "06284481802",
                        "codigoAtribuicao": "PRESIDENTE",
                        "codigoCargo": "DIRETOR",
                        "nome": "FABIO TORRETTA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+9@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    },
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "08926237800",
                        "codigoAtribuicao": "FINANCEIRO",
                        "codigoCargo": "DIRETOR",
                        "nome": "YUJI HAMADA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+10@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 6,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "6 - JOSE | PATRICIA",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+11@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+12@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 6,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 2,
                "nomeAgrupamento": "7 - JOSE | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+13@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+14@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 6,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 3,
                "nomeAgrupamento": "8 - PATRICIA | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+15@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+16@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 6,
                "identificacaoSequenciaDocumento": 49,
                "identificacaoSequenciaGrupoAlcada": 1,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 5000000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "9 - FABIO | YUJI",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "06284481802",
                        "codigoAtribuicao": "PRESIDENTE",
                        "codigoCargo": "DIRETOR",
                        "nome": "FABIO TORRETTA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+17@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    },
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "08926237800",
                        "codigoAtribuicao": "FINANCEIRO",
                        "codigoCargo": "DIRETOR",
                        "nome": "YUJI HAMADA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+18@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 6,
                "identificacaoSequenciaDocumento": 49,
                "identificacaoSequenciaGrupoAlcada": 3,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 0,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "10 - FABIO | YUJI",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "06284481802",
                        "codigoAtribuicao": "PRESIDENTE",
                        "codigoCargo": "DIRETOR",
                        "nome": "FABIO TORRETTA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+19@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    },
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "08926237800",
                        "codigoAtribuicao": "FINANCEIRO",
                        "codigoCargo": "DIRETOR",
                        "nome": "YUJI HAMADA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+20@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            }
        ]
    },
    {
        "documentoCliente": "02974733000153",
        "agrupamentoRepresentantes": [
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "1 - JOSE | PATRICIA",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+21@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+22@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 2,
                "nomeAgrupamento": "2 - JOSE | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+23@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+24@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": "viscardi.souza@gmail.com"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 6,
                "identificacaoSequenciaDocumento": 49,
                "identificacaoSequenciaGrupoAlcada": 3,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 0,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "10 - FABIO | YUJI",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "06284481802",
                        "codigoAtribuicao": "PRESIDENTE",
                        "codigoCargo": "DIRETOR",
                        "nome": "FABIO TORRETTA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+25@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": ""
                    },
                    {
                        "identificacaoTipoDocumento": "CPF",
                        "documento": "08926237800",
                        "codigoAtribuicao": "FINANCEIRO",
                        "codigoCargo": "DIRETOR",
                        "nome": "YUJI HAMADA",
                        "dataFimMandato": "2025-04-01T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+26@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            }
        ]
    },
    {
        "documentoCliente": "02974733000154",
        "agrupamentoRepresentantes": [
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "1 - JOSE | PATRICIA",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+27@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+28@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 2,
                "nomeAgrupamento": "2 - JOSE | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+29@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+30@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            }
        ]
    },
    {
        "documentoCliente": "02974733000155",
        "agrupamentoRepresentantes": [
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "1 - JOSE | PATRICIA",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+31@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+32@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 2,
                "nomeAgrupamento": "2 - JOSE | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+33@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+34@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            }
        ]
    },
    {
        "documentoCliente": "02974733000156",
        "agrupamentoRepresentantes": [
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 1,
                "nomeAgrupamento": "1 - JOSE | PATRICIA",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+35@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "18148332851",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "PATRICIA ZANINI MERELLO",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+36@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:53:34",
                        "descricaoTipoAssinatura": "ICP-BRASIL"
                    }
                ]
            },
            {
                "identificacaoSequenciaCliente": 7044,
                "identificacaoSequenciaConta": 5,
                "identificacaoSequenciaDocumento": 41,
                "identificacaoSequenciaGrupoAlcada": 7,
                "quantidadeAssinaturasConjunto": 2,
                "indicadorCondicaoEspecial": false,
                "codigoMoeda": "REAL",
                "valorLimiteAlcada": 300000,
                "identificacaoSequenciaGrupoAssinatura": 2,
                "nomeAgrupamento": "2 - JOSE | JEFFERSON",
                "representantes": [
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "10203062892",
                        "codigoAtribuicao": "CATEGORIA B",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JOSE MAURICIO DE SOUZA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+37@gmail.com",
                        "dataHoraAssinaturaEnvelope": "2024-01-02T19:49:13",
                        "descricaoTipoAssinatura": "SAFRA ASSINATURAS"
                    },
                    {
                        "identificacaoTipoDocumento": "CP1",
                        "documento": "21842466895",
                        "codigoAtribuicao": "GRUPO II",
                        "codigoCargo": "PROCURADOR",
                        "nome": "JEFFERSON FRANCISCO PEREIRA",
                        "dataFimMandato": "2020-01-31T00:00:00",
                        "emailContatoAssinatura": "viscardi.souza+38@gmail.com",
                        "dataHoraAssinaturaEnvelope": "0001-01-01T00:00:00",
                        "descricaoTipoAssinatura": null
                    }
                ]
            }
        ]
    }
]
const auth = async (req,res,next) => {
    token = await safraServices.integration.auth()
    next()
}
//Middle ware that is specific to this router

// Define the home page route
router.post('/representantes',auth, async function(req, res) {
    // console.log("boody", req.body)
    const Params = req.body.Params
    const representantes = await safraServices.integration.consulta({Params}, token)
    console.log("TEKE", {data: resp})
    res.json({data: resp});
});
router.post('/templates',async function(req, res) {
    let resp = ""
      console.log(req.body)
      let data = JSON.parse(xml2json(req.body.Params,  { spaces: 2, compact: true }))
      console.log(data);

      let param = data.recipients.signers.map(el => {
        console.log(el.testemunhas) 
        return {
          nome: el.nome,
          email: el.email,
          tipoAss: el.tipoASs,
          tag: el.tag,
          ordem: el.ordem,
          cpf: el.cpf,
          role: el.role
        }
      });
      console.log(param)
      let auth = {
        userID: process.env.userIDDemo,
        integrationKey: process.env.integrationKey,
        dsOauthServer: process.env.dsOauthServerDev,
        accountID: process.env.accountIDDemo,
        privateKey: process.env.privatekeyDemo
    }
    const scope = "signature impersonation";
    console.log(auth)
      let docusign = new safraServices.Docusign(auth, scope)
      
    await docusign.jwt()
    await docusign.authenticate()
    resp = await docusign.makeTemplate(param, data.recipients)
    res.send('templates');
  });
export default router


