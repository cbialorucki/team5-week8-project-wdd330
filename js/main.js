const SHIPS_API_URL = "https://swapi.dev/api/starships/";

async function getJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        const fetchJson = await response.json();
        return fetchJson;
      }
    } catch (error) {
      console.log(error);
    }
}

function renderShipList(ships, shipListElement) {
    const list = shipListElement.children[1];
    list.innerHTML = "";
    ships.forEach(function (ship) {
      let listItem = document.createElement("tr");
      listItem.innerHTML = `
          <td class="left-align"><a href="${ship.url}">${ship.name}</a></td>
          <td>${ship.length}</td>
          <td>${ship.crew}</td>
          `;
  
      listItem.addEventListener("click", function (event) {
        event.preventDefault();
        getShipDetails(ship.url);
      });
      list.appendChild(listItem);
    });
}

function renderShipDetails(shipData) {
    document.getElementById("moviesDesc").innerText = "";
    
    document.getElementById("nameDesc").innerText = shipData['name'];
    document.getElementById("modelDesc").innerText = shipData['model'];
    document.getElementById("classDesc").innerText = shipData['starship_class'];
    shipData['films'].forEach(element => {
        console.log(element);
        document.getElementById("moviesDesc").innerText += `${element}\n`;
    });
}

async function showShips(url = SHIPS_API_URL) {
    const results = await getJSON(url);
    const shipListElement = document.getElementById("shiplist");
    renderShipList(results.results, shipListElement);
  
    if (results.next) {
      const next = document.getElementById("next");
      next.onclick = () => {
        showShips(results.next);
      };
    }

    if (results.previous) {
      const prev = document.getElementById("prev");
      prev.onclick = () => {
        showShips(results.previous);
      };
    }
}

async function getFilmDetails(ship){
    await asyncForEach(ship['films'], async function(element, index) {
        const info = await getJSON(element);
        ship['films'][index] = info['title'];
        console.log(ship['films'][index]);
    });
    return ship;
}

async function getShipDetails(url) {
    const ship = await getFilmDetails(await getJSON(url));
    renderShipDetails(ship);
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

showShips();