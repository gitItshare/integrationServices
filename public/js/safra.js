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
let fakestate = '{"terceiros":[[{"nome":"JOSE MAURICIO DE SOUZA","cpf":"10203062892","email":"andre.cunha@safra.com.br","tipo":"ICP"},{"nome":"PATRICIA ZANINI MERELLO","cpf":"18148332851","email":"andre.cunha@safra.com.br","tipo":"ICP"}],[{"nome":"JOSE MAURICIO DE SOUZA","cpf":"10203062892","email":"andre.cunha@safra.com.br","tipo":"ICP"},{"nome":"JEFFERSON FRANCISCO PEREIRA","cpf":"21842466895","email":"","tipo":"ICP"}]],"avalistas":[[{"nome":"JOSE MAURICIO DE SOUZA","cpf":"10203062892","email":"andre.cunha@safra.com.br","tipo":"ICP"},{"nome":"JEFFERSON FRANCISCO PEREIRA","cpf":"21842466895","email":"","tipo":"ICP"}]],"emitente":[{"nome":"JOSE MAURICIO DE SOUZA","cpf":"10203062892","email":"andre.cunha@safra.com.br","tipo":"ICP"},{"nome":"PATRICIA ZANINI MERELLO","cpf":"18148332851","email":"andre.cunha@safra.com.br","tipo":"ICP"}]}'
const changes = {
	terceiros: [],
	avalistas: [],
	emitente: []
}
let state = {
	terceiros: [],
	avalistas: [],
	emitente: [],
	digitalizacao:"",
}


let workflow = document.querySelector('.page-header').children[1].innerText.split(";");
console.log("wf1", workflow)
workflow = workflow[1].split("|");
// Remoção espaços
workflow.forEach((item, index) => {
	workflow[index] = item.trim()
});
console.log("wf2", workflow)
document.querySelector('.page-header h2').setAttribute("style", "opacity:0;")
const HOSTNAME = "https://uatna11.springcm.com";
const url = HOSTNAME + '/atlas/Documents/get.ashx/' + workflow[0]
let representanteCli = []
let representantesAvalista = []
let templateField = {}
let avalistaDIV = document.getElementById("avalistas")
let terceirosDIV = document.getElementById("terceiros")
const clientesDiv = document.getElementById("clienteContainer").parentElement
let contadorRepCli = 1
let testemunhaEmitente = ""
let nomeTestemunhaEmitente
let valorContrato = 0
let hasChange = false
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

	let params = x2js.xml2json(response);
	console.log(params)


	let valorContrato = parseInt(params.Params.TemplateFieldData.Valor_unformatted)
	let templateField = params.Params.TemplateFieldData
	let emitente = params.Params.TemplateFieldData.Emitente
	let	terceiroGarantidor = params.Params.TemplateFieldData.Terceiro_Garantidor.Tabela_Terceiro_Garantidor_Container.Tabela_Terceiro_Garantidor
	let createdDate = params.Params.Documents.Document.CreatedDate
	if (terceiroGarantidor.element)
		terceiroGarantidor = terceiroGarantidor.element
	avalistasTable = params.Params.TemplateFieldData.Avalistas.Tabela_Avalistas_Container.Tabela_Avalistas
	if (avalistasTable.element)
		avalistasTable = avalistasTable.element

	if (!Array.isArray(avalistasTable))
		avalistasTable = [avalistasTable]

	if (!Array.isArray(terceiroGarantidor))
		terceiroGarantidor = [terceiroGarantidor]

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

			if(workflow[1] && !workflow[2] && !workflow[3]) checkParameters1()
			if(workflow[2] && !workflow[3]) checkParameters2()
			if(workflow[3]) checkParameters3()
			makeXml(params)
			saveState()
		})

		let {
			data
		} = JSON.parse(res)
		console.log("RESS", res)
		console.log("DATAA", data)
		let representanteCli = data.find(el => ((el.documentoCliente == emitente.Emitente_CNPJ.replace(/[^\w\s]/gi, '')) && el.funcao == "CLIENTE"))
		console.log("REPRESENTNTE", representanteCli)
		document.getElementById("hasChangeCli").parentElement.children[2].insertAdjacentHTML("afterEnd", `<a hidden>${representanteCli.objetoConsultado}</a>`)
		representanteCli = representanteCli.agrupamentoRepresentantes
		console.log(avalistasTable)
		let avalistasCNPJ = avalistasTable.map(el => el.Avalistas_CPF_CNPJ.replace(/[^\w\s]/gi, ''))
		let avalistas = data.filter((el,i) => (avalistasCNPJ.includes(el.documentoCliente) && el.funcao.includes("AVALISTA")))
		let terceirosCNPJ = terceiroGarantidor.map(el => el.CPF_CNPJ.replace(/[^\w\s]/gi, ''))
		let terceiros = data.filter((el,i) => (terceirosCNPJ.includes(el.documentoCliente)) && el.funcao.includes( "TERCEIRO"))
		console.log("AQUIII", terceiros,avalistas,representanteCli)

		if(!terceiros[0].documentoCliente)
			document.getElementById("terceiros").setAttribute("hidden", true)
		if(!avalistas[0].documentoCliente)
			document.getElementById("avalistas").setAttribute("hidden", true)
		if(!workflow[2]){
			document.getElementById("numCedente").setAttribute("readOnly", true)
			document.getElementById("segmentoSolicitante").setAttribute("readOnly", true)
		}

		clientGrupos.addEventListener("change", function () {
			changeGroups(this, representanteCli, buttonCli, "clienteContainer0", "gruposDiv", "emitente")
			clientGrupos.options[0].selected = true;
			// to do
			removeStatusAndComments(clientGrupos)
		})
		console.log(terceiros)
		preencherTabela(templateField, createdDate)
		preencherLists(representanteCli, clientGrupos)
		preencherAvalistas(avalistas,avalistasTable)
		preencherTerceiros(terceiros,terceiroGarantidor)

		if(workflow[2] && !workflow[3]){
			preencherRevisao()
			document.getElementById("statusDIV").removeAttribute("hidden")
		}else if(workflow[3]){
			preencherRevisao()
		}

		if(workflow[1] && !workflow[2] && !workflow[3]) fixInputs1()
		if(workflow[2] && !workflow[3]) fixInputs2()
		if(workflow[3]) fixInputs3()
	})
})

