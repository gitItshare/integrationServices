import sankhya from "./sankhya.js"
import safra from "./safra.js"

import express from 'express';
const auth = (req,res,next) => {
    
}
var router = express.Router();
 router.use("/sankhya",sankhya)
 router.use("/safra",safra)

 export default router