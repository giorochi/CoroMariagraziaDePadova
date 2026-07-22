// =====================================
// CORO "MARIAGRAZIA DE PADOVA"
// Canto.js - versione Player V2
// =====================================


let datiCanto = null;

let audio = document.getElementById("audio");

let tracciaAttuale = "tutti";

let sezioneAttuale = null;

let ripetiSezione = false;



// elementi pagina

const titolo = document.getElementById("titolo");
const autore = document.getElementById("autore");

const parteCorrente = document.getElementById("parteCorrente");

const playBtn = document.getElementById("play");

const barra = document.getElementById("barra");

const tempoAttuale = document.getElementById("tempoAttuale");

const durata = document.getElementById("durata");

const volume = document.getElementById("volume");

const ripetiBtn = document.getElementById("ripeti");





// recupera il canto scelto dalla dashboard

const parametro = new URLSearchParams(
    window.location.search
);

const fileCanto =
    parametro.get("canto");





// caricamento JSON

async function caricaCanto(){


    if(!fileCanto){

        console.error(
            "Nessun canto selezionato"
        );

        return;

    }



    try{


        const risposta =
        await fetch(
            "canti/" + fileCanto + ".json"
        );



        datiCanto =
        await risposta.json();



        titolo.textContent =
        datiCanto.titolo;



        if(autore){

            autore.textContent =
            datiCanto.autore || "";

        }




        caricaAudio();



        creaSezioni();



        creaSpartito();



    }

    catch(errore){


        console.error(
            "Errore caricamento canto:",
            errore
        );


    }


}





// caricamento audio iniziale

function caricaAudio(){


    audio.src =
    datiCanto.tracce[tracciaAttuale];



    audio.load();



    audio.playbackRate = 1;



    if(parteCorrente){

        parteCorrente.textContent =
        "Tutte le voci";

    }


}






// cambio voce

document
.querySelectorAll(".voce")
.forEach(btn => {


    btn.addEventListener(
        "click",
        ()=>{


            document
            .querySelectorAll(".voce")
            .forEach(
                b =>
                b.classList.remove("attiva")
            );



            btn.classList.add(
                "attiva"
            );



            tracciaAttuale =
            btn.dataset.voce;



            audio.pause();



            audio.currentTime = 0;



            audio.src =
            datiCanto.tracce[
                tracciaAttuale
            ];



            audio.load();



            if(parteCorrente){

                parteCorrente.textContent =
                btn.textContent;

            }


            playBtn.textContent =
            "▶";


        }
    );


});






caricaCanto();
// =====================================
// PLAYER
// =====================================


// PLAY / PAUSA

playBtn.addEventListener(
    "click",
    ()=>{


        if(audio.paused){


            audio.play();


            playBtn.textContent =
            "❚❚";


        } else {


            audio.pause();


            playBtn.textContent =
            "▶";


        }


    }
);






// aggiornamento barra e tempo

audio.addEventListener(
    "timeupdate",
    ()=>{


        if(audio.duration){


            let percentuale =
            (audio.currentTime / audio.duration) * 100;


            barra.style.width =
            percentuale + "%";



            tempoAttuale.textContent =
            formattaTempo(
                audio.currentTime
            );


        }



        controlloFineSezione();


    }
);







// durata totale

audio.addEventListener(
    "loadedmetadata",
    ()=>{


        durata.textContent =
        formattaTempo(
            audio.duration
        );


    }
);







// clic sulla barra

document
.querySelector(".progress")
.addEventListener(
    "click",
    (event)=>{


        let larghezza =
        event.currentTarget.clientWidth;



        let posizione =
        event.offsetX;



        audio.currentTime =
        (posizione / larghezza)
        *
        audio.duration;



    }
);








// avanti e indietro 5 secondi


document
.getElementById("indietro5")
.addEventListener(
"click",
()=>{


    audio.currentTime -= 5;


});





document
.getElementById("avanti5")
.addEventListener(
"click",
()=>{


    audio.currentTime += 5;


});








// volume


volume.addEventListener(
    "input",
    ()=>{


        audio.volume =
        volume.value;


    }
);








// velocità


