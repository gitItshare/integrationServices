
const buttonCli = document.getElementById("addRepCli")
const buttonRemoveCli = document.getElementById("removeCli")

const buttonCliTerceiros = document.getElementById("addRepCli-terceiros")
const buttonRemoveCliTerceiros = document.getElementById("removeCli-terceiros")
const clientList = document.getElementById("nome-representante-list")
const terceirosList = document.getElementById("nome-representante-terceiros-list")
const terceirosEmailList = document.getElementById("email-representante-terceiros-list")

const clientEmailList = document.getElementById("email-representante-list")
const buttonAvalista = document.getElementById("addRepCli-avalista")
const buttonRemoveAvalista = document.getElementById("removeCli-avalista")
let emitente = {
    "Emitente_Razao_Social": "yuji itadori",
    "Emitente_CNPJ": "02974733000152",
}
let terceiroGarantidor = {
            "Terceiro_Garantidor_Nome_Razao_Social": "teste terceiro",
            "CPF_CNPJ": "02974733000155",
            "Terceiro_Garantidor_Endereco": "Rua Júlio Girardi",
            "Terceiro_Garantidor_Cidade": "Campinas",
            "Terceiro_Garantidor_Bairro": "itapetao",
            "Terceiro_Garantidor_Estado": {
                "_key": "SP",
                "__text": "SP"
            },
            "Terceiro_Garantidor_CEP": "13060-722",
            "_displayName": "",
            "_displayValue": ""
}
let avalistasTable =  [
    {
        "Avalistas_Nome_Razao_Social": "teste 1",
        "Avalistas_CPF_CNPJ": "02974733000153",
        "Avalistas_Endereco": "Rua Júlio Girardi",
        "Avalistas_Cidade": "Campinas",
        "Avalistas_Bairro": "vila",
        "Avalistas_Estado": {
            "_key": "SP",
            "__text": "SP"
        },
        "Avalistas_CEP": "13060-729",
        "_displayName": "",
        "_displayValue": ""
    },
    {
        "Avalistas_Nome_Razao_Social": "teste 2",
        "Avalistas_CPF_CNPJ": "02974733000153",
        "Avalistas_Endereco": "teste end",
        "Avalistas_Cidade": "sao paulo",
        "Avalistas_Bairro": "pq industrial",
        "Avalistas_Estado": {
            "_key": "SP",
            "__text": "SP"
        },
        "Avalistas_CEP": "13060-728",
        "_displayName": "",
        "_displayValue": ""
    }
]
let avalistaDIV = document.getElementById("avalistas")
const clientesDiv = document.getElementById("clienteContainer").parentElement
let contadorRepCli = 1


axios.post("http://localhost:3000/safra/representantes").then(res => {
    let {data} = res.data
    console.log("DATAA", data)
    let representanteCli = data.find(el => el.documentoCliente == emitente.Emitente_CNPJ.replace(/[^\w\s]/gi, '')).representantes

    let terceiros = data.find(el => el.documentoCliente == terceiroGarantidor.CPF_CNPJ.replace(/[^\w\s]/gi, '')).representantes
    let avalistasCNPJ = avalistasTable.map(el => el.Avalistas_CPF_CNPJ.replace(/[^\w\s]/gi, '') )
    let avalistas = data.filter(el => avalistasCNPJ.includes(el.documentoCliente))
    console.log("AQUIII",avalistas)
    preencherLists(representanteCli,clientList,clientEmailList)
    preencherLists(terceiros,terceirosList,terceirosEmailList)
    preencherAvalistas(avalistas)
    
})

