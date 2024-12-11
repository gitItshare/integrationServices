import axios from "axios";

const sankhyaClient = (baseURL) => axios.create({
    headers: {
      token: process.env.token,
      appkey: process.env.appkey,
      username: process.env.usernameSankya,
      password: process.env.passwordSankya
    }
  });


const auth = async () => {
    try {
        const url = "https://api.sankhya.com.br/login"
        const client = sankhyaClient()
        let resp = await client.post(url)
        return resp.data.bearerToken
    } catch (error) {
        console.log(error.message)
    }
}

export default auth