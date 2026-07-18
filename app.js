let lista=document.getElementById("listaCanti");
let ricerca=document.getElementById("ricerca");

let canti=[];


fetch("dati/canti.json")

.then(r=>r.json())

.then(data=>{

canti=data;

mostraCanti(canti);

});



function mostraCanti(listaCanti){


lista.innerHTML="";


listaCanti.forEach(canto=>{


let card=document.createElement("div");

card.className="card";


card.innerHTML=`

<h2>${canto.titolo}</h2>

<p>${canto.categoria}</p>


<a href="canto.html?id=${canto.id}">
<button>
▶ Studia
</button>
</a>

`;


lista.appendChild(card);


});


}



ricerca.oninput=function(){

let testo=this.value.toLowerCase();


mostraCanti(

canti.filter(c=>
c.titolo.toLowerCase().includes(testo)
)

);


}
