var apiData = {
    url: 'https://pokeapi.co/api/v2/',
    type: 'pokemon',
    id: 25,
}

var pokeArray = []

if(localStorage.getItem("pidKey"))
    apiData.id = localStorage.getItem("pidKey");
else
    localStorage.setItem("pidKey",apiData.id);
var {url, type, id} = apiData

var apiUrl = `${url}${type}/${id}`

fetch('https://pokeapi.co/api/v2/pokemon/?limit=806')
    .then((data)=>data.json())
    .then((pokemon)=>createDropdown(pokemon))

fetch(apiUrl)
    .then((data)=>data.json())
    .then((pokemon)=>generateHtml(pokemon))
    .catch(function(){
        const err = `Invalid Pokemon Name/ID ${apiData.id}`
        alert(err);
    })

function upper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var generateHtml = (data)=> {
    localStorage.setItem("pidKey", data.id);
    data.name = upper(data.name);
    if(data.abilities.length==1)
        var abilities = 'Ability: ';
    else
        var abilities = 'Abilities: ';
    for(var i = 0; i < data.abilities.length; i++) {
        abilities += upper(data.abilities[i].ability.name);
        if(data.abilities[i].is_hidden)
            abilities += '(Hidden)';
        if(i < data.abilities.length-1)
            abilities += ', ';
    }
    const html = `
        <div class="pokemonBG">
        <h2>#${data.id}: ${data.name}</h2>
        <img src=${data.sprites.front_default} height="150" width="150">
        <div class="details">
            <span>Height: ${data.height}, Weight: ${data.weight}</span><br>
            <span>${abilities}</span><br>
            <span>HP: ${data.stats[5].base_stat}, Atk: ${data.stats[4].base_stat}, Def: ${data.stats[3].base_stat},</span><br>
            <span>Sp. Atk: ${data.stats[2].base_stat}, Sp. Def: ${data.stats[1].base_stat}, Speed: ${data.stats[0].base_stat}</span>
        </div>
        </div>
    `
    const pokemonDiv = document.querySelector('.pokemon')
    pokemonDiv.innerHTML = html

    var arrowHtml = ``
    if(data.id>1)
        arrowHtml += `<a href="#" class="prev" id="prev"><-    </a>`;
    if(data.id<806)
        arrowHtml += `<a href="#" class="next" id="next">    -></a>`

    const arrowDiv = document.querySelector('.arrows')
    arrowDiv.innerHTML = arrowHtml

    const prev = document.getElementById('prev')
    if(prev)
        prev.addEventListener('click', prevData);

    const next = document.getElementById('next')
    if(next)
        next.addEventListener('click', nextData);
}

const clicked = document.getElementById('pokeid')
clicked.addEventListener('click', getData);

var createDropdown = (data)=> {
    var html = `<select onchange="getDropdownData()" name="SelectPokemon" size="1" id="SelectPokemon">`
    html += `<option>--Select Pokemon--</option>`
    for(var j = 0; j < 806; j++) {
        html += `<option value="${j+1}">${upper(data.results[j].name)} - ${j+1}</option>`;
    }
    html += `</select>`;
    const dropdownDiv = document.querySelector('.dropdown')
    dropdownDiv.innerHTML = html
}

function getData() {
    if(isNaN(document.getElementById('pid').value))
    localStorage.setItem("pidKey", document.getElementById('pid').value.toLowerCase());
    else
        localStorage.setItem("pidKey", document.getElementById('pid').value);
    window.location.reload(false); 
}

function prevData() {
    localStorage.setItem("pidKey", +localStorage.getItem("pidKey")-1);
    window.location.reload(false); 
}

function nextData() {
    localStorage.setItem("pidKey", +localStorage.getItem("pidKey")+1);
    window.location.reload(false); 
}

function getDropdownData() {
    var x = document.getElementById("SelectPokemon").selectedIndex; 
    var y = document.getElementsByTagName("option")[x].value;
    localStorage.setItem("pidKey", y);
    localStorage.setItem("index", x);
    window.location.reload(false); 
}

