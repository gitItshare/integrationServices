import sankhya from "./sankhya.js"
import estrategia from "./estrategia.js"
import safra from "./safra.js"
import bnym from "./bnym.js"

import express from 'express';
const auth = (req,res,next) => {
    
}
var router = express.Router();
 router.use("/sankhya",sankhya)
 router.use("/safra",safra)
 router.use("/bnym",bnym)
 router.use("/estrategia",estrategia)

 export default router