function preencherRevisao () {
	const url = HOSTNAME + '/atlas/Documents/get.ashx/' + workflow[2]
	console.log(url)

	$.ajax({
		url: url,
		method: 'GET',
		headers: {
			'Accept': '*/*'
		},
		dataType: 'text'
	}).done(res => {
		let sxform = JSON.parse(res)
		console.log("DATAA", sxform)
		sxform.forEach(el => {
			if(el.HtmlId ==  "clientGrupos"){
				let clientGroups = document.getElementById(el.HtmlId)
				clientGroups.value = el.HtmlValue
			}

			if(el.HtmlId == "avalistasGroups"){
				let qtd = el.HtmlValue.split(",")
				console.log("ARRAY", qtd)
				qtd.forEach((value, index) =>{
					let campos = document.querySelectorAll("#"+el.HtmlId)
					console.log("VALUE", value)
					if(campos[index]){
						campos[index].value = value
					}
				})
			}

			if(el.HtmlId == "terceirosGroups"){
				let qtd = el.HtmlValue.split(",")
				console.log("ARRAY", qtd)
				qtd.forEach((value, index) =>{
					let campos = document.querySelectorAll("#"+el.HtmlId)
					console.log("VALUE", value)
					if(campos[index]){
						campos[index].value = value
					}
				})
			}

			if(el.HtmlId == "state"){
				preencherState(el.HtmlValue)
			}
			if(el.HtmlId == "numDigital"){
				document.getElementById("numDigital").value = el.HtmlValue
			}
			if(el.HtmlId == "ted"){
				document.getElementById("ted").click()
			}
		})

		createInputEvents()

		function preencherState (statesxform){
			let json = JSON.parse(statesxform)
			console.log("SXFORM", statesxform)
			console.log("SXFORM JSON", json)

			if(json.tipoAssinatura === "manual") {
				document.getElementById("tipoAssinatura").value = "manual"
				document.getElementById("destinatario").value = json.destinatario
				document.getElementById("idDestinatario").removeAttribute("hidden")
			} else {
				document.getElementById("tipoAssinatura").value = "digital"
				document.getElementById("idDestinatario").setAttribute("hidden", true)
			}

			if(workflow[2] && !workflow[3]) fixInputs2()
			
			if(workflow[3]){
				document.getElementById("statusDIV").setAttribute("hidden", true)
				document.getElementById("tipoCt").removeAttribute("hidden")

				let arrayContainerStatus = Array.from(document.querySelectorAll(".containerStatus"))
				arrayContainerStatus.forEach(el => {
					console.log("AQUIIII", el)
					el.children[1].setAttribute("readOnly", true)
					el.children[2].setAttribute("readOnly", true)
				})
			} else {
				document.getElementById("tipoCt").removeAttribute("hidden")
			}
			if(!json.emitente[0]){
				buttonCli.parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
			}
			document.getElementById("numDigital").value = json.digitalizacao
			json.emitente.forEach(el => {
				
				if(el){
					const clone = addClient(null, "clienteContainer0", el, "emitente")
					buttonCli.parentElement.parentElement.parentElement.children[1].appendChild(clone)
					buttonCli.parentElement.parentElement.children[2].removeAttribute("hidden")
					buttonCli.parentElement.parentElement.children[2].children[1].value = el.status
					buttonCli.parentElement.parentElement.children[2].children[2].value = el.comentario
					buttonCli.parentElement.parentElement.children[2].children[4].value = el.comentarioMO

					if(!workflow[3]){
						let container = Array.from(buttonCli.parentElement.parentElement.parentElement.children[1].children)
						container.forEach(element => {
							console.log("EL", element)
							element.children[0].children[1].setAttribute("readOnly", true)
							element.children[1].children[1].setAttribute("readOnly", true)
							element.children[2].children[1].setAttribute("readOnly", true)
							element.children[3].children[0].children[1].children[0].setAttribute("readOnly", true)
							element.children[3].children[0].children[2].children[0].setAttribute("hidden", true)
					
							let objeto = document.getElementById("hasChangeCli").parentElement.children[3].innerText
							element.parentElement.parentElement.parentElement.children[2].insertAdjacentHTML("afterbegin", `<div style:"float: right"><b>Objeto consultado:</b> ${objeto}</div>`)

						})
						buttonCli.setAttribute("hidden", true)
						buttonCli.parentElement.parentElement.children[2].children[4].setAttribute("readOnly", true)
						if(el.status == "ok"){
							buttonCli.parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
						}
					}
					if(el.comentario)
						el.hasChange="true"
					if((el.hasChange.trim() != "true") && workflow[3] != "voltou"){
						buttonCli.parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
					}
				} else {
					buttonCli.parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
				}
			})
			json.avalistas.forEach((el, index) => {
				el.forEach(element => {
					const clone = addClient(null, "tericeiroContainer0", element, "avalistas")
					let button= document.querySelectorAll("#addRepCli-avalista")
					button[index].parentElement.parentElement.parentElement.children[1].appendChild(clone)
					button[index].parentElement.parentElement.children[2].removeAttribute("hidden")
					button[index].parentElement.parentElement.children[2].children[1].value = element.status
					button[index].parentElement.parentElement.children[2].children[2].value = element.comentario
					button[index].parentElement.parentElement.children[2].children[4].value = element.comentarioMO
					if(element.comentario)
						element.hasChange="true"
					console.log("STATUS", element.status)
			   
					if(element.hasChange.trim() != "true" && workflow[3] != "voltou"){
						button[index].parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
					}
					if(!workflow[3]){
						let container = Array.from(button[index].parentElement.parentElement.parentElement.children[1].children)
						container.forEach(el => {
							el.children[0].children[1].setAttribute("readOnly", true)
							el.children[1].children[1].setAttribute("readOnly", true)
							el.children[2].children[1].setAttribute("readOnly", true)
							el.children[3].children[0].children[1].children[0].setAttribute("readOnly", true)
							el.children[3].children[0].children[2].children[0].setAttribute("hidden", true)
							console.log("ELLLL",el.parentElement.parentElement.parentElement.children[1])
							let objeto = el.parentElement.parentElement.parentElement.children[1].children[2].children[3].innerHTML
							el.parentElement.parentElement.parentElement.children[1].insertAdjacentHTML("afterbegin", `<div style:"float: right"><b>Objeto consultado:</b> ${objeto}</div>`)
						})
						button[index].setAttribute("hidden", true)
						button[index].parentElement.parentElement.children[2].children[4].setAttribute("readOnly", true)
						if(element.status == "ok"){
							button[index].parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
						}
					}
				})

			})
			json.terceiros.forEach((el, index) => {
				el.forEach(element => {
					const clone = addClient(null, "tericeiroContainer0", element, "terceiros")
					let button= document.querySelectorAll("#addRepCli-terceiros")
					button[index].parentElement.parentElement.parentElement.children[1].appendChild(clone)
					button[index].parentElement.parentElement.children[2].removeAttribute("hidden")
					button[index].parentElement.parentElement.children[2].children[1].value = element.status
					button[index].parentElement.parentElement.children[2].children[2].value = element.comentario
					button[index].parentElement.parentElement.children[2].children[4].value = element.comentarioMO

					console.log("STATUS", element.status)

					if(element.comentario)
						element.hasChange="true"

					 if(element.hasChange.trim() != "true" && workflow[3] != "voltou"){
						button[index].parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
					}
					if(!workflow[3]){
						let container = Array.from(button[index].parentElement.parentElement.parentElement.children[1].children)
						container.forEach(el => {
							el.children[0].children[1].setAttribute("readOnly", true)
							el.children[1].children[1].setAttribute("readOnly", true)
							el.children[2].children[1].setAttribute("readOnly", true)
							el.children[3].children[0].children[1].children[0].setAttribute("readOnly", true)
							el.children[3].children[0].children[2].children[0].setAttribute("hidden", true)
							console.log("ELLLL",el)
							let objeto = el.parentElement.parentElement.parentElement.children[1].children[2].children[3].innerHTML
							el.parentElement.parentElement.parentElement.children[1].insertAdjacentHTML("afterbegin", `<div style:"float: right"><b>Objeto consultado:</b> ${objeto}</div>`)

						})

						button[index].setAttribute("hidden", true)
						button[index].parentElement.parentElement.children[2].children[4].setAttribute("readOnly", true)
						if(element.status == "ok"){
							button[index].parentElement.parentElement.parentElement.parentElement.setAttribute("hidden", true)
						}
					}
				})
	  
			})

			if(workflow[3]) fixInputs3()
		}
	})
}

