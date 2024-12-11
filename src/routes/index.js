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
router.use("/")
 router.use("/sankhya",auth,sankhya)
 router.use("/safra",auth,safra)
 router.use("/bnym",auth,bnym)
 router.use("/estrategia",auth,estrategia)
 router.use("/topazio",auth,topazio)

 export default router