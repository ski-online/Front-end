loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

if(loggedUser != null){
    document.getElementById("autenticazione").innerHTML = '<button type="button" class="btn btn-outline-primary me-2" onclick="logout()">Logout</button>'
}

function mostraStatoImpianti(){
    fetch('./affollamento', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        }).then((resp) => resp.json())
    .then(function(data) {
        document.getElementById("numAssoluto").innerHTML += data.num;
        }).catch( error => console.error(error) );
    fetch('./affollamentoSingolo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        }).then((resp) => resp.json()) 
    .then(function(data) { 
        let tabella = "";
        data.forEach(element => {
            tabella += "<tr><td>" + element.impianto + "</td><td>"
            if(element.perc == -1){
                tabella += " CHIUSO "
            }else{
                tabella += element.perc + "%"
            }
            tabella += "</td></tr>"
        });
        document.getElementById("data").innerHTML += tabella;
        }).catch( error => console.error(error) );
    if(loggedUser != null && loggedUser.livello == "Base"){
        simulaPassaggio()
    }
}

function datiUtente(){
    if(!loggedUser){
        window.alert("Devi prima effettuare il login per visualizzare questa pagina")
        window.location.replace("index.html")
    }
    fetch('./utente/' + loggedUser.email, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        }).then((resp) => resp.json())
    .then(function(data) {
        if(data.message){
            window.alert("Utente inesistente")
            window.location.replace("index.html")
            return;
        }
        document.getElementById("nome").innerHTML += data.nome;
        document.getElementById("cognome").innerHTML += data.cognome;
        }).catch( error => console.error(error));
}

function cancellaAccount(){
    if(window.confirm("Sei sicuro di voler cancellare l'account? Operazione irreversibile!")){
        fetch('./utente/' + loggedUser.email, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'token': loggedUser.token, 'livello': loggedUser.livello },
            }).then((resp) => resp.json())
        .then(function(data) {
            if(data.message){
                window.alert(data.message)
                logout()
            }else{
                window.alert(data.Error)
            }
            }).catch( error => console.error(error) );
    }
}

function modificaPassword(){
    let oldPassword = document.getElementById("oldPassword").value
    let newPassword = document.getElementById("newPassword").value
    let newPasswordBis = document.getElementById("newPasswordBis").value
    if(newPassword != newPasswordBis){
        window.alert("Le nuove password non coincidono")
        return;
    }
    let validazione = validatePassword(newPassword)
    if(!validazione.esito){
        window.alert(validazione.messaggio)
        return;
    }
    fetch('./utente', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'token': loggedUser.token, 'livello': loggedUser.livello},
        body: JSON.stringify({ email: loggedUser.email, oldPassword: oldPassword, newPassword: newPassword })
        }).then((resp) => resp.json())
    .then(function(data) {
        if(data.Error){
            window.alert(data.Error)
        }
        return;
        }).catch( error => console.error(error) );
        window.alert("Password modificata correttamente!")
        window.location.replace("utente.html")
}

function login(){
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    fetch('./login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email: email, password: password})
        }).then((resp) => resp.json())
    .then(function(data) {
        if(data.Error){
            window.alert(data.Error)
        }else{
            loggedUser = {email: data.email, livello: data.livelloUtente, token: data.token}
            sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
            window.location.replace("/")
        }
        }).catch( error => console.error(error) );
}

function registrazione(){
    let nome = document.getElementById("nome").value
    let cognome = document.getElementById("cognome").value
    let nickname = document.getElementById("nickname").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let passwordBis = document.getElementById("passwordBis").value

    if(password != passwordBis){
        window.alert("Le password non coincidono")
        return;
    }
    let validazione = validatePassword(password)
    if(!validazione.esito){
        window.alert(validazione.messaggio)
        return;
    }

    fetch('./utente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ nome: nome, cognome: cognome, nickname: nickname, email: email, password: password})
        }).then((resp) => resp.json())
    .then(function(data) {
        if(data.Error){
            window.alert(data.Error)
        }else{
            window.alert("Utenza creata correttamente! Esegui il tuo primo accesso ed inizia a navigare")
            window.location.replace("login.html")
        }
        }).catch( error => console.error(error) );
}

function logout(){
    loggedUser = {}
    sessionStorage.clear()
    window.location.replace("/")
}
var impianti
function mostraImpianti(){
    if(!loggedUser){
        window.alert("Devi prima effettuare il login per visualizzare questa pagina")
        window.location.replace("index.html")
    }
    if(loggedUser.livello != 'Operatore' && loggedUser.livello != 'Gestore'){
        window.alert("Puoi visualizzare questa pagina di sistema solo se accedi con un account di livello Operatore oppure Gestore")
        window.location.replace("index.html")
    }
    let result = ""
    fetch('./impianto', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
        }).then((resp) => resp.json())
    .then(function(data) {
        impianti = data
        impianti.forEach(impianto => {
            result += '<a class="dropdown-item" onclick="mostraImpianto(\'' + impianto._id + '\')">' + impianto.nome + '</a>'
        });
        document.getElementById("listaImpianti").innerHTML = result
        }).catch( error => console.error(error));
}