function addClient(event, id, representante = {}, change, noSave) {
	try {

		var count = 0
		changes[change].forEach(item => {
			if(item.metodo === "inseriu") count++
		})
		if(count >= 10) {
			alert("Atenção! Excedida a quantidade máxima de inserções.")
			return null
		}

		let clone = document.getElementById(id).cloneNode(true)

		if (representante.nome) {
			clone.children[0].children[1].value = representante.nome
			clone.children[1].children[1].value = representante.documento || representante.cpf
			clone.children[2].children[1].value = representante.emailContatoAssinatura || representante.email
			clone.children[3].children[0].children[1].children[0].value = representante.tipo || "ICP"
		}
		// console.log("aQUIIII", clone.children[2].children[0].children[2].children[0])
		clone.removeAttribute("hidden")

		let buttomremove = clone.children[3].children[0].children[2].children[0]
		buttomremove.addEventListener("click", (event) => {
			console.log("REMOVENDO", change)
			remove(event, change)
		})
		clone.children[0].children[1].addEventListener("blur", preencherAutomatico)
		contadorRepCli++
		clone.id = "representante" + contadorRepCli
		console.log("adcioonando", clone)
		 clone.children[1].children[1].id = new Date().getTime() + change + "cnpj"
		if(noSave){
			clone.children[0].children[1].setAttribute("readOnly", true)
			clone.children[1].children[1].setAttribute("readOnly", true)
		}
		if(change && !noSave)
			changes[change].push({metodo:"inseriu", cnpj: clone.children[1].children[1].id, nome: clone.children[0].children[1].id})
		console.log("CHANGES", changes, change)

		return clone

	} catch (error) {
		console.log(error)
	}
}

function remove(event, change) {
	let self = event.target
	const container = self.parentElement.parentElement.parentElement.parentElement
	if(change)
		changes[change].push({metodo:"removeu", cnpj: container.children[1].children[1].value, nome: container.children[0].children[1].value})
	console.log("CHANGES", container.parentElement)
	container.parentElement.parentElement.children[2].children[1].innerText = true
	document.getElementById("tipoCt").removeAttribute("hidden")

	container.remove()
	scrollToTop();
}

buttonCli.addEventListener("click", function (event) {
	const clone = addClient(event, "clienteContainer0", {}, "emitente")
	buttonCli.parentElement.parentElement.parentElement.children[1].appendChild(clone)
	let parentElement = buttonCli.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[1].innerText = true
	document.getElementById("tipoCt").removeAttribute("hidden")
	console.log("test", parentElement)
})

let changeGroups = (self, representantesArray, button, idContainer, gruposDiv, change) => {
	console.log("REPRESENTANTES ", button.parentElement.parentElement.parentElement.children.length)
	if (button.parentElement.parentElement.parentElement.children.length >= 3) {
		button.parentElement.parentElement.parentElement.children[1].innerHTML = ""
	}
	button.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[1].innerText = false

	let value = self.value
	let condEespecial = self.options[self.selectedIndex].getAttribute("condeespecial")
	let label = self.parentElement.children[0]
	if (condEespecial == "true"){
		label.innerHTML = '<p style="color:tomato">Grupos Condicao Especial</p>'
		button.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[1].innerText = true
		document.getElementById("tipoCt").removeAttribute("hidden")
	}
	else{
		button.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[1].innerText = false
		label.innerHTML = '<p>Grupos</p>'
		document.getElementById("tipoCt").setAttribute("hidden", true)
	}

	console.log("ARRAYY", representantesArray)
	let representantes = representantesArray.find(el => el.nomeAgrupamento == self.value).representantes

	console.log("REP0 ", representantes)

	representantes.forEach(representante => {
		const clone = addClient(null, idContainer, representante, change, true)
		document.getElementById(gruposDiv).appendChild(clone)
	})


}

document.getElementById("nome-representante").addEventListener("blur", preencherAutomatico)
document.getElementById("nome-representante-terceiros").addEventListener("blur", preencherAutomatico)
document.getElementById("tipoAssinatura").addEventListener("change", function () {
	renderChangesSignatureType()
})

function renderChangesSignatureType() {
	var select = document.getElementById("tipoAssinatura")
	if (select.value == "manual") {
		document.getElementById("idDestinatario").removeAttribute("hidden")
		document.querySelectorAll("#gruposDiv").forEach((element) => {
			document.querySelectorAll(".row").forEach((element) => {
				element.querySelectorAll(".form-group").forEach((column, index) => {
					column.classList.remove("d-none")
					column.classList.remove("col-sm-6")
					column.classList.remove("col-sm-3")
					column.classList.add("col-sm-4")
					if(index == "2") {
						column.classList.add("d-none")
					}
					if(index == "3"){
						column.children[0].children[0].classList.add("d-none")
						column.children[0].children[1].classList.add("d-none")
						column.children[0].children[2].style = "margin-top: 45px"
					}
				})
			})
		})
	} else {
		document.getElementById("idDestinatario").setAttribute("hidden", true)

		document.querySelectorAll("#gruposDiv").forEach((element) => {
			document.querySelectorAll(".row").forEach((element) => {
				element.querySelectorAll(".form-group").forEach((column, index) => {
					column.classList.remove("d-none")
					column.classList.remove("col-sm-4")
					column.classList.remove("col-sm-3")
					column.classList.remove("col-sm-6")
					column.classList.add("col-sm-3")
					if(index == "3"){
						column.children[0].children[0].classList.remove("d-none")
						column.children[0].children[1].classList.remove("d-none")
						column.children[0].children[2].style = "margin-top: 0px"
					}
				})
			})
		})
	}
}

