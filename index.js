const pokeContainer = document.getElementById("poke-container");
const pokeForm = document.getElementById("poke-form");

function renderPoke(pokemon) {
  const pokeCard = document.createElement("div");
  pokeCard.id = `poke-${pokemon.id}`;
  pokeCard.className = "poke-card";

  const pokeImg = document.createElement("img");
  pokeImg.src = pokemon.img;
  pokeImg.alt = `${pokemon.name} image`;

  const pokeName = document.createElement("h3");
  pokeName.textContent = pokemon.name;

  const pokeLikes = document.createElement("h3");
  pokeLikes.textContent = "Likes: ";

  const likesNum = document.createElement("h5");
  likesNum.className = "like-num";
  likesNum.textContent = pokemon.likes;

  const likeBttn = document.createElement("button");
  likeBttn.className = "like-bttn";
  likeBttn.textContent = "♥";
  likeBttn.addEventListener("click", () => increaseLike(pokemon)); //Anonymous function added to stop from being
  //automatically called

  const deleteBttn = document.createElement("button");
  deleteBttn.className = "delete-bttn";
  deleteBttn.textContent = "Delete";
  deleteBttn.addEventListener('click', () => deletePokemon(pokemon))

  pokeCard.append(pokeImg, pokeName, pokeLikes, likesNum, likeBttn, deleteBttn);
  pokeContainer.appendChild(pokeCard);
}

function deletePokemon(pokemon) {
  //make a fetch request delete
  //pessimist or optimist: pessimist
  document.getElementById(`poke-${pokemon.id}`).remove()
  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: 'DELETE'})
    // .then(resp => resp.json) //Forced to be optimistic, but can make it somewhat pessimistic
    // .then(data => document.getElementById(`poke-${pokemon.id}`).remove())
}

function increaseLike(pokemon) {
  const likesElement = event.target.previousElementSibling;
  const likes = ++pokemon.likes;
  likesElement.textContent = likes; //updating html to new likes

  //Increase like is within the scope of renderPoke and can take the pokmemon object being fetched.
  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, { 
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({likes: likes})
    })
    // .then(resp => resp.json()) //Pessimistic method for likes
    // .then(data => likesElement.textContent = data.likes)
}

function createPoke(e) {
  e.preventDefault();
  const pForm = e.target;
  const pokeName = pForm.querySelector("#name-input").value;
  const pokeImg = pForm.querySelector("#img-input").value;

  if (pokeName !== "" && pokeImg !== "") {
    const poke = {
      // id: 7, // hard coded can be changed to  be more dynamic
      name: pokeName,
      img: pokeImg,
      likes: 0,
    };
    
    const pokeObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poke),
      }
    //FETCH request put in createPoke to recognize the submit event
    //within the IF statement so that it occurs if it is a successful submission
    fetch('http://localhost:3000/pokemons', pokeObj)
    .then(resp => resp.json())
    //.the(pokemonData = renderPoke(pokmonData)) 
    .then(renderPoke) //Does the same thing

    renderPoke(poke);
    pokeForm.reset();
  } else {
    alert("Fill in the form!!!");
  }
}



function getPokemons() {
  //render all pokemons on page

  //first step: FETCHING
  fetch('http://localhost:3000/pokemons') //GETs a promise object, pending, but you will get it (IOU)
  .then (resp => resp.json()) //wait and turn it into JSON to be readable for JS, another promise
  .then (pokemonData => {
    pokemonData.forEach(renderPoke) //Cannot make it into an array for reusability. 
    //Since other functions use objects and would no longer function
  })
}

function init() {  //Need to invoke it.
  getPokemons();
  pokeForm.addEventListener("submit", createPoke);
}

init(); //It is being the first thing being invoke in the stack
