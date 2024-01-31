const buttonCli = document.getElementById("addRepCli")
const buttonRemoveCli = document.getElementById("removeCli")
const buttonCliTerceiros = document.getElementById("addRepCli-terceiros")
const buttonRemoveCliTerceiros = document.getElementById("removeCli-terceiros")
const clientList = document.getElementById("nome-representante-list")
const terceirosList = document.getElementById("nome-representante-terceiros-list")
const terceirosEmailList = document.getElementById("email-representante-terceiros-list")
const terceirosCpfList = document.getElementById("cpf-representante-terceiros-list")

const clientEmailList = document.getElementById("email-representante-list")
const clientCpfList = document.getElementById("cpf-representante-list")

const buttonAvalista = document.getElementById("addRepCli-avalista")
const buttonRemoveAvalista = document.getElementById("removeCli-avalista")
const x2js = new X2JS();

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
let avalistasTable = [{
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
let workflow = document.querySelector('.page-header').children[1].innerText.split(" ");
workflow = workflow[1].split("/");
const HOSTNAME = "https://uatna11.springcm.com";
const url = HOSTNAME + '/atlas/Documents/get.ashx/' + workflow[0]
let representanteCli = []
let representantesAvalista = []

let avalistaDIV = document.getElementById("avalistas")
let terceirosDIV = document.getElementById("terceiros")

const clientesDiv = document.getElementById("clienteContainer").parentElement
let contadorRepCli = 1
let testemunhaEmitente = ""
let valorContrato = 0
$.ajax({
    url: url,
    method: 'GET',
    headers: {
      'Accept': '*/*'
    },
    dataType: 'XML'
  }).done(function (response) {
    console.log("response", response)
        const url = HOSTNAME + '/atlas/Documents/get.ashx/' + workflow[1]

        let data = x2js.xml2json(response); // Convert XML to JSON
        console.log(data)
        testemunhaEmitente = data.Params.Documents.Document.UpdatedBy
        valorContrato = parseInt(data.Params.TemplateFieldData.Valor_unformatted)
        emitente = data.Params.TemplateFieldData.Emitente
        terceiroGarantidor = data.Params.TemplateFieldData.Terceiro_Garantidor.Tabela_Terceiro_Garantidor_Container.Tabela_Terceiro_Garantidor
        if(terceiroGarantidor.element)
            terceiroGarantidor = terceiroGarantidor.element
        avalistasTable = data.Params.TemplateFieldData.Avalistas.Tabela_Avalistas_Container.Tabela_Avalistas
        if(avalistasTable.element)
            avalistasTable = avalistasTable.element

        if(!Array.isArray(avalistasTable))
            avalistasTable = [avalistasTable]

        if(!Array.isArray(terceiroGarantidor))
            terceiroGarantidor = [terceiroGarantidor]
            valorContrato

        $.ajax({
            url: url,
            method: 'GET',
            headers: {
              'Accept': '*/*'
            },
            dataType: 'text'
          }).done(res => {
            document.querySelector("#ctl00_MainContent_buttonGroup_btnDone").addEventListener("mouseover", function () {
                console.log("ATIVANDO MOUSE OVER")
                makeXml()
            })
            let {data}= JSON.parse(res)
            console.log("DATAA", data)
            let representanteCli = data.find(el => el.documentoCliente == emitente.Emitente_CNPJ.replace(/[^\w\s]/gi, '')).agrupamentoRepresentantes
            console.log("REPRESENTNTE", representanteCli)

            console.log(avalistasTable)
            let avalistasCNPJ = avalistasTable.map(el => el.Avalistas_CPF_CNPJ.replace(/[^\w\s]/gi, ''))
            let avalistas = data.filter(el => avalistasCNPJ.includes(el.documentoCliente))
            let terceirosCNPJ = terceiroGarantidor.map(el => el.CPF_CNPJ.replace(/[^\w\s]/gi, ''))
            let terceiros = data.filter(el => terceirosCNPJ.includes(el.documentoCliente))
            console.log("AQUIII", representanteCli)
            clientGrupos.addEventListener("change", function () {
                changeGroups(this, representanteCli, buttonCli, "clienteContainer0", "gruposDiv")
            
            })
            preencherLists(representanteCli, clientGrupos)
            preencherAvalistas(avalistas)
            preencherTerceiros(terceiros)
        })
    })


    function addClient(event, id, cloneParam, representante = {}) {
        try {
            let clone = document.getElementById(id).cloneNode(true)
    
            if (representante.nome) {
                clone.children[0].children[1].value = representante.nome
                clone.children[1].children[1].value = representante.documento
                clone.children[2].children[1].value = representante.emailContatoAssinatura
            }
            // console.log("aQUIIII", clone.children[2].children[0].children[2].children[0])
            clone.removeAttribute("hidden")
    
            let buttomremove = clone.children[3].children[0].children[2].children[0]
    
            buttomremove.addEventListener("click", (event) => {
                remove(event)
            })
            clone.children[0].children[1].addEventListener("blur", preencherAutomatico)
            contadorRepCli++
            clone.id = "representante" + contadorRepCli
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
    
    buttonCli.addEventListener("click", function (event) {
        const clone = addClient(event, "clienteContainer0")
        buttonCli.parentElement.parentElement.parentElement.children[1].appendChild(clone)
    
    })
    
    
    let changeGroups = (self, representantesArray, button, idContainer, gruposDiv) => {
        console.log("REPRESENTANTES ", button.parentElement.parentElement.parentElement.children.length)
        if (button.parentElement.parentElement.parentElement.children.length >= 3) {
            button.parentElement.parentElement.parentElement.children[1].innerHTML = ""
        }
    
    
        let value = self.value
        let condEespecial = self.options[self.selectedIndex].getAttribute("condeespecial")
        let label = self.parentElement.children[0]
        if (condEespecial == "true")
            label.innerHTML = '<p style="color:tomato">Grupos Condicao Especial</p>'
        else
            label.innerHTML = '<p>Grupos</p>'
        
        console.log("ARRAYY", representantesArray)
        let representantes = representantesArray.find(el => el.nomeAgrupamento == self.value).representantes
    
        console.log("REP0 ", representantes)
    
        representantes.forEach(representante => {
            const clone = addClient(null, idContainer, false, representante)
            document.getElementById(gruposDiv).appendChild(clone)
        })
    
    
    }

    document.getElementById("nome-representante").addEventListener("blur", preencherAutomatico)
    document.getElementById("nome-representante-terceiros").addEventListener("blur", preencherAutomatico)
    document.getElementById("tipoAssinatura").addEventListener("change", function(){
        if(this.value == "manual"){
            document.getElementById("idDestinatario").removeAttribute("hidden")
        } else {
            document.getElementById("idDestinatario").setAttribute("hidden", true)
        }
    })
    function preencherAutomatico() {
        console.log(this.parentElement.parentElement.parentElement.parentElement)
        let value = this.value
        let cpf = this.parentElement.parentElement.children[1].children[1]
        let email = this.parentElement.parentElement.children[2].children[1]
        let label = this.parentElement.parentElement.children[0].children[0]
        console.log("LABEELL", label)
        const options = Array.from(clientList.options).find(el => el.value == value)
        let condEespecial = options.getAttribute("condEespecial")
        if (condEespecial == "true")
            label.innerHTML = '<p style="color:tomato">Representantes Condicao Especial</p>'
        else
            label.innerHTML = '<p>Representantes</p>'
    
        if (!value) {
            email.value = ""
            cpf.value = ""
            label.innerHTML = '<p>Representantes</p>'
        } else {
            email.value = options.getAttribute("email")
            cpf.value = options.getAttribute("cpf")
        }
    }
    
    function preencherLists(array, listName, listEmail, listCpf) {
        console.log("ARRAyy", array)
        array.forEach((el, index) => {
            listName.innerHTML += `<option condEespecial="${el.indicadorCondicaoEspecial}" name="${index}" value="${el.nomeAgrupamento
                    }">${el.nomeAgrupamento
                    }</option>`
        })
    }
    
    function preencherAvalistas(avalistas) {
        avalistas.forEach((el, index) => {
            const clone = document.getElementById("avalistas0").cloneNode(true)
            clone.removeAttribute("hidden")
            let addButton = clone.children[1].children[3].children[0].children[0]
            console.log(el)
            const avalista = avalistasTable.find(avalista => avalista.Avalistas_CPF_CNPJ.replace(/[^\w\s]/gi, '') == el.documentoCliente)
            console.log("NOMWE", avalista)
            let nome = avalista.Avalistas_Nome_Razao_Social
            clone.id = nome
            clone.children[0].innerText = nome
            const inputNameList = clone.children[1].children[0].children[0].children[1]
    
            avalistaDIV.appendChild(clone)
            let selectGroups = clone.children[1].children[0].children[0].children[1]
            avalistaDiv = clone.children[1].children[1].id = "gruposAvalistaDiv" + el.documentoCliente
            console.log("AVALISTAS ", avalista)
            selectGroups.addEventListener("change", function () {
                changeGroups(this, el.agrupamentoRepresentantes, addButton, "avalistaContainer0", "gruposAvalistaDiv" + el.documentoCliente)
            })
            addButton.addEventListener("click", function (event) {
                console.log(clone)
                const cloneCli = addClient(event, "avalistaContainer0", true)
    
                console.log("Clone cli", cloneCli)
                cloneCli.setAttribute("style", "margin-bottom: 20px")
    
                addButton.parentElement.parentElement.parentElement.children[1].appendChild(cloneCli)
            })
    
    
            // inputName.addEventListener("blur", preencherAutomatico)
            let representantesAvalista = el.agrupamentoRepresentantes
    
            preencherLists(representantesAvalista, inputNameList)
    
        })
    }
    
    function maketableCli(array, anchor, ordem) {
        let xml = ""
        array.forEach((el, index) => {
            xml += "<signers>"
            let nome = el.children[0].children[1].value
            let cpf = el.children[1].children[1].value
            let email = el.children[2].children[1].value
            let tipoASs = el.children[3].children[0].children[1].children[0].value
            let tag = anchor + (index + 1)
            xml += "<nome>Emitente" + (index + 1) + "</nome>"
            xml += "<email>" + email + "</email>"
            xml += "<cpf>" + cpf + "</cpf>"
            xml += "<tag>" + tag + "</tag>"
            xml += "<tipoASs>" + tipoASs + "</tipoASs>",
            xml += "<ordem>" + ordem + "</ordem>"

            console.log(el)
            xml += "</signers>"
        })
        xml+= "<signers>"
        xml += "<nome> Testemunha Emitente </nome>"
        xml += "<email>" + testemunhaEmitente + "</email>"
        xml += "<cpf></cpf>"
        xml += "<tag>sign_T1</tag>"
        xml += "<tipoASs>DS ELETRONIC </tipoASs>"
        xml += "<ordem>" + ordem + "</ordem>"
        xml += "</signers>"

        return xml
    }
    function makeTableBanco (valor, ordem) {
        let emailBanco = ""
        let cpfBanco =  ""
        let emailBanco2 = ""
        let cpfBanco2 =  ""
        let xml = ""
        if(valor <= 15000){
            emailBanco = "vanessa.menezes@safra.com.br"
            cpfBanco =  "26749486800"
            emailBanco2 = "roberto.capel@safra.com.br"
            cpfBanco2 =  "16651816802"
        }else if(valor <= 50000 && valor > 15000){
            emailBanco = "ciro.silva@safra.com.br"
            cpfBanco =  "21839585889"
            emailBanco2 = "jose.galvao@safra.com.br"
            cpfBanco2 =  "3584638828"
        }else if(valor <= 200000 && valor > 50000){
            emailBanco = "ciro.silva@safra.com.br"
            cpfBanco =  "21839585889"
            emailBanco2 = "marcio.nobrega@safra.com.br"
            cpfBanco2 =  "08594753870"
        }else if(valor > 200000){
            emailBanco = "agostinho.stefanelli@safra.com.br"
            cpfBanco =  "05782565845"
            emailBanco2 = "marcos.monteiro@safra.com.br"
            cpfBanco2 =  "10510942830"
        }

        xml+= "<signers>"
        xml += "<nome> Testemunha Banco </nome>"
        xml += "<email>" + emailBanco + "</email>"
        xml += "<cpf>"+cpfBanco+"</cpf>"
        xml += "<tag>sign_RB1</tag>"
        xml += "<tipoASs>ICP</tipoASs>"
        xml += "<ordem>" + ordem + "</ordem>"
        xml += "</signers>"

        xml+= "<signers>"
        xml += "<nome> Testemunha Banco2 </nome>"
        xml += "<email>" + emailBanco2 + "</email>"
        xml += "<cpf>"+cpfBanco2+"</cpf>"
        xml += "<tag>sign_RB2</tag>"
        xml += "<tipoASs>ICP</tipoASs>"
        xml += "<ordem>" + ordem + "</ordem>"
        xml += "</signers>"

        return xml
    }
    function maketable(array, anchor, ordem, nome) {
        let xml = ""
        let indexFull = 1
    
        array.forEach((element, index) => {
            if (index > 0) {
                let representantes = Array.from(element.children[1].children[1].children)
                console.log("TESTEE", representantes)
    
                representantes.forEach((el, i) => {
                    xml += "<signers>"
                    let cpf = el.children[1].children[1].value
                    let email = el.children[2].children[1].value
                    let tipoASs = el.children[3].children[0].children[1].children[0].value
                    let tag = anchor + (indexFull)
                    xml += "<nome>" + nome + indexFull + "</nome>"
                    xml += "<email>" + email + "</email>"
                    xml += "<cpf>" + cpf + "</cpf>"
                    xml += "<tag>" + tag + "</tag>"
                    xml += "<tipoASs>" + tipoASs + "</tipoASs>"
                    xml += "<ordem>" + ordem + "</ordem>"
                    console.log(el)
                    xml += "</signers>"
                    indexFull++    
                })
            }
        })
        return xml
    }

    const buttonSave = document.querySelector("#ctl00_MainContent_buttonGroup_btnDone")
    
    function makeXml() {
        try {
            let containerCli = Array.from(document.querySelectorAll("#nome-representante")[0].parentElement.parentElement.parentElement.children)
            let containerAvalistas = Array.from(document.getElementById("avalistas").children)
            let containerTerceiros = Array.from(document.getElementById("terceiros").children)
    
            console.log("CONTAINER", containerCli)
            let xml = "<recipients>"
            xml += maketableCli(containerCli, "sign_RC", 1)
            xml += makeTableBanco(valorContrato, 1)

            xml += maketable(containerTerceiros, "sign_R1TG", 2, "Terceiro Garantidor")
            xml += maketable(containerAvalistas, "sign_R1A", 3, "Avalista")
    
            xml += "</recipients>"
            document.getElementById("xml").value = xml
            return xml
        } catch (error) {
            console.log(error)
        }
    }
    
    window.make = makeXml
    
    function preencherTerceiros(array) {
        array.forEach((el, index) => {
            const clone = document.getElementById("avalistas0").cloneNode(true)
            clone.removeAttribute("hidden")
            let addButton = clone.children[1].children[3].children[0].children[0]
            console.log(el)
            const terceiros = terceiroGarantidor.find(terceiro => terceiro.CPF_CNPJ.replace(/[^\w\s]/gi, '') == el.documentoCliente)
            console.log("NOMWE", terceiros)
            let nome = terceiros.Terceiro_Garantidor_Nome_Razao_Social
            clone.id = nome
            clone.children[0].innerText = nome
            const inputNameList = clone.children[1].children[0].children[0].children[1]
    
            terceirosDIV.appendChild(clone)
            let selectGroups = clone.children[1].children[0].children[0].children[1]
            terceirosDiv = clone.children[1].children[1].id = "gruposTerceirosDiv" + el.documentoCliente
            console.log("TERCEiROS ", terceiros)
            selectGroups.addEventListener("change", function () {
                changeGroups(this, el.agrupamentoRepresentantes, addButton, "tericeiroContainer0", "gruposTerceirosDiv" + el.documentoCliente)
            })
            addButton.addEventListener("click", function (event) {
                console.log(clone)
                const cloneCli = addClient(event, "tericeiroContainer0", true)
    
                console.log("Clone cli", cloneCli)
                cloneCli.setAttribute("style", "margin-bottom: 20px")
    
                addButton.parentElement.parentElement.parentElement.children[1].appendChild(cloneCli)
            })
    
    
            // inputName.addEventListener("blur", preencherAutomatico)
            let representantesTerceiros = el.agrupamentoRepresentantes
    
            preencherLists(representantesTerceiros, inputNameList)
    
        })
    }
    
