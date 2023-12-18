import express from 'express';
const router = express.Router();
import sankhyaServices from "../services/sankhya/index.js";
let token = ""
const auth = async (req,res,next) => {
    token = await sankhyaServices.auth()
    next()
}
import sankyaClient from "../services/sankhya/index.js"
//Middle ware that is specific to this router

// Define the home page route
router.post('/parceiros',auth, async function(req, res) {
    const resp = await sankyaClient.clientes.cadastro(req.body, token)
    console.log(resp)
  res.send('parceiros');
});

export default router