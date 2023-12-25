import express from 'express';
const router = express.Router();
import safraServices from "../services/safra/index.js";
let token = ""
const auth = async (req,res,next) => {
    token = await safraServices.integration.auth()
    next()
}
//Middle ware that is specific to this router

// Define the home page route
router.post('/representantes',auth, async function(req, res) {
   const resp = await safraServices.integration.consulta(req.body, token)
   console.log("TOKEN", resp.empresas[0].representantes)
  res.send('parceiros');
});

export default router