function preencherAutomatico() {
	console.log(this.parentElement.parentElement.parentElement.parentElement)
	let value = this.value
	let cpf = this.parentElement.parentElement.children[1].children[1]
	let email = this.parentElement.parentElement.children[2].children[1]
	let label = this.parentElement.parentElement.children[0].children[0]
	console.log("LABEELL", label)
	const options = Array.from(clientList.options).find(el => el.value == value)
	if(options){
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

}

function preencherLists(array, listName, listEmail, listCpf) {
	console.log("ARRAyy", array)
	array.forEach((el, index) => {
		listName.innerHTML += `<option condEespecial="${el.indicadorCondicaoEspecial}" name="${index}" value="${el.nomeAgrupamento
					}">${el.nomeAgrupamento
					}</option>`
	})
}

function preencherAvalistas(avalistas, avalistasTable) {
	avalistas.forEach((el, index) => {
		const clone = document.getElementById("avalistas0").cloneNode(true)
		clone.removeAttribute("hidden")
		let addButton = clone.children[1].children[2].children[0].children[0]
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
		addButton.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[2].insertAdjacentHTML("afterEnd", `<a hidden>${el.objetoConsultado}</a>`)

		selectGroups.addEventListener("change", function () {
			changeGroups(this, el.agrupamentoRepresentantes, addButton, "avalistaContainer0", "gruposAvalistaDiv" + el.documentoCliente, "avalistas")

			selectGroups.options[0].selected = true;

			// to do
			removeStatusAndComments(selectGroups)
		})

		addButton.addEventListener("click", function (event) {
			console.log(clone)
			document.getElementById("tipoCt").removeAttribute("hidden")

			const cloneCli = addClient(event, "avalistaContainer0", {}, "avalistas")

			console.log("Clone cli", cloneCli)
			cloneCli.setAttribute("style", "margin-bottom: 20px")

			addButton.parentElement.parentElement.parentElement.children[1].appendChild(cloneCli)
			addButton.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[1].innerText = true
		})


		// inputName.addEventListener("blur", preencherAutomatico)
		let representantesAvalista = el.agrupamentoRepresentantes

		preencherLists(representantesAvalista, inputNameList)

	})
}

function maketableCli(array, anchor, ordem, params) {
	let xml = ""
	console.log("AAAAAAAAAAAAAAAAAA", params)
	let testemunhaEmitente = params.Params.Documents.Document.CreatedBy
	let testemunhaEmitenteNome = params.Params.Documents.Document.UpdatedBy
	let grupoTestemunhas = params.Params.TemplateFieldData.Documents.Document.Cadastro
	let razao = params.Params.TemplateFieldData.Emitente.Emitente_Razao_Social
	array.forEach((el, index) => {
		xml += "<signers>"
		let nome = el.children[0].children[1].value
		let cpf = el.children[1].children[1].value
		let email = el.children[2].children[1].value
		let tipoASs = el.children[3].children[0].children[1].children[0].value
		let tag = anchor + (index + 1)
		xml += "<role>Emitente" + (index + 1) + "</role>"
		xml += "<nome>" + nome + "</nome>"
		xml += "<razaoSocial>" + razao + "</razaoSocial>"
		xml += "<email>" + email + "</email>"
		xml += "<cpf>" + cpf + "</cpf>"
		xml += "<tag>" + tag + "</tag>"
		xml += "<tipoASs>" + tipoASs + "</tipoASs>",
		xml += "<ordem>" + 2 + "</ordem>"

		console.log(el)
		xml += "</signers>"
	})
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	  }
	let lenghtGrupo = grupoTestemunhas.Nome.length
	
	let randomIndex = getRandomInt(lenghtGrupo)
	if(lenghtGrupo == 1){
		randomIndex = 0
	}
	console.log("RANDOM INDEX", grupoTestemunhas)
	let nomeTest = grupoTestemunhas.Nome[randomIndex]
	let emailTest = grupoTestemunhas.Email[randomIndex]

	xml += "<signers>"
	xml += "<nome>"+nomeTest["__text"]+"</nome>"
	xml += "<role> Testemunha Emitente2 </role>"
	xml += "<email>" + emailTest["__text"] + "</email>"
	xml += "<cpf></cpf>"
	xml += "<tag>sign_T2</tag>"
	xml += "<tipoASs>DS ELETRONIC</tipoASs>"
	xml += "<ordem>" + 1 + "</ordem>"
	xml += "</signers>"

	xml += "<signers>"
	xml += "<nome>"+ testemunhaEmitenteNome + "</nome>"
	xml += "<role> Testemunha Emitente </role>"
	xml += "<email>" + testemunhaEmitente + "</email>"
	xml += "<cpf></cpf>"
	xml += "<tag>sign_T1</tag>"
	xml += "<tipoASs>DS ELETRONIC</tipoASs>"
	xml += "<ordem>" + 1 + "</ordem>"
	xml += "</signers>"
	
	xml += "<signers>"
	xml += "<nome> Validador Backoffice </nome>"
	xml += "<role> Validador Backoffice </role>"
	xml += "<email>docusignbo@safra.com.br</email>"
	xml += "<cpf></cpf>"
	xml += "<tag>sign_T1</tag>"
	xml += "<tipoASs>validador</tipoASs>"
	xml += "<ordem>" + 3 + "</ordem>"
	xml += "</signers>"

	return xml
}

function makeTableBanco(valor, ordem) {
	let emailBanco = ""
	let cpfBanco = ""
	let emailBanco2 = ""
	let cpfBanco2 = ""
	let nome1 = ""
	let nome2 = ""
	let xml = ""
	if (valor <= 15000) {
		emailBanco = "vanessa.menezes@safra.com.br"
		cpfBanco = "26749486800"
		nome1 = "Vanessa Menezes"
		emailBanco2 = "roberto.capel@safra.com.br"
		cpfBanco2 = "16651816802"
		nome2 = "Roberto Capel"
	} else if (valor <= 50000 && valor > 15000) {
		emailBanco = "ciro.silva@safra.com.br"
		cpfBanco = "21839585889"
		nome1 = "Ciro Silva"
		emailBanco2 = "jose.galvao@safra.com.br"
		cpfBanco2 = "3584638828"
		nome2 = "Jose Galvao"
	} else if (valor <= 200000 && valor > 50000) {
		emailBanco = "ciro.silva@safra.com.br"
		cpfBanco = "21839585889"
		nome1 = "Ciro Silva"
		emailBanco2 = "marcio.nobrega@safra.com.br"
		cpfBanco2 = "08594753870"
		nome2 = "Marcio Nobrega"
	} else if (valor > 200000) {
		emailBanco = "agostinho.stefanelli@safra.com.br"
		cpfBanco = "05782565845"
		nome1 = "Agostinho Stefanelli"
		emailBanco2 = "marcos.monteiro@safra.com.br"
		cpfBanco2 = "10510942830"
		nome2 = "Marcos Monteiro"
	}

	xml += "<signers>"
	xml += "<nome>" + nome1 + "</nome>"
	xml += "<role> Banco </role>"
	xml += "<email>" + emailBanco + "</email>"
	xml += "<cpf>" + cpfBanco + "</cpf>"
	xml += "<tag>sign_RB1</tag>"
	xml += "<tipoASs>ICP</tipoASs>"
	xml += "<ordem>" + 4 + "</ordem>"
	xml += "</signers>"

	xml += "<signers>"
	xml += "<nome>" + nome2 + "</nome>"
	xml += "<role> Banco2 </role>"
	xml += "<email>" + emailBanco2 + "</email>"
	xml += "<cpf>" + cpfBanco2 + "</cpf>"
	xml += "<tag>sign_RB2</tag>"
	xml += "<tipoASs>ICP</tipoASs>"
	xml += "<ordem>" + 4 + "</ordem>"
	xml += "</signers>"

	return xml
}

function maketable(array, anchor, ordem, role) {
	let xml = ""
	let indexFull = 1
	
	array.forEach((element, index) => {
		if (index > 0) {
			let representantes = Array.from(element.children[1].children[1].children)
			console.log("TESTEE", representantes)

			representantes.forEach((el, i) => {
				let razao = el.parentElement.parentElement.parentElement.id
				console.log(el)
				xml += "<signers>"
				let nome = el.children[0].children[1].value
				let cpf = el.children[1].children[1].value
				let email = el.children[2].children[1].value
				let tipoASs = el.children[3].children[0].children[1].children[0].value
				let tag = "sign_R"+ (i+1) + anchor + (index)
				xml += "<role>" + role + (i+1) + "</role>"
				xml += "<nome>" + nome + "</nome>"
				xml += "<razaoSocial>" + razao + "</razaoSocial>"
				xml += "<email>" + email + "</email>"
				xml += "<cpf>" + cpf + "</cpf>"
				xml += "<tag>" + tag + "</tag>"
				xml += "<tipoASs>" + tipoASs + "</tipoASs>"
				xml += "<ordem>" + 2 + "</ordem>"
				console.log(el)
				xml += "</signers>"
				indexFull++
			})
		}
	})
	return xml
}

const buttonSave = document.querySelector("#ctl00_MainContent_buttonGroup_btnDone")

function makeXml(params) {
	try {
		let containerCli = Array.from(document.querySelectorAll("#nome-representante")[0].parentElement.parentElement.parentElement.children)
		let containerAvalistas = Array.from(document.getElementById("avalistas").children)
		let containerTerceiros = Array.from(document.getElementById("terceiros").children)
		let template = params.Params.TemplateFieldData
		let emitente = params.Params.TemplateFieldData.Emitente
		console.log("CONTAINER", containerCli)
		let xml = "<recipients>"
		xml += maketableCli(containerCli, "sign_RC", 1,params)
		xml += makeTableBanco(valorContrato, 1)

		xml += maketable(containerTerceiros, "TG", 2, "Terceiro Garantidor", params)
		xml += maketable(containerAvalistas, "A", 3, "Avalista", params)
		xml+= `<seguroPrestamista>${template.Geral_Info.DeclacaoDeSaude}</seguroPrestamista>`
		xml+= `<agencia>${emitente.Emitente_Agencia}</agencia>`
		xml+= `<nomeCli>${emitente.Emitente_Razao_Social}</nomeCli>`
		xml+= `<cnpjCli>${emitente.Emitente_CNPJ}</cnpjCli>`
		xml+= `<numContrato>${template.Num_Contrato}</numContrato>`
		xml += "</recipients>"
	

		document.getElementById("xml").value = xml
		let changesXml = saveChanges()
		document.getElementById("changeXml").value = changesXml

		return xml
	} catch (error) {
		console.log(error)
	}
}

