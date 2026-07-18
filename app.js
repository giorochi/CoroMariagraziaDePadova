let dati;
let audio=document.getElementById("audio");
let sezioniDiv=document.getElementById("sezioni");
let sezioneInRiproduzione = null;
let sezioneAttuale;


fetch("canti/esempio.json")

.then(r=>r.json())

.then(json=>{

dati=json;

document.getElementById("titolo").innerHTML=json.titolo;

audio.src=json.tracce.tutti;


creaSezioni();

});



function creaSezioni(){

sezioniDiv.innerHTML="";


dati.sezioni.forEach((s,i)=>{


let div=document.createElement("div");

div.className="sezione";

div.innerHTML=`

<h2>${s.nome}</h2>

<div class="testo">
${s.testo}
</div>


<button class="play">
▶ Riproduci
</button>

`;


div.querySelector("button").onclick=()=>{

sezioneAttuale = i;
sezioneInRiproduzione = s;

audio.currentTime = s.inizio;

audio.play().catch(error=>{
    console.log(error);
});

};



sezioniDiv.appendChild(div);


});


}



audio.ontimeupdate=function(){

let tempo = audio.currentTime;


// evidenziazione karaoke

document.querySelectorAll(".sezione")
.forEach((el,i)=>{

let s=dati.sezioni[i];

if(
tempo >= s.inizio &&
tempo < s.fine
)

el.classList.add("attiva");

else

el.classList.remove("attiva");

});


// stop automatico della sezione

if(sezioneInRiproduzione){

if(tempo >= sezioneInRiproduzione.fine){

audio.pause();

audio.currentTime = sezioneInRiproduzione.inizio;

sezioneInRiproduzione = null;

}

}

}



document.getElementById("traccia")
.onchange = async function(){

let posizione = audio.currentTime;

audio.pause();

audio.src = dati.tracce[this.value];

audio.load();

audio.currentTime = posizione;

try {
    await audio.play();
}
catch(error){
    console.log("Riproduzione interrotta:", error);
}

}



function cambiaVelocita(v){

audio.playbackRate=v;

}



function ripeti(){

if(sezioneAttuale!=undefined){

let s=dati.sezioni[sezioneAttuale];

audio.currentTime=s.inizio;

audio.play();


}

}
