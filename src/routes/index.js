import sankhya from "./sankhya.js"
import estrategia from "./estrategia.js"
import safra from "./safra.js"
import bnym from "./bnym.js"
import topazio from "./Topazio.js"
import Jwt from "../services/jwt.js"
import express from 'express';
const auth = (req,res,next) => {
    const jwt = new Jwt()
    jwt.verifyJWT(req,res,next)
}
var router = express.Router();
router.use("/",auth)
 router.use("/sankhya",sankhya)
 router.use("/safra",safra)
 router.use("/bnym",bnym)
 router.use("/estrategia",estrategia)
 router.use("/topazio",topazio)

 export default router