window.make = makeXml

function preencherTerceiros(array,terceiroGarantidor) {
	array.forEach((el, index) => {
		const clone = document.getElementById("avalistas0").cloneNode(true)
		clone.removeAttribute("hidden")
		let addButton = clone.children[1].children[2].children[0].children[0]
		addButton.id = "addRepCli-terceiros"
		let comentarios = addButton.parentElement.parentElement.children[2].children[1]
		comentarios.id = "statusComentTerc"
		comentarios.setAttribute("name", "__sxformcustom_statusComentTerc_sxformcustom__")
		let status = addButton.parentElement.parentElement.children[2].children[0] 
		status.id= "statusTerc"
		status.setAttribute("name", "__sxformcustom_statusTerc_sxformcustom__")
		console.log(el)

		console.log("TERCEIRO TEST", terceiroGarantidor)

		const terceiros = terceiroGarantidor.find(terceiro => terceiro.CPF_CNPJ.replace(/[^\w\s]/gi, '') == el.documentoCliente)
		console.log("NOMWE", terceiros)
		let nome = terceiros.Terceiro_Garantidor_Nome_Razao_Social
		
		clone.id = nome
		clone.children[0].innerText = nome
		const inputNameList = clone.children[1].children[0].children[0].children[1]
		addButton.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[2].insertAdjacentHTML("afterEnd", `<a hidden>${el.objetoConsultado}</a>`)

		terceirosDIV.appendChild(clone)

		let selectGroups = clone.children[1].children[0].children[0].children[1]
		selectGroups.id = "terceirosGroups"
		selectGroups.setAttribute("name", "__sxformcustom_terceirosGroups_sxformcustom__")
		terceirosDiv = clone.children[1].children[1].id = "gruposTerceirosDiv" + el.documentoCliente
		console.log("TERCEiROS ", terceiros)
		selectGroups.addEventListener("change", function () {
			changeGroups(this, el.agrupamentoRepresentantes, addButton, "tericeiroContainer0", "gruposTerceirosDiv" + el.documentoCliente, "terceiros")

			selectGroups.options[0].selected = true;

			// to do
			removeStatusAndComments(selectGroups)
		})
		addButton.addEventListener("click", function (event) {
			document.getElementById("tipoCt").removeAttribute("hidden")

			console.log(clone)
			const cloneCli = addClient(event, "tericeiroContainer0", {}, "terceiros")

			console.log("Clone cli", cloneCli)
			cloneCli.setAttribute("style", "margin-bottom: 20px")

			addButton.parentElement.parentElement.parentElement.children[1].appendChild(cloneCli)
			addButton.parentElement.parentElement.parentElement.children[1].parentElement.children[2].children[1].innerText = true
		})


		// inputName.addEventListener("blur", preencherAutomatico)
		let representantesTerceiros = el.agrupamentoRepresentantes

		preencherLists(representantesTerceiros, inputNameList)

	})
}

function preencherTabela(templateField, createdDate) {

	document.getElementById("codigoNomeAgencia").innerText = templateField.Emitente.Emitente_Agencia
	document.getElementById("nomeCli").innerText = templateField.Emitente.Emitente_Razao_Social
	document.getElementById("clienteRazaoSocial").innerHTML = "&nbsp; " + templateField.Emitente.Emitente_Razao_Social
	
	document.getElementById("valor").innerText = templateField.Valor
	document.getElementById("numDigital").value = ""
	document.getElementById("numCt").innerText = templateField.Num_Contrato
	document.getElementById("numCedente").value = templateField.Formulario_para_upload_Legado_Cedente || ""

	if(templateField.Geral_Info)
		document.getElementById("segmentoSolicitante").value = templateField.Geral_Info.Cliente_Segmento

	let geralInfo = templateField.Geral_Info
	let dataEmissao = new Date(templateField["Data_da_emissao_unformatted"])
	let hoje = new Date(createdDate)
	let dolarizada = ["6307", "6308"]
	let cessao = ["3336", "33333", "33332", "3313", "2542"]
	let header = document.querySelector("#ctl00_MainContent_ContentHeader").children[0].innerText
	let garantia = templateField.Garantia_Cod

	 if (dataEmissao < hoje){
		if(dataEmissao.getDate() < hoje.getDate())
			document.getElementById("Retroativa").setAttribute("checked", true)
		if(dataEmissao.getMonth() <= hoje.getMonth())
			document.getElementById("Retroativa").setAttribute("checked", true)
		if(dataEmissao.getFullYear() <= hoje.getFullYear())
			document.getElementById("Retroativa").setAttribute("checked", true)
		else
			document.getElementById("Retroativa").removeAttribute("checked")
	 }else {
			document.getElementById("Retroativa").removeAttribute("checked")
	 }
	 
	 if(dataEmissao.getDate() == hoje.getDate() && dataEmissao.getMonth() == hoje.getMonth() && dataEmissao.getFullYear() <= hoje.getFullYear())
		document.getElementById("Retroativa").removeAttribute("checked")
	 
	if (geralInfo) {
		if (dolarizada.includes(templateField.Geral_Info.Cliente_Modalidade["_key"]))
			document.getElementById("Dolarizada").setAttribute("checked", true)
		else if (cessao.includes(templateField.Geral_Info.Cliente_Modalidade["_key"]))
			document.getElementById("cessao").setAttribute("checked", true)
	} 

	if (garantia == "14")
		document.getElementById("Dividendos").setAttribute("checked", true)
}

function saveChanges() {
	let xml = "<changes>"
	function make(el){
		let cnpj = document.getElementById(el.cnpj)
		let nome = document.getElementById(el.nome)
		let change = el.metodo
		xml += "<tipo>"+ change +"</tipo>"
		if(cnpj){
			xml += "<cnpj>"+ cnpj.value +"</cnpj>"
			xml += "<nome>"+ nome.value +"</nome>"

		}
		else{
			xml += "<cnpj>"+ el.cnpj +"</cnpj>"
			xml += "<nome>"+ el.nome +"</nome>"
		}

	}
	changes.emitente.forEach(el => {
		xml +="<change>"
		make(el)
		xml +="</change>"

	})
	changes.avalistas.forEach(el => {
		xml +="<change>"
		make(el)
		xml +="</change>"

	})
	changes.terceiros.forEach(el => {
		xml +="<change>"
		make(el)
		xml +="</change>"
	})
	 xml += "</changes>"
	return xml
}