function addClient (event, id, cloneParam) {
    try {
        let clone
        if(!cloneParam)
            clone = document.getElementById(id).cloneNode(true)
        else{
            clone = cloneParam.children[1].children[0].cloneNode(true)
            clone.children[0].children[1].value = ""
            clone.children[1].children[1].value = ""
        }
        console.log("aQUIIII", clone)
        clone.removeAttribute("hidden")
        const buttomremove = clone.children[2].children[0].children[2].children[0]
        buttomremove.addEventListener("click", (event)=>{remove(event)})
        clone.children[0].children[1].addEventListener("blur", preencherAutomatico)
        contadorRepCli++
        clone.id = "representante"+contadorRepCli
        console.log("adcioonando", clone)
        return clone

    } catch (error) {
        console.log(error)
    }
}
function remove(event) {
     let self = event.target
     const container = self.parentElement.parentElement.parentElement.parentElement
     console.log(container)
     container.remove()
}

buttonCli.addEventListener("click", function(event){
    const clone = addClient(event, "clienteContainer0")
    buttonCli.parentElement.parentElement.insertAdjacentElement("beforebegin",clone)
})

buttonCliTerceiros.addEventListener("click", function(event){
    const clone = addClient(event, "tericeiroContainer0")
    buttonCliTerceiros.parentElement.parentElement.insertAdjacentElement("beforebegin",clone)
})


buttonRemoveCli.addEventListener("click", function(event){
    const clone = remove(event, "clienteContainer0")
})

buttonRemoveCliTerceiros.addEventListener("click", function(event){
    const clone = remove(event, "tericeiroContainer0")
})

document.getElementById("nome-representante").addEventListener("blur", preencherAutomatico)
document.getElementById("nome-representante-terceiros").addEventListener("blur", preencherAutomatico)

  function preencherAutomatico()  {
    console.log(this.parentElement.parentElement.parentElement.parentElement)
    let value = this.value
    let email = this.parentElement.parentElement.children[1].children[1]
    const options = Array.from(clientList.options).find(el => el.value == value)
    if(!value)
        email.value = ""
    else
        email.value = options.getAttribute("email")
}
function preencherLists(array, listName, listEmail) {
    console.log("ARRAyy", array)
    array.forEach((el, index) => {
        listName.innerHTML += `<option qtdAss="${el.quantidadeAssinaturasConjunto}"  email="${el.emailContatoAssinatura}" name="${index}" value="${el.nome}">${el.nome}</option>`
        listEmail.innerHTML += `<option value="${el.emailContatoAssinatura}">${el.emailContatoAssinatura}</option>`
    })
}

function preencherAvalistas(avalistas) {
    avalistas.forEach((el, index) => {
        const clone = document.getElementById("avalistas0").cloneNode(true)
        clone.removeAttribute("hidden")
        let addButton = clone.children[1].children[2].children[0].children[0]
        clone.id = el.nome
        clone.children[0].innerText = el.nome
        const buttomremove = clone.children[1].children[0].children[2].children[0].children[2].children[0]
        buttomremove.addEventListener("click", (event)=>{remove(event)})
        const inputName = clone.children[1].children[0].children[0].children[1]
        const inputEmail = clone.children[1].children[0].children[1].children[1]
        const inputEmailList = clone.children[1].children[0].children[1].children[2]
        const inputNameList = clone.children[1].children[0].children[0].children[2]

        inputName.setAttribute("list", el.nome+"list")
        inputNameList.id = el.nome+"list"
        inputEmail.setAttribute("list", el.nome+"listEmail")
        inputEmailList.id = el.nome+"listEmail"
        avalistaDIV.appendChild(clone)
        
        addButton.addEventListener("click", function(event){
            const cloneCli = addClient(event, "avalistaContainer0", clone)
            
            console.log("Clone cli", cloneCli)
            cloneCli.setAttribute("style","margin-bottom: 20px")
            
            addButton.parentElement.parentElement.insertAdjacentElement("beforebegin",cloneCli)
        })


        inputName.addEventListener("blur", preencherAutomatico)
        let representantesAvalista = el.representantes

        preencherLists(representantesAvalista,inputNameList,inputEmailList)
        
    })
}