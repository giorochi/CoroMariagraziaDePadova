let dati = null;

let audio = document.getElementById("audio");

let sezioneAttiva = null;

let riproduciSezione = false;

let voceCorrente = "tutti";



const idCanto =
new URLSearchParams(location.search).get("id");





// Carica il file del canto


fetch("canti/" + idCanto + ".json")


.then(r => r.json())


.then(json => {


    dati = json;


    document.getElementById("titolo").innerHTML =
    "🎼 " + dati.titolo;



    document.getElementById("autore").innerHTML =
    dati.autore || "";



    caricaAudio();



    creaSezioni();



    recuperaPosizione();


});







// Caricamento audio



function caricaAudio(){


    audio.src =
    dati.tracce[voceCorrente];



    audio.load();



}








// Cambio voce



document.querySelectorAll(".voce")
.forEach(pulsante => {


    pulsante.onclick = function(){



        document
        .querySelectorAll(".voce")
        .forEach(v =>
        v.classList.remove("attiva"));



        this.classList.add("attiva");



        let posizione =
        audio.currentTime;



        voceCorrente =
        this.dataset.voce;



        audio.src =
        dati.tracce[voceCorrente];



        audio.currentTime =
        posizione;



        audio.play();



    }


});








// PLAY / PAUSA



document.getElementById("play")
.onclick=function(){



    if(audio.paused){


        audio.play();


        this.innerHTML="⏸";


    }

    else{


        audio.pause();


        this.innerHTML="▶";


    }


};








// Aggiorna player



audio.addEventListener(
"timeupdate",
()=>{


    let percentuale =
    (audio.currentTime / audio.duration) * 100;



    document.getElementById("barra")
    .style.width =
    percentuale + "%";



    document.getElementById("tempoAttuale")
    .innerHTML =
    formatoTempo(audio.currentTime);



    document.getElementById("durata")
    .innerHTML =
    formatoTempo(audio.duration);



    evidenziaSezione();



    salvaPosizione();



    // stop automatico sezione


    if(
    riproduciSezione &&
    sezioneAttiva &&
    audio.currentTime >= sezioneAttiva.fine
    ){


        audio.pause();

        audio.currentTime =
        sezioneAttiva.inizio;


        riproduciSezione=false;


    }



});








function formatoTempo(secondi){


    if(isNaN(secondi))
        return "00:00";



    let minuti =
    Math.floor(secondi/60);



    let secondiRimanenti =
    Math.floor(secondi%60);



    return (

        minuti
        .toString()
        .padStart(2,"0")

        +

        ":"

        +

        secondiRimanenti
        .toString()
        .padStart(2,"0")

    );


}









// Barra cliccabile



document.querySelector(".progress")
.onclick=function(e){


    let larghezza =
    this.offsetWidth;



    let posizione =
    e.offsetX / larghezza;



    audio.currentTime =
    posizione * audio.duration;


};








// Avanti indietro


document.getElementById("avanti5")
.onclick=()=> audio.currentTime +=5;


document.getElementById("indietro5")
.onclick=()=> audio.currentTime -=5;


document.getElementById("avanti15")
.onclick=()=> audio.currentTime +=15;


document.getElementById("indietro15")
.onclick=()=> audio.currentTime -=15;









// Velocità


document
.querySelectorAll("[data-speed]")
.forEach(btn=>{


    btn.onclick=()=>{


        audio.playbackRate =
        btn.dataset.speed;


    };


});









// Volume


document.getElementById("volume")
.oninput=function(){


    audio.volume=this.value;


};










// Sezioni karaoke



function creaSezioni(){


let contenitore =
document.getElementById("sezioni");



contenitore.innerHTML="";



dati.sezioni.forEach(sezione=>{


    let div =
    document.createElement("div");



    div.className="card sezione";



    div.innerHTML=`

    <h2>
    🎵 ${sezione.nome}
    </h2>


    <p class="testo">
    ${sezione.testo}
    </p>


    <p class="tempo">

    ⏱ ${formatoTempo(sezione.inizio)}
    -
    ${formatoTempo(sezione.fine)}

    </p>



    <button>
    ▶ Riproduci sezione
    </button>

    `;




    div.querySelector("button")
    .onclick=function(){


        sezioneAttiva=sezione;

        riproduciSezione=true;


        audio.currentTime =
        sezione.inizio;


        audio.play();


    };




    contenitore.appendChild(div);



});


}









function evidenziaSezione(){


document
.querySelectorAll(".sezione")
.forEach((elemento,index)=>{


    let s =
    dati.sezioni[index];



    if(
    audio.currentTime >= s.inizio &&
    audio.currentTime < s.fine
    ){


        elemento.classList.add("attiva");


    }

    else{


        elemento.classList.remove("attiva");


    }


});


}









// Modalità studio



document.getElementById("studio")
.onclick=function(){


document.body
.classList.toggle("study-mode");


};









// Memoria ultimo ascolto



function salvaPosizione(){


localStorage.setItem(

"ultimo_"+idCanto,

audio.currentTime

);


}



function recuperaPosizione(){


let ultimo =
localStorage.getItem(
"ultimo_"+idCanto
);



if(ultimo){

audio.currentTime =
parseFloat(ultimo);

}


}
const tema =
document.getElementById("tema");


if(tema){


tema.onclick=function(){


document.body.classList.toggle("dark");


localStorage.setItem(

"tema",

document.body.classList.contains("dark")
?
"dark"
:
"light"

);


};


}
