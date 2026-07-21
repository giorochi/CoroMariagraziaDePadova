let canti = [];

const lista = document.getElementById("listaCanti");

const ricerca = document.getElementById("ricerca");




// Caricamento elenco canti

fetch("dati/canti.json")


.then(response => {


    if(!response.ok){

        throw new Error(
            "Impossibile caricare canti.json"
        );

    }


    return response.json();


})


.then(data => {


    canti = data;


    mostraCanti(canti);


})



.catch(error => {


    lista.innerHTML = `

    <div class="card">

    <h2>Errore</h2>

    <p>
    ${error.message}
    </p>

    </div>

    `;


});







function mostraCanti(elenco){


    lista.innerHTML = "";



    if(elenco.length === 0){


        lista.innerHTML = `

        <div class="card">

        <h2>
        Nessun canto trovato
        </h2>

        </div>

        `;


        return;


    }





    // Raggruppamento categorie

    let categorie = {};



    elenco.forEach(canto => {



        let categoria =
        canto.categoria || "Altri canti";



        if(!categorie[categoria]){

            categorie[categoria]=[];

        }


        categorie[categoria].push(canto);



    });







    Object.keys(categorie).forEach(categoria => {



        let titoloCategoria =
        document.createElement("h2");


        titoloCategoria.innerHTML =
        "📖 " + categoria;



        lista.appendChild(titoloCategoria);






        categorie[categoria].forEach(canto => {



            let card =
            document.createElement("div");



            card.className="card";



            card.innerHTML = `


            <h2>
            🎼 ${canto.titolo}
            </h2>


            <p>

            ${canto.autore || ""}

            </p>



            <a href="canto.html?id=${canto.id}">


            <button>

            ▶ Studia

            </button>


            </a>


            `;




            lista.appendChild(card);



        });



    });



}









// Ricerca dinamica


ricerca.addEventListener(
"input",
function(){


    let testo =
    this.value.toLowerCase();



    let risultati =
    canti.filter(canto => {


        return (

            canto.titolo
            .toLowerCase()
            .includes(testo)


            ||

            (canto.autore &&
            canto.autore
            .toLowerCase()
            .includes(testo))


            ||

            (canto.categoria &&
            canto.categoria
            .toLowerCase()
            .includes(testo))

        );


    });



    mostraCanti(risultati);



});
if("serviceWorker" in navigator){


navigator.serviceWorker.register(
"service-worker.js"
);
const bottoneTema =
document.getElementById("tema");


if(
localStorage.getItem("tema")=="dark"
){

document.body.classList.add("dark");

}



if(bottoneTema){


bottoneTema.onclick=function(){


document.body.classList.toggle("dark");


if(
document.body.classList.contains("dark")
){

localStorage.setItem(
"tema",
"dark"
);

}

else{

localStorage.setItem(
"tema",
"light"
);

}


};


}

}