function saveState(){       
	let clienteContainer = Array.from(document.getElementById("gruposDiv").children)
	let clientState = []
	console.log("ALTEREI POHA", document.getElementById("gruposDiv").parentElement.children[2].children[1].innerText)
	if( document.getElementById("gruposDiv").parentElement.children[2].children[2].children[1].value == "nao" && document.getElementById("gruposDiv").parentElement.children[2].children[1].innerText.trim() == "inicial"){
		document.getElementById("gruposDiv").parentElement.children[2].children[1].innerText = "true"
	}
	clienteContainer.forEach(el => {
		clientState.push({
			nome: el.children[0].children[1].value,
			cpf: el.children[1].children[1].value,
			email: el.children[2].children[1].value,
			tipo: el.children[3].children[0].children[1].children[0].value,
			hasChange: document.getElementById("gruposDiv").parentElement.children[2].children[1].innerText,
			status: document.getElementById("gruposDiv").parentElement.children[2].children[2].children[1].value,
			comentario: document.getElementById("gruposDiv").parentElement.children[2].children[2].children[2].value,
			comentarioMO: document.getElementById("gruposDiv").parentElement.children[2].children[2].children[4].value
		})

	})

	let terceiros = Array.from(document.getElementById("terceiros").children)
	let terceiroState = []
	terceiros.forEach((el, index)=> {
		if(index > 0){
			let terceirosContainer = Array.from(el.children[1].children[1].children)            
			let mapped = []
			if( el.children[1].children[2].children[2].children[1].value == "nao" && el.children[1].children[1].parentElement.children[2].children[1].innerText.trim() == "inicial"){
				document.getElementById("gruposDiv").parentElement.children[2].children[1].innerText = "true"
			}
			terceirosContainer.forEach(container => {

					mapped.push({
						nome: container.children[0].children[1].value,
						cpf: container.children[1].children[1].value,
						email: container.children[2].children[1].value,
						tipo: container.children[3].children[0].children[1].children[0].value,
						hasChange: el.children[1].children[1].parentElement.children[2].children[1].innerText,
						status: el.children[1].children[2].children[2].children[1].value,
						comentario: el.children[1].children[2].children[2].children[2].value,
						comentarioMO: el.children[1].children[2].children[2].children[4].value

					})
		
			})
			terceiroState.push(mapped)
		}
	})
	let avalistas = Array.from(document.getElementById("avalistas").children)
	let avalistaState = []
	avalistas.forEach((el, index)=> {

		if(index > 0){
			if( el.children[1].children[2].children[2].children[1].value == "nao" && el.children[1].children[1].parentElement.children[2].children[1].innerText.trim() == "inicial"){
				el.children[1].children[1].parentElement.children[2].children[1].innerText = "true"
			}
			let avalistaContainer = Array.from(el.children[1].children[1].children)
			let mapped = []

			avalistaContainer.forEach(container => {
					mapped.push({
						nome: container.children[0].children[1].value,
						cpf: container.children[1].children[1].value,
						email: container.children[2].children[1].value,
						tipo: container.children[3].children[0].children[1].children[0].value,
						hasChange: el.children[1].children[1].parentElement.children[2].children[1].innerText,
						status: el.children[1].children[2].children[2].children[1].value,
						comentario: el.children[1].children[2].children[2].children[2].value,
						comentarioMO: el.children[1].children[2].children[2].children[4].value

					})
			})
			avalistaState.push(mapped)
		}
	})
	console.log("avalista", avalistaState)
	console.log("terceiro", terceiroState)
	console.log("cliente", clientState)
	state.digitalizacao = document.getElementById("numDigital").value
	state.avalistas = avalistaState
	state.terceiros = terceiroState
	state.emitente = clientState
	state.tipoAssinatura = document.getElementById("tipoAssinatura").value
	state.destinatario = document.getElementById("destinatario").value
	document.getElementById("state").value = JSON.stringify(state)
}

function fixInputs1() {
	console.log("fixInputs1")

	document.getElementById("numCedente").setAttribute("readOnly", true)
	document.getElementById("numCedente").setAttribute("placeholder", "")

	document.getElementById("fieldset-acao").removeAttribute("hidden")
}

function isSignatureMode(type) {
	return document.getElementById("tipoAssinatura").value == type
}

function checkParameters1() {
	console.log("checkParameters1")
	var errors = []

	// Checagem Ação
	var acaoInput = document.getElementById("acao")
	if(!acaoInput.value) errors.push("Ação inválida")

	if(acaoInput.value !== "voltar") {

		// Checagem Número Digitalização
		const isVisibleFieldset = !document.querySelector("#tipoCt").hasAttribute("hidden")
		if(isVisibleFieldset) {
			var numDigital = document.getElementById("numDigital").value
			if((!numDigital || numDigital == "undefined")) errors.push("Número digitalização inválido")
		}

		// Checagem assinatura
		var signatureMailElem = document.querySelector("#idDestinatario #destinatario")
		var email = signatureMailElem.value
		if(isSignatureMode("manual") && (!email || email == "undefined" || !validateEmail(email))) {
			errors.push("E-mail da assinatura inválido")
		}

	}

	// Checagem se tem algum grupo em Clientes
	let countPeople = 0
	var clienteContainer = Array.from(document.getElementById("gruposDiv").children)
	clienteContainer.forEach((el, index) => {
		var cpf = el.children[1].children[1].value
		var email = el.children[2].children[1].value
		if(!validateCPF(cpf)) errors.push("CPF do cliente inválido (#"+(index + 1)+")")	
		if(isSignatureMode("digital") && (!email || email == "undefined" || !validateEmail(email))) errors.push("E-mail do cliente inválido (#"+(index + 1)+")")
	})
	countPeople = clienteContainer.length
	if(countPeople === 0 && acaoInput.value !== "voltar") {
		errors.push("É necessário inserir algum representante em Clientes")
	}

	// Checagem se tem algum grupo em Terceiros
	var terceiros = Array.from(document.getElementById("terceiros").children)
	terceiros.forEach((el, index)=> {
		if(index > 0) {
			countPeople = 0;
			let terceirosContainer = Array.from(el.children[1].children[1].children)
			terceirosContainer.forEach((container, index2) => {
				countPeople++;
				var cpf = container.children[1].children[1].value
				var email = container.children[2].children[1].value
				if(!validateCPF(cpf)) errors.push("CPF do terceiro inválido (#"+(index2 + 1)+")")
				if(isSignatureMode("digital") && (!email || email == "undefined" || !validateEmail(email))) errors.push("E-mail do terceiro inválido (#"+(index2 + 1)+")")
			})
			if(countPeople === 0 && acaoInput.value !== "voltar") {
				errors.push("É necessário inserir algum representante em Terceiro Garantidor")
			}
		}
	})
	

	// Checagem se tem algum grupo em Avalistas
	var avalistas = Array.from(document.getElementById("avalistas").children)
	avalistas.forEach((el, index)=> {
		if(index > 0) {
			countPeople = 0;
			let avalistaContainer = Array.from(el.children[1].children[1].children)
			avalistaContainer.forEach((container, index2) => {
				countPeople++;
				var cpf = container.children[1].children[1].value
				var email = container.children[2].children[1].value
				if(!validateCPF(cpf)) errors.push("CPF do avalista inválido (#"+(index2 + 1)+")")
				if(isSignatureMode("digital") && (!email || email == "undefined" || !validateEmail(email))) errors.push("E-mail do avalista inválido (#"+(index2 + 1)+")")
			})
			if(countPeople === 0 && acaoInput.value !== "voltar") {
				errors.push("É necessário inserir algum representante em Avalistas")
			}
		}
	})

	showErrors(errors)
}

function fixInputs2() {
	console.log("fixInputs2")

	document.getElementById("numDigital").setAttribute("readOnly", true)

	document.getElementById("numCedente").setAttribute("readOnly", true)
	document.getElementById("numCedente").setAttribute("placeholder", "")

	var tedElem = document.getElementById("ted")
	tedElem.setAttribute("readOnly", true)

	document.getElementById("segmentoSolicitante").setAttribute("readOnly", true)
	document.getElementById("tipoAssinatura").setAttribute("readOnly", true)
	document.getElementById("destinatario").setAttribute("readOnly", true)
	document.getElementById("fieldset-acao").setAttribute("hidden", true)

	// Desabilita adição
	const clientGruposElem = document.querySelectorAll("#clientGrupos")
	const terceirosGroupsElem = document.querySelectorAll("#terceirosGroups")
	const avalistasGroupsElem = document.querySelectorAll("#avalistasGroups")
	clientGruposElem.forEach(element => {
		element.setAttribute("readOnly", true)
	})
	terceirosGroupsElem.forEach(element => {
		element.setAttribute("readOnly", true)
	})
	avalistasGroupsElem.forEach(element => {
		element.setAttribute("readOnly", true)
	})
	
	// Ocultar avais ok



	renderChangesSignatureType()
}

