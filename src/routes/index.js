import sankhya from "./sankhya.js"
import estrategia from "./estrategia.js"
import safra from "./safra.js"
import bnym from "./bnym.js"
import topazio from "./Topazio.js"
import Jwt from "../services/jwt.js"
import highStill from "./highStill.js"
import express from 'express';
import druid from "./druid.js"
import cenibra from "./cenibra.js"
import alana from "./alana.js"
const auth = (req,res,next) => {
    const jwt = new Jwt()
    jwt.verifyJWT(req,res,next)
}
var router = express.Router();
 router.use("/druid",druid)
router.use("/",auth)
 router.use("/sankhya",sankhya)
router.use("/alana",alana)
 router.use("/safra",safra)
 router.use("/bnym",bnym)
 router.use("/estrategia",estrategia)
 router.use("/topazio",topazio)
 router.use("/highStill",highStill)
router.use("/cenibra",cenibra)


 export default router