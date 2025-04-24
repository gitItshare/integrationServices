import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import axios from "axios";
import { encode } from 'gpt-3-encoder';
import e from "express";
import { json } from "stream/consumers";

const jsonDados = []
function jsonParaCSV(obj, idEnvelope) {
  const headers = Object.keys(obj);

  const valores = headers.map((key) => {
    return obj[key];
  });
  valores.push(idEnvelope);
  const csv = [valores.join(";")].join("\r");
  console.log("CSV", csv);
  return csv + "\n";
}
async function lerPDFsDaPasta(pasta) {
  const arquivos = fs.readdirSync(pasta);
  let pdfs = arquivos.filter((arquivo) => path.extname(arquivo) === ".pdf");
  let writableError = await fs.createWriteStream(
    `${global.appRoot}/uploads/errosHighStil`,
    {
      flags: "a",
    }
  );
  pdfs = await fs
    .readFileSync(`./uploads/HighstilIdsEnvelopesDe2017-10-10Ate2025-04-17.csv`)
    .toString()
    .split("\n");

  for (const pdf of pdfs) {
    const caminhoPDF = path.join(pasta, pdf + ".pdf");
    const texto = await extrairTextoPDF(caminhoPDF);
    console.log(`Texto extraído do PDF: ${pdf}`);
    let response = false;
    console.log("Texto", texto.length);
      const chunks = dividirTextoEmChunks(texto, 4200);
      let countChunk = 0;
      const respostas = []
      console.log("chunks", chunks);
      for (let chunk of chunks) {
        console.log("chunk", chunk.length, countChunk)
        countChunk++;
        response = await enviarParaOpenAI(
          chunk,
          writableError,
          pdf,
          chunks,
          countChunk
        );
        await new Promise((resolve) => setTimeout(resolve, 21000));
        try {
          if (response) {
            respostas.push(JSON.parse(response));
          }
        } catch (error) {
          console.error("Erro ao processar a resposta:", error);
          const jsonLimpo = response
          .replace(/```json/, '')
          .replace(/```/, '')  
          .trim();
          try {
            respostas.push(JSON.parse(jsonLimpo));
          } catch (error) {
            console.error("Erro ao processar a resposta:", error);
            writableError.write(pdf + "\n");
          }
        }
  
      }
      try {
        const consolidado = await consolidarRespostas(respostas);
        try{

          jsonDados.push({...JSON.parse(consolidado), idEnvelope: pdf});
          jsonDados.idEnvelope = pdf;
          await fs.writeFileSync(
            `${global.appRoot}/uploads/envelopesHighStil2.json`
            , JSON.stringify(jsonDados)
          );
        } catch(error){ 
          console.error("Erro ao processar o CSV", error);
          const jsonLimpo = consolidado
          .replace(/```json/, '')
          .replace(/```/, '')  
          .trim();
          try {
            jsonDados.push({...JSON.parse(jsonLimpo), idEnvelope: pdf});

            await fs.writeFileSync(
              `${global.appRoot}/uploads/envelopesHighStil2.json`
              , JSON.stringify(jsonDados)
            );
          } catch (error) {
            console.error("Erro ao processar a resposta:", error);
            writableError.write(pdf + "\n");
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 61000));

      } catch (error) {
        console.error(error)
        writableError.write(pdf + "\n");
        console.error("Erro ao processar o PDF:", error);
      }
  }
}

function dividirTextoEmChunks(texto, maxTokens = 4200) {
  const palavras = texto.split(/\s+/);
  const chunks = [];
  let chunk = [];

  let tokensAtual = 0;
  console.log(palavras)
  for (const palavra of palavras) {
    const tokenCount = encode(palavra + " ").length;
    if (tokensAtual + tokenCount > maxTokens) {
      chunks.push(chunk.join(" "));
      chunk = [];
      tokensAtual = 0;
    }
    chunk.push(palavra);
    tokensAtual += tokenCount;
  }

  if (chunk.length > 0) {
    chunks.push(chunk.join(" "));
  }

  return chunks;
}

async function extrairTextoPDF(caminho) {
  const dadosPDF = fs.readFileSync(caminho);
  const texto = await pdfParse(dadosPDF);
  return texto.text;
}