document
.querySelectorAll("[data-speed]")
.forEach(
btn=>{


btn.addEventListener(
"click",
()=>{


    let velocita =
    Number(
        btn.dataset.speed
    );



    audio.playbackRate =
    velocita;




    document
    .querySelectorAll("[data-speed]")
    .forEach(
        b =>
        b.classList.remove(
            "selezionata"
        )
    );



    btn.classList.add(
        "selezionata"
    );



});


}
);









// ripetizione sezione


ripetiBtn.addEventListener(
"click",
()=>{


    ripetiSezione =
    !ripetiSezione;



    if(ripetiSezione){


        ripetiBtn.classList.add(
            "attivo"
        );


        ripetiBtn.textContent =
        "🔁 Ripeti ON";


    } else {


        ripetiBtn.classList.remove(
            "attivo"
        );


        ripetiBtn.textContent =
        "🔁 Ripeti sezione";


    }


}
);









// controllo fine sezione

function controlloFineSezione(){



    if(
        !sezioneAttuale
    )

    return;





    if(
        audio.currentTime >=
        sezioneAttuale.fine
    ){



        if(ripetiSezione){



            audio.currentTime =
            sezioneAttuale.inizio;



            audio.play();



        } else {



            audio.pause();


            playBtn.textContent =
            "▶";



        }


    }



}








// formato minuti:secondi

function formattaTempo(secondi){


    if(
        isNaN(secondi)
    )

    return "00:00";



    let minuti =
    Math.floor(
        secondi / 60
    );


    let secondiRimasti =
    Math.floor(
        secondi % 60
    );



    return (
        minuti
        .toString()
        .padStart(2,"0")
        +
        ":"
        +
        secondiRimasti
        .toString()
        .padStart(2,"0")
    );


}
// =====================================
// SEZIONI KARAOKE
// =====================================


function creaSezioni(){


    const contenitore =
    document.getElementById("sezioni");



    contenitore.innerHTML = "";



    if(
        !datiCanto.sezioni
    )
    return;




    datiCanto.sezioni.forEach(
    (sezione,index)=>{


        const box =
        document.createElement("div");



        box.className =
        "sezione";





        box.innerHTML = `

        <h2>
        ${sezione.nome}
        </h2>


        <div class="testo">
        ${sezione.testo}
        </div>


        <p>
        ${formattaTempo(sezione.inizio)}
        →
        ${formattaTempo(sezione.fine)}
        </p>


        <button class="riproduci-sezione">
        ▶ Riproduci sezione
        </button>

        `;





        const pulsante =
        box.querySelector(
            ".riproduci-sezione"
        );





        pulsante.addEventListener(
        "click",
        ()=>{


            avviaSezione(
                sezione,
                box
            );


        });





        contenitore.appendChild(
            box
        );



    });



}








function avviaSezione(
    sezione,
    elemento
){



    sezioneAttuale =
    sezione;



    parteCorrente.textContent =
    sezione.nome;



    audio.currentTime =
    sezione.inizio;



    audio.play();



    playBtn.textContent =
    "❚❚";





    document
    .querySelectorAll(".sezione")
    .forEach(
        s =>
        s.classList.remove(
            "attiva"
        )
    );



    elemento.classList.add(
        "attiva"
    );



}









// =====================================
// SPARTITO PDF
// =====================================


function creaSpartito(){



    const contenitore =
    document.getElementById(
        "spartito"
    );



    if(
        !contenitore
    )
    return;




    if(
        datiCanto.spartito
    ){



        contenitore.innerHTML = `

        <a
        href="${datiCanto.spartito}"
        target="_blank"
        >


        <button>

        Apri spartito PDF

        </button>


        </a>

        `;


    } else {



        contenitore.innerHTML = `

        <p>
        Spartito non disponibile
        </p>

        `;


    }



}







// =====================================
// SCROLL AUTOMATICO KARAOKE
// =====================================


audio.addEventListener(
"timeupdate",
()=>{


    if(
        !sezioneAttuale
    )
    return;




    let sezioni =
    document.querySelectorAll(
        ".sezione"
    );



    sezioni.forEach(
    elemento=>{


        if(
            elemento.innerText
            .includes(
                sezioneAttuale.nome
            )
        ){


            elemento.scrollIntoView(
            {
                behavior:"smooth",
                block:"center"
            }
            );


        }


    });


});
