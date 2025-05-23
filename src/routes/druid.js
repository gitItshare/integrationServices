import express from 'express';
const router = express.Router();
import DruidServices from "../services/druid/index.js";
let token = ""
const druidServices = new DruidServices()
import sankyaClient from "../services/sankhya/index.js"

router.post('/admissao', async function(req, res) {
  try {
        const {
          type,
          employee,
          status_name
        } = req.body
        const idEmployee = employee.id;
        const resp = await druidServices.getEmployees(idEmployee)
        const xml = druidServices.gerarXml(resp)
        const workflow = await druidServices.startWorkFlow(xml)
      res.send(workflow);
  } catch (error) {
      console.log("Error ao iniciar o workflow", error)
      res.status(500).send(workflow);
  }
});

export default router