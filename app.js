let canti = [];

const lista = document.getElementById("listaCanti");

const ricerca = document.getElementById("ricerca");





// Caricamento canti


fetch("dati/canti.json")

.then(response => {


    if(!response.ok){

        throw new Error(
            "Errore caricamento repertorio"
        );

    }


    return response.json();


})


.then(data => {


    canti = data;


    mostraPagina();


})



.catch(error => {


    lista.innerHTML = `

    <div class="card">

    <h2>
    Errore
    </h2>

    <p>
    ${error.message}
    </p>

    </div>

    `;


});








// Mostra tutto


function mostraPagina(){


    mostraCanti(canti);


    mostraPreferiti();


    mostraRecenti();


}









function mostraCanti(elenco){


    lista.innerHTML="";



    if(elenco.length===0){


        lista.innerHTML=`

        <div class="card">

        Nessun canto trovato

        </div>

        `;


        return;

    }





    elenco.forEach(canto=>{



        lista.appendChild(
            creaCard(canto)
        );



    });



    lucide.createIcons();


}









function creaCard(canto){



    let card =
    document.createElement("div");



    card.className="card";




    let preferito =
    isPreferito(canto.id);




    card.innerHTML=`

    <h2>

    <i data-lucide="music-2"></i>

    ${canto.titolo}

    </h2>



    <p>

    ${canto.autore || ""}

    </p>




    <button class="fav">


    <i data-lucide="heart"></i>

    ${preferito ? "Preferito" : ""}


    </button>




    <a href="canto.html?id=${canto.id}">


    <button>


    <i data-lucide="play"></i>


    Studia


    </button>


    </a>


    `;







    card.querySelector(".fav")
    .onclick=function(){


        cambiaPreferito(canto.id);


        mostraPagina();


    };





    return card;



}









// Preferiti



function getPreferiti(){


return JSON.parse(

localStorage.getItem("preferiti")

|| "[]"

);


}







function isPreferito(id){


return getPreferiti()
.includes(id);


}








function cambiaPreferito(id){



let lista =
getPreferiti();




if(lista.includes(id)){


lista =
lista.filter(
x=>x!==id
);


}

else{


lista.push(id);


}



localStorage.setItem(

"preferiti",

JSON.stringify(lista)

);


}









function mostraPreferiti(){



let box =
document.getElementById("preferiti");



if(!box)
return;




let pref =
canti.filter(
c=>isPreferito(c.id)
);




if(pref.length===0){


box.innerHTML="";


return;


}





box.innerHTML=`


<h2>

<i data-lucide="heart"></i>

I tuoi preferiti

</h2>


`;



pref.forEach(canto=>{


box.appendChild(
creaCard(canto)
);


});



}









// Ultimi ascoltati


function salvaRecente(id){


let recenti =
JSON.parse(

localStorage.getItem("recenti")

|| "[]"

);



recenti =
recenti.filter(
x=>x!==id
);



recenti.unshift(id);



recenti =
recenti.slice(0,5);



localStorage.setItem(

"recenti",

JSON.stringify(recenti)

);



}






function mostraRecenti(){


let box =
document.getElementById("recenti");



if(!box)
return;



let ids =
JSON.parse(

localStorage.getItem("recenti")

|| "[]"

);



let recenti =
ids.map(
id=>canti.find(
c=>c.id===id
)

)
.filter(Boolean);





if(recenti.length===0){


box.innerHTML="";

return;


}




box.innerHTML=`


<h2>

<i data-lucide="history"></i>

Ultimi studiati

</h2>


`;



recenti.forEach(canto=>{


box.appendChild(
creaCard(canto)
);


});



}









// Ricerca


ricerca.addEventListener(
"input",
function(){


let testo =
this.value.toLowerCase();



let risultati =
canti.filter(canto=>{


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









// Tema



const tema =
document.getElementById("tema");



if(localStorage.getItem("tema")==="dark"){


document.body.classList.add("dark");


}



if(tema){



tema.onclick=function(){


document.body
.classList.toggle("dark");



localStorage.setItem(

"tema",

document.body
.classList.contains("dark")
?
"dark"
:
"light"

);



};



}







// PWA



if(
"serviceWorker" in navigator
){


navigator.serviceWorker.register(
"service-worker.js"
);


}