function checkParameters2() {
	console.log("checkParameters2")

	var errors = []

	// Checagem do Número digitalização
	var numDigital = document.getElementById("numDigital").value
	if(!numDigital || numDigital == "undefined") errors.push("Número digitalização inválido")

	// Checagem de status
	const statusElementsArr = []
	document.querySelectorAll("#statusCli").forEach(element => {
		var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
		var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
		if(!isParentContainerHidden && !isParentFieldsetHidden) statusElementsArr.push(element)
	})
	document.querySelectorAll("#statusComentTerc").forEach(element => {
		var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
		var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
		if(!isParentContainerHidden && !isParentFieldsetHidden) statusElementsArr.push(element)
	})
	document.querySelectorAll("#statusAva").forEach(element => {
		var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
		var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
		if(!isParentContainerHidden && !isParentFieldsetHidden) statusElementsArr.push(element)
	})
	statusElementsArr.forEach((element, index) => {
		if(element.value === "" || element.value === "Status") {
			errors.push("Status inválido (#"+(index + 1)+")")
		}
	})

	// Checagem de comentários
	const commentElementsArr = []
	statusComentcliElem = document.querySelectorAll("#statusComentcli")
	statusComentcliElem.forEach(element => {
		var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
		var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
		if(!isParentContainerHidden && !isParentFieldsetHidden) commentElementsArr.push(element)
	})
	statusComentAvaElem = document.querySelectorAll("#statusComentAva")
	statusComentAvaElem.forEach(element => {
		var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
		var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
		if(!isParentContainerHidden && !isParentFieldsetHidden) commentElementsArr.push(element)
	})
	commentElementsArr.forEach((element, index) => {
		if(element.value === "" || element.value === "undefined") {
			errors.push("Comentário FPO inválido (#"+(index + 1)+")")
		}
	})

	// Checagem da Análise Geral
	var status = document.getElementById("status").value
	if(status === "Selecione um grupo" || status === "Selecione um status") errors.push("Análise Geral inválido")
	
	// Exibe alerta de erros
	showErrors(errors)
}

function fixInputs3() {
	console.log("fixInputs3")

	// Número do Cedente não editável e sem placeholder
	document.getElementById("numCedente").setAttribute("readOnly", true)
	document.getElementById("numCedente").setAttribute("placeholder", "")

	// Solicitante não editável
	document.getElementById("segmentoSolicitante").setAttribute("readOnly", true)
	
	// Habilita ação
	document.getElementById("fieldset-acao").removeAttribute("hidden")

	// Oculta status e comentários de FPO em branco
	const containerStatus = document.querySelectorAll(".containerStatus")
	containerStatus.forEach(containerStatusElem => {
		const titleElems = containerStatusElem.querySelectorAll("h3")
		const statusCliElem = containerStatusElem.querySelector("#statusCli")
		const statusComentCliElem = containerStatusElem.querySelector("#statusComentcli")
		const statusComentAvaElem = containerStatusElem.querySelector("#statusComentAva")
		const statusComentTercElem = containerStatusElem.querySelector("#statusComentTerc")
		const statusAvaElem = containerStatusElem.querySelector("#statusAva")

		containerStatusElem.removeAttribute("hidden")
		
		// Se for Cliente
		if(statusCliElem) {
			statusCliElem.removeAttribute("hidden")
			statusComentCliElem.removeAttribute("hidden")
			if(statusCliElem.value === "Status" && statusComentCliElem.value === "") {
				containerStatusElem.setAttribute("hidden", true)
			}
		}

		// Se for Terceiro Garantidor
		if(statusComentTercElem) {
			statusComentTercElem.removeAttribute("hidden")
			statusComentAvaElem.removeAttribute("hidden")
			if(statusComentTercElem.value === "Status" && statusComentAvaElem.value === "") {
				containerStatusElem.setAttribute("hidden", true)
			}
		}

		// Se for Avalistas
		if(statusAvaElem) {
			statusAvaElem.removeAttribute("hidden")
			statusComentAvaElem.removeAttribute("hidden")
			if(statusAvaElem.value === "Status" && statusComentAvaElem.value === "") {
				containerStatusElem.setAttribute("hidden", true)
			}
		}
	})

	// Alterações tipo de assinatura
	renderChangesSignatureType()
}

function checkParameters3() {
	console.log("checkParameters3")
	var errors = []

	// Checagem Ação
	var acaoInput = document.getElementById("acao")
	if(!acaoInput.value) errors.push("Ação inválida")

	// Checagem de comentários
	const commentElementsArr = []
	
	statusComentcliMOElem = document.querySelectorAll("#statusComentcliMO")
	statusComentcliMOElem.forEach((element, index) => {
		if(!element.parentElement.hasAttribute("hidden")) {
			console.log(element, index)

			statusCliElem = element.parentElement.querySelector("#statusCli")

			console.log("statusCliElem", statusCliElem.value)

			if(statusCliElem.value === "nao") {
				var name = element.parentElement.parentElement.parentElement.parentElement.querySelector("#clienteRazaoSocial").innerText
				name = name.trim()
				commentElementsArr.push({
					element, name
				})
			}
		}
	})
	
	statusComentAvaElem = document.querySelectorAll("#statusComentAva")
	statusComentAvaMOElem = document.querySelectorAll("#statusComentAvaMO")
	statusComentAvaMOElem.forEach((element, index) => {
		if(!element.parentElement.hasAttribute("hidden")) {
			console.log(element, index)

			statusComentTercElem = element.parentElement.querySelector("#statusComentTerc")
			statusAvaElem = element.parentElement.querySelector("#statusAva")

			if(statusComentTercElem) {
				console.log("statusComentTercElem", statusComentTercElem.value)
				if(statusComentTercElem.value === "nao") {
					var name = element.parentElement.parentElement.parentElement.parentElement.querySelector("legend.w-auto").innerText
					name = name.trim()
					commentElementsArr.push({
						element, name
					})
				}
			}
			if(statusAvaElem) {
				console.log("statusAvaElem", statusAvaElem.value)
				if(statusAvaElem.value === "nao") {
					var name = element.parentElement.parentElement.parentElement.parentElement.querySelector("legend.w-auto").innerText
					name = name.trim()
					commentElementsArr.push({
						element, name
					})
				}
			}
			
		}
	})
	commentElementsArr.forEach((item, index) => {
		if(item.element.value === "" || item.element.value === "undefined") {
			errors.push("Comentário Middle Office inválido (" + item.name + ")")
		}
	})

	// Checagem assinatura
	var signatureMailElem = document.querySelector("#idDestinatario #destinatario")
	var email = signatureMailElem.value
	if(isSignatureMode("manual") && (!email || email == "undefined" || !validateEmail(email))) {
		errors.push("E-mail da assinatura inválido")
	}

	// Checagem se tem algum grupo em Clientes
	let countPeople = 0
	var clienteContainer = Array.from(document.getElementById("gruposDiv").children)
	clienteContainer.forEach((el, index) => {
		var cpf = el.children[1].children[1].value
		var email = el.children[2].children[1].value
		if(!validateCPF(cpf)) errors.push("CPF do cliente inválido (#"+(index + 1)+")")	
		if(isSignatureMode("digital") && (!email || email == "undefined" || !validateEmail(email))) errors.push("E-mail do cliente inválido (#"+(index + 1)+")")
	})
	countPeople = clienteContainer.length
	if(countPeople === 0 && acaoInput.value !== "voltar") {
		errors.push("É necessário inserir algum representante em Clientes")
	}

	// Checagem se tem algum grupo em Terceiros
	var terceiros = Array.from(document.getElementById("terceiros").children)
	terceiros.forEach((el, index)=> {
		if(index > 0) {
			countPeople = 0;
			let terceirosContainer = Array.from(el.children[1].children[1].children)
			terceirosContainer.forEach((container, index2) => {
				countPeople++;
				var cpf = container.children[1].children[1].value
				var email = container.children[2].children[1].value
				if(!validateCPF(cpf)) errors.push("CPF do terceiro inválido (#"+(index2 + 1)+")")
				if(isSignatureMode("digital") && (!email || email == "undefined" || !validateEmail(email))) errors.push("E-mail do terceiro inválido (#"+(index2 + 1)+")")
			})
			if(countPeople === 0 && acaoInput.value !== "voltar") {
				errors.push("É necessário inserir algum representante em Terceiro Garantidor")
			}
		}
	})
	

	// Checagem se tem algum grupo em Avalistas
	var avalistas = Array.from(document.getElementById("avalistas").children)
	avalistas.forEach((el, index)=> {
		if(index > 0) {
			countPeople = 0;
			let avalistaContainer = Array.from(el.children[1].children[1].children)
			avalistaContainer.forEach((container, index2) => {
				countPeople++;
				var cpf = container.children[1].children[1].value
				var email = container.children[2].children[1].value
				if(!validateCPF(cpf)) errors.push("CPF do avalista inválido (#"+(index2 + 1)+")")
				if(isSignatureMode("digital") && (!email || email == "undefined" || !validateEmail(email))) errors.push("E-mail do avalista inválido (#"+(index2 + 1)+")")
			})
			if(countPeople === 0 && acaoInput.value !== "voltar") {
				errors.push("É necessário inserir algum representante em Avalistas")
			}
		}
	})

	// Exibe alerta de erros
	showErrors(errors)
}
const showErrors = (errors) => {
	if(errors.length > 0) {
		let message = ""
		if(errors.length > 1) {
			message = "Os seguintes erros foram verificados:\n"
			errors.forEach((error, index) => {
				message += "\n" + (index + 1) + " - " + error
				if((index + 1) < errors.length) message += ";"
				else message += "."
			})
		} else message = "Um erro foi encontrado: " + errors[0] + "."
		alert(message)
	}
}

const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

const validateCPF = (cpf) => {
	// Remove todos os caracteres especiais
	cpf = cpf.replace(/[^\d]/g, '');

	// Verifica se o CPF tem 11 dígitos
	if (cpf.length !== 11) {
		return false;
	}

	// Verifica se todos os dígitos são iguais, o que é um CPF inválido
	var isAllDigitsEqual = /^(\d)\1*$/.test(cpf);
	if (isAllDigitsEqual) {
		return false;
	}

	// Calcula o primeiro dígito verificador
	var soma = 0;
	for (var i = 0; i < 9; i++) {
		soma += parseInt(cpf.charAt(i)) * (10 - i);
	}
	var resto = 11 - (soma % 11);
	var digitoVerificador1 = resto >= 10 ? 0 : resto;

	// Calcula o segundo dígito verificador
	soma = 0;
	for (var i = 0; i < 10; i++) {
		soma += parseInt(cpf.charAt(i)) * (11 - i);
	}
	resto = 11 - (soma % 11);
	var digitoVerificador2 = resto >= 10 ? 0 : resto;

	// Verifica se os dígitos verificadores calculados são iguais aos informados
	if (parseInt(cpf.charAt(9)) !== digitoVerificador1 || parseInt(cpf.charAt(10)) !== digitoVerificador2) {
		return false;
	}

	// CPF válido
	return true;
}

const scrollToTop = () => {
	const container = document.querySelector(".ContentContainer")
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	container.scrollTop = 0;
}

const createInputEvents = () => {
	const statusCliElem = document.querySelectorAll("#statusCli")
	const statusComentTercElem = document.querySelectorAll("#statusComentTerc")
	const statusAva = document.querySelectorAll("#statusAva")
	const statusArr = []
	if(statusCliElem) {
		statusCliElem.forEach(element => {
			statusArr.push(element)
		})
	}
	if(statusComentTercElem) {
		statusComentTercElem.forEach(element => {
			statusArr.push(element)
		})
	}
	if(statusAva) {
		statusAva.forEach(element => {
			statusArr.push(element)
		})
	}
	statusArr.forEach(element => {
		element.addEventListener("change", () => checkStatus())
	})
	checkStatus()
}

const checkStatus = () => {
	const statusCliElem = document.querySelectorAll("#statusCli")
	const statusComentTercElem = document.querySelectorAll("#statusComentTerc")
	const statusAva = document.querySelectorAll("#statusAva")

	var statusArr = []

	if(statusCliElem) {
		statusCliElem.forEach(element => {
			var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
			var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
			if(!isParentContainerHidden && !isParentFieldsetHidden) statusArr.push(element)
		})
	}
	if(statusComentTercElem) {
		statusComentTercElem.forEach(element => {
			var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
			var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
			if(!isParentContainerHidden && !isParentFieldsetHidden) statusArr.push(element)
		})
	}
	if(statusAva) {
		statusAva.forEach(element => {
			var isParentContainerHidden = element.parentElement.hasAttribute("hidden")
			var isParentFieldsetHidden = element.parentElement.parentElement.parentElement.parentElement.hasAttribute("hidden")
			if(!isParentContainerHidden && !isParentFieldsetHidden) statusArr.push(element)
		})
	}

	const statusElem = document.getElementById("status")
	var optionsAllOk = ["Analise OK"]
	var optionsPartialOk = ["Selecione um status", "Timbre Pendencia", "Pendencia de Poderes"]
	var optionsUnmodified = ["Selecione um status", "Analise OK", "Timbre Pendencia", "Pendencia de Poderes"]

	var allOk = true;
	var allUnmodified = true;
	statusArr.forEach(element => {
		if(element.value !== "ok") allOk = false
		if(element.value !== "Status") allUnmodified = false
		if(element.value === "") element.value = "Status"
		console.log("checkStatus bool", element.value)
	})
	statusElem.innerHTML = "";
	if(allOk) {
		optionsAllOk.forEach((item, index) => {
			var option = document.createElement("option")
			option.innerText = item
			option.selected = index === 0
			statusElem.appendChild(option)
		})
	} else if(allUnmodified) {
		optionsUnmodified.forEach((item, index) => {
			var option = document.createElement("option")
			option.innerText = item
			option.selected = index === 0
			statusElem.appendChild(option)
		})
	} else {
		optionsPartialOk.forEach((item, index) => {
			var option = document.createElement("option")
			option.innerText = item
			option.selected = index === 0
			statusElem.appendChild(option)
		})
	}
}

function removeStatusAndComments(select) {
	console.log("removeStatusAndComments")
	if(workflow[3]) {
		var comments = select.parentElement.parentElement.parentElement.querySelector(".containerStatus")
		console.log("removeStatusAndComments", select, comments)
		comments.hidden = true
		comments.querySelectorAll("textarea").forEach(element => {
			element.value = ""
		})
		comments.querySelectorAll("select").forEach(element => {
			element.value = "Status"
		})
	}
}

window.saveState = saveState