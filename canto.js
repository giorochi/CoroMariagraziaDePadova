let dati;

let audio=document.getElementById("audio");

let sezioniDiv=document.getElementById("sezioni");


let sezioneInRiproduzione=null;



let id=new URLSearchParams(location.search).get("id");



fetch("canti/"+id+".json")

.then(r=>r.json())

.then(json=>{


dati=json;


document.getElementById("titolo").innerHTML=dati.titolo;


audio.src=dati.tracce.tutti;


creaSezioni();


});





function creaSezioni(){


sezioniDiv.innerHTML="";


dati.sezioni.forEach((s)=>{


let div=document.createElement("div");


div.className="card sezione";


div.innerHTML=`

<h2>${s.nome}</h2>

<p class="testo">
${s.testo}
</p>


<button>
▶ Riproduci sezione
</button>

`;



div.querySelector("button").onclick=()=>{


sezioneInRiproduzione=s;

audio.currentTime=s.inizio;


audio.play();


};



sezioniDiv.appendChild(div);


});


}




audio.ontimeupdate=function(){


let tempo=audio.currentTime;


document.querySelectorAll(".sezione")

.forEach((el,i)=>{


let s=dati.sezioni[i];


if(tempo>=s.inizio && tempo<s.fine)

el.classList.add("attiva");

else

el.classList.remove("attiva");


});



if(sezioneInRiproduzione &&
tempo>=sezioneInRiproduzione.fine)

{


audio.pause();

audio.currentTime=sezioneInRiproduzione.inizio;

sezioneInRiproduzione=null;


}


}




document.getElementById("traccia").onchange=function(){


let posizione=audio.currentTime;


audio.src=dati.tracce[this.value];


audio.currentTime=posizione;


audio.play();


}





function cambiaVelocita(v){

audio.playbackRate=v;

}
