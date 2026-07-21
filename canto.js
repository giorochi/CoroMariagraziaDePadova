let dati = null;

let audio = document.getElementById("audio");

let voceCorrente = "tutti";

let sezioneAttiva = null;

let riproduciSezione = false;

let ripeti = false;



const idCanto =
new URLSearchParams(location.search)
.get("id");






// Carica canto



fetch("canti/" + idCanto + ".json")


.then(r => r.json())


.then(json => {


dati=json;



document.getElementById("titolo")
.innerHTML=dati.titolo;



document.getElementById("autore")
.innerHTML=dati.autore || "";



caricaAudio();



creaSezioni();



caricaSpartito();



salvaRecente(idCanto);



});









// Audio



function caricaAudio(){


audio.src =
dati.tracce[voceCorrente];


audio.load();


}









// Cambio voce



document
.querySelectorAll(".voce")
.forEach(btn=>{


btn.onclick=function(){


document
.querySelectorAll(".voce")
.forEach(v=>
v.classList.remove("attiva")
);



this.classList.add("attiva");



let tempo =
audio.currentTime;



voceCorrente =
this.dataset.voce;



audio.src =
dati.tracce[voceCorrente];



audio.currentTime =
tempo;



audio.play();



};



});








// Play



const playButton =
document.getElementById("play");



playButton.onclick=function(){



if(audio.paused){


audio.play();


playButton.innerHTML=
'<i data-lucide="pause"></i>';

}

else{


audio.pause();


playButton.innerHTML=
'<i data-lucide="play"></i>';

}



lucide.createIcons();


};









// Aggiornamento barra



audio.addEventListener(
"timeupdate",
()=>{



let percentuale =
audio.currentTime /
audio.duration *
100;



document.getElementById("barra")
.style.width =
percentuale+"%";




document.getElementById("tempoAttuale")
.innerHTML =
tempo(audio.currentTime);



document.getElementById("durata")
.innerHTML =
tempo(audio.duration);



evidenzia();



salvaPosizione();





if(
riproduciSezione &&
sezioneAttiva &&
audio.currentTime >= sezioneAttiva.fine
){



if(ripeti){


audio.currentTime =
sezioneAttiva.inizio;


audio.play();



}

else{


audio.pause();


audio.currentTime =
sezioneAttiva.inizio;


riproduciSezione=false;


}



}


});









function tempo(sec){


if(isNaN(sec))
return "00:00";



let m =
Math.floor(sec/60);



let s =
Math.floor(sec%60);



return (

m.toString()
.padStart(2,"0")

+

":"

+

s.toString()
.padStart(2,"0")

);


}









// Barra cliccabile



document
.querySelector(".progress")
.onclick=function(e){


let percentuale =
e.offsetX /
this.offsetWidth;



audio.currentTime =
percentuale *
audio.duration;


};








// Avanti indietro



indietro5.onclick=
()=>audio.currentTime-=5;


avanti5.onclick=
()=>audio.currentTime+=5;


indietro15.onclick=
()=>audio.currentTime-=15;


avanti15.onclick=
()=>audio.currentTime+=15;









// Velocità



document
.querySelectorAll("[data-speed]")
.forEach(btn=>{


btn.onclick=()=>{


audio.playbackRate =
Number(btn.dataset.speed);


};


});








// Volume


volume.oninput=function(){


audio.volume=this.value;


};









// Crea sezioni



function creaSezioni(){



let box =
document.getElementById("sezioni");



box.innerHTML="";



dati.sezioni.forEach((s,index)=>{


let div =
document.createElement("div");



div.className=
"card sezione";



div.innerHTML=`


<h2>

${s.nome}

</h2>



<p class="testo">

${s.testo}

</p>



<p>

${tempo(s.inizio)}
-
${tempo(s.fine)}

</p>



<button>

<i data-lucide="play"></i>

Riproduci

</button>



`;





div.querySelector("button")
.onclick=function(){


sezioneAttiva=s;


riproduciSezione=true;


audio.currentTime=s.inizio;


audio.play();



};



box.appendChild(div);



});



lucide.createIcons();


}









function evidenzia(){


document
.querySelectorAll(".sezione")
.forEach((el,i)=>{


let s =
dati.sezioni[i];



if(
audio.currentTime>=s.inizio &&
audio.currentTime<s.fine
){


el.classList.add("attiva");


}

else{


el.classList.remove("attiva");


}



});


}









// Ripeti sezione



let bottoneRipeti =
document.createElement("button");



bottoneRipeti.innerHTML=
`
<i data-lucide="repeat"></i>
Ripeti sezione
`;



bottoneRipeti.onclick=function(){


ripeti=!ripeti;



this.classList.toggle(
"attiva",
ripeti
);



};



document
.querySelector(".player")
.appendChild(bottoneRipeti);








// Modalità studio



studio.onclick=function(){


document.body
.classList.toggle(
"study-mode"
);


};









// PDF



function caricaSpartito(){



let box =
document.getElementById("spartito");



if(
dati.spartito
){



box.innerHTML=`

<a href="${dati.spartito}" target="_blank">


<button>

<i data-lucide="file-text"></i>

Apri spartito

</button>


</a>


`;



lucide.createIcons();


}



}









// Memoria posizione



function salvaPosizione(){


localStorage.setItem(

"posizione_"+idCanto,

audio.currentTime

);


}









// ultimi studiati



function salvaRecente(id){



let recenti =
JSON.parse(

localStorage.getItem("recenti")

||"[]"

);



recenti =
recenti.filter(
x=>x!==id
);



recenti.unshift(id);



localStorage.setItem(

"recenti",

JSON.stringify(
recenti.slice(0,5)
)

);



}









// Recupera posizione



let ultima =
localStorage.getItem(
"posizione_"+idCanto
);



audio.addEventListener(
"loadedmetadata",
()=>{


if(ultima){

audio.currentTime =
Number(ultima);

}


});