async function enviarParaOpenAI(
  texto,
  writableError,
  pdf,
  chunkPrompt = false,
  index
) {
  let prompt = `Você é um assistente jurídico. Extraia os seguintes dados do texto abaixo, 
      se estiverem presentes:
      -tipoDocumento
      -valorcontrato
      -valor da multa ou multa
      -vigência_inicio
      -vigência_fim
      -data_rescisao
      -contraparteCNPJ
      -parteCNPJ
      -razao social contraparte: pode ser candidato ou franqueada ou cliente ou representante ou contratante ou contraparte
      -razao social parte: pode ser franqueadora ou representada ou contratada ou parte
      -local
  Responda no seguinte formato JSON:
    {
        "tipoDocumento": "",
        "valorcontrato": "",
        "valormulta": "",
        "vigência_inicio": "",
        "vigência_fim": "",      
        "data_rescisao": "",
        "contraparteCNPJ": "",
        "parteCNPJ": "",
        "razaoScoialParte": ",
        "razaoScoialContraparte": "",
        "local": ""
    }
    Texto do contrato:
  ${texto}`;

  if (chunkPrompt) {
    prompt = `Você é um assistente jurídico. Extraia os seguintes dados do texto abaixo, 
      se estiverem presentes:
      -tipoDocumento
      -valorcontrato
      -valor da multa ou multa
      -vigência_inicio
      -vigência_fim
      -data_rescisao
      -contraparteCNPJ
      -parteCNPJ
      -razao social parte: pode ser candidato ou franqueada ou cliente ou representante ou contratante ou parte
      -razao social contraparte: pode ser franqueadora ou representada ou contratada ou contraparte
      -local
      Texto (parte ${index} de ${chunkPrompt.length}):  
  Responda no seguinte formato JSON:
    {
        "tipoDocumento": "",
        "valorcontrato": "",
        "valormulta": "",
        "vigência_inicio": "",
        "vigência_fim": "",
        "data_rescisao": "",
        "contraparteCNPJ": "",
        "parteCNPJ": "",
        "razaoScoialParte": ",
        "razaoScoialContraparte": "",
        "local": ""
    }
    Texto do contrato:
    ${texto}`;
  }
  try {
    const resposta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente jurídico." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resultado = resposta.data.choices[0].message.content;
    console.log("Resposta da OpenAI:", resultado);
    return resultado;
  } catch (erro) {
    console.error(
      "Erro ao enviar para a OpenAI:",
      erro.response || erro.message
    );
    console.error("Texto do PDF:", texto.length);
    const tokens = encode(texto);
console.log(`Tokens totais: ${tokens.length}`);
    writableError.write(pdf + "\n");
    
    return false;
  }
}
async function consolidarRespostas(respostas) {
  const prompt = `
    Você é um assistente jurídico.

    Receberá um array de objetos JSON com informações parciais sobre um contrato. Sua tarefa é:

    - Consolidar os dados em um único objeto JSON
    - no campo valormulta considerar apenas o valor da multa em R$
    - Selecionar os valores mais completos (ex: nomes maiores, endereços válidos, CNPJs completos)
    - Ignorar valores redundantes
    - Padronizar o campo "local" com vírgulas e formatação de endereço
    - Remover prefixos como "LOCATÁRIA/CEDENTE:" nos nomes
    - Responda SOMENTE com o JSON final consolidado
    - em razao social da parte e contraparte, de prioridade para razao social e nao demominação
    - mantenha a estrutura do JSON mesmo com campos vazios

    Array:
    ${JSON.stringify(respostas, null, 2)}
    `;
  try {
    const resposta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente jurídico." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.5,
      },
      {          
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resultado = resposta.data.choices[0].message.content;
    console.log("Resposta da OpenAI CONSOLIDADO:", resultado);
    return resultado;
  } catch (erro) {
    console.error(
      "Erro ao enviar para a OpenAI:",
      erro.response || erro.message
    );
    console.error("Texto do PDF:", texto.length);
    const tokens = encode(texto);
    console.log(`Tokens totais: ${tokens.length}`);
    writableError.write(pdf + "\n");    
  }
}
const pastaComPDFs = "./pdfs";
export { lerPDFsDaPasta, extrairTextoPDF, enviarParaOpenAI };
