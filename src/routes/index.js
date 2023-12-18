import sankhya from "./sankhya.js"

import express from 'express';
var router = express.Router();
 router.use("/sankhya",sankhya)

 export default router