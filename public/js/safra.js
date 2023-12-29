
const buttonCli = document.getElementById("addRepCli")
const buttonCliTerceiros = document.getElementById("addRepCli-terceiros")
const buttonAvalista = document.getElementById("addRepCli-avalista")

let avalistaDIV = document.getElementById("avalistas")
let avalistas = [{nome:"teste", cnpj: "1111111111", tipoass:"ICP"},
{nome:"teste2", cnpj: "2222222222", tipoass:"ICP"},{nome:"teste3", cnpj: "333333333", tipoass:"ICP"}]
const clientesDiv = document.getElementById("clienteContainer").parentElement
let contadorRepCli = 1
function addClient (event, id) {
    try {
        const clone = document.getElementById(id).cloneNode(true)
        clone.removeAttribute("hidden")

        contadorRepCli++
        clone.id = "representante"+contadorRepCli
        console.log("adcioonando", clone)
        return clone

    } catch (error) {
        console.log(error)
    }
}
function remove(event, id) {

}
avalistas.forEach(el => {
    const clone = document.getElementById("avalistas0").cloneNode(true)
    clone.removeAttribute("hidden")
    let addButton = clone.children[1].children[2].children[0].children[0]
    clone.id = el.nome
    clone.children[0].innerText = el.nome
    avalistaDIV.appendChild(clone)
    addButton.addEventListener("click", function(event){
        const clone = addClient(event, "avalistaContainer0")
        addButton.parentElement.parentElement.insertAdjacentElement("beforebegin",clone)
    })
})
buttonCli.addEventListener("click", function(event){
    const clone = addClient(event, "clienteContainer0")
    buttonCli.parentElement.parentElement.insertAdjacentElement("beforebegin",clone)
})

buttonCliTerceiros.addEventListener("click", function(event){
    const clone = addClient(event, "tericeiroContainer0")
    buttonCliTerceiros.parentElement.parentElement.insertAdjacentElement("beforebegin",clone)
})

