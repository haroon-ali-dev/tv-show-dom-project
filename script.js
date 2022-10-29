let eps;

window.onload = async () => {
  const res = await fetch("https://api.tvmaze.com/shows/82/episodes");
  eps = await res.json();

  displayEps(eps);
  populateEpSelect(eps);
}

function displayEps(eps) {
  const containerEps = document.querySelector(".container-eps");
  containerEps.innerHTML = "";

  for (let ep of eps) {
    const article = document.createElement("article");

    const epTitleCont = document.createElement("div");
    epTitleCont.setAttribute("class", "cont-ep-title");
    const epTitle = document.createElement("h2");
    epTitle.innerText = `${ep.name} - S${zeroPad(ep.season)}E${zeroPad(ep.number)}`;
    epTitleCont.appendChild(epTitle);

    const epImg = document.createElement("img");
    epImg.setAttribute("class", "ep-img");
    epImg.setAttribute("src", ep.image.medium);
    epImg.setAttribute("alt", ep.name);

    article.appendChild(epTitleCont);
    article.appendChild(epImg);
    article.insertAdjacentHTML("beforeend", ep.summary);

    containerEps.appendChild(article);
  }
}

function populateEpSelect(eps) {
  const selectEp = document.querySelector("#selectEp");

  for (let ep of eps) {
    const option = document.createElement("option");
    option.setAttribute("value", ep.id);
    option.innerText = `S${zeroPad(ep.season)}E${zeroPad(ep.number)} - ${ep.name}`;

    selectEp.appendChild(option);
  }
}

document.querySelector("#selectEp").addEventListener("change", (e) => {
  const value = e.target.value;

  document.querySelector("#search").value = "";
  document.querySelector("#search-text").innerHTML = "";

  if (value === "All Episodes") {
    displayEps(eps);
  } else {
    const epsFiltered = eps.filter(ep => ep.id === +value);

    displayEps(epsFiltered);
  }
});

document.querySelector("#search").addEventListener("keyup", (e) => {
  const query = e.target.value;
  const searchText = document.querySelector("#search-text");

  document.querySelector("#selectEp").value = "All Episodes";

  const epsFiltered = eps.filter(ep => ep.name.toLowerCase().includes(query.toLowerCase()) || ep.summary.toLowerCase().includes(query.toLowerCase()));

  if (query) {
    searchText.innerText = `Displaying ${epsFiltered.length}/${eps.length} episodes.`;
  } else {
    searchText.innerText = "";
  }


  displayEps(epsFiltered);
});

function zeroPad(num) {
  return num < 10 ? `0${num}` : num;
}