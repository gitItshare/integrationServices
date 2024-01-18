import  jwt  from 'jsonwebtoken'

class Jwt{
    constructor(payload, privateKey, algorithm = 'RS256'){
        this.payload = payload
        this.privateKey = privateKey
        this.algorithm = algorithm
    }

     async getToken()  {
        try {    
            const token = await jwt.sign(this.payload, this.privateKey, { algorithm: this.algorithm});
            return token
         } catch (error) {
            console.log("ERROR", error)
             return error.data
         }
     }
}

export default  Jwt