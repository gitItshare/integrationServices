import axios from "axios";
const sankhyaToken = process.env.sankhyaToken
const sankhyaClient = (baseURL) => axios.create({
    headers: {
      'Authorization': sankhyaToken,
      token: process.env.token,
      appkey: process.env.appkey,
      username: process.env.username,
      password: process.env.username.password
    }
  });


const auth = async () => {
    try {
        const url = "https://api.sankhya.com.br/login"
        const client = sankhyaClient()
        let resp = await client.post(url)
        return resp.data.bearerToken
    } catch (error) {
        console.log(error)
    }
}

export default auth