function mostraImpianto(id){
    if(impianti.find(impianto => impianto._id === id).statoApertura){
        document.getElementById("infoImpianto").innerText = "L'impianto è attualmente APERTO"
        document.getElementById("bottoneImpianto").innerHTML = "CHIUDI"
    }else{
        document.getElementById("infoImpianto").innerText = "L'impianto è attualmente CHIUSO"
        document.getElementById("bottoneImpianto").innerHTML = "APRI"
    }

    document.getElementById("bottoneImpianto").onclick = () => {modificaStato(id)}
    document.getElementById("bottoneImpianto").removeAttribute("hidden")
}

function modificaStato(id){
    fetch('./impianto/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'token': loggedUser.token, 'livello': loggedUser.livello}
        }).then((resp) => resp.json())
    .then(function(data) {
        if(data.Error){
            window.alert(data.Error)
            return;
        }
        })
        window.alert("modifica registrata correttamente")
        window.location.reload()
}

function mostraStorico(){
    if(!loggedUser){
        window.alert("Devi prima effettuare il login per visualizzare questa pagina")
        window.location.replace("index.html")
    }
    simulaPassaggio()
    fetch('./utente/' + loggedUser.email, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        }).then((resp) => resp.json())
    .then(function(utente) {
        let list = []
        fetch('./impianto', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
            }).then((resp) => resp.json())
        .then(function(data){
            data.forEach(element => {
                list[element._id] = element.nome
            });
            fetch('./log/' + utente._id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'token': loggedUser.token, 'livello': loggedUser.livello},
                }).then((resp) => resp.json())
            .then(function(data) { 
                let tabella = "";
                data.forEach(element => {
                    tabella += "<tr><td>" + list[element.impianto] + "</td><td>"
                    tabella += "<td>" + new Date(element.timestamp) + "</td><td>"
                    tabella += "</td></tr>"
                });
                document.getElementById("data").innerHTML += tabella;
                }).catch( error => console.error(error) );
            }).catch( error => console.error(error));
        }).catch( error => console.error(error));
}

function simulaPassaggio(){
    let result = '<p>Simula passaggio attraverso un tornello</p><select id="impianto">'
    fetch('./impianto', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
        }).then((resp) => resp.json())
    .then(function(data) {
        data.forEach(element => {
            if(element.statoApertura)
            result += '<option value="' + element._id + '">' + element.nome + '</option>'
        });
        result += '</select><button onclick="passaggio()">Simula</button>'
        document.getElementById("simulaPassaggio").innerHTML = result;
        }).catch( error => console.error(error));
}

function passaggio(){
    let idImpianto = document.getElementById("impianto").value
    fetch('./utente/' + loggedUser.email, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        }).then((resp) => resp.json())
    .then(function(data) {
        if(data.message){
            window.alert(data.message)
            return;
        }
        let idUtente = data._id
        fetch('./log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'token': loggedUser.token, 'livello': loggedUser.livello},
            body: JSON.stringify({idImpianto: idImpianto, idUtente: idUtente})
            }).then((resp) => resp.json())
        .then(function(data) {
            if(data.Error){
                window.alert(data.Error)
                return;
            }
            window.location.reload()
            }).catch( error => console.error(error));
        }).catch( error => console.error(error));
}

function validatePassword(password){
    if(password.length < 8){
        return {esito: false, messaggio:"La password deve contenere almeno 8 caratteri"}
    }
    let maiusc = false
    let minusc = false
    let num = false
    let special = false
    let required = "(`!\"?$%^&*_-+=:;@'~#|\<,>./)"
    for(let i=0; i<password.length; i++){
        if(47 < password[i].codePointAt(0) && password[i].codePointAt(0) < 58){
            num = true
        }else if(required.includes(password[i])){
            special = true
        }else{
            maiusc = maiusc || password[i] == password[i].toUpperCase()
            minusc = minusc || password[i] == password[i].toLowerCase()
        }
    }
    let result = "";
    if(!maiusc) result += "La password deve contenere almeno un carattere maiuscolo\n"
    if(!minusc) result += "La password deve contenere almeno un carattere minuscolo\n"
    if(!num) result += "La password deve contenere almeno un carattere numerico\n"
    if(!special) result += "La password deve contenere almeno un carattere speciale tra i seguenti " + required
    return {esito: maiusc&&minusc&&num&&special, messaggio: result}
}