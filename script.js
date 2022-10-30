let eps;

window.onload = async () => {
  populateSelectShows();

  eps = await getEps(document.querySelectorAll("#selectShow")[0].value);

  populateEpSelect(eps);
  displayEps(eps);
}

function populateSelectShows() {
  const selectShow = document.querySelector("#selectShow");
  const shows = getAllShows().sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  for (let show of shows) {
    const option = document.createElement("option");
    option.setAttribute("value", show.id);
    option.innerText = `${show.name}`;

    selectShow.appendChild(option);
  }
}

async function getEps(showId) {
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  eps = await res.json();

  return eps;
}

function populateEpSelect(eps) {
  const selectEp = document.querySelector("#selectEp");
  selectEp.innerHTML = "";

  const firstOption = document.createElement("option");
  firstOption.setAttribute("value", "All Episodes");
  firstOption.innerText = "All Episodes";
  selectEp.appendChild(firstOption);

  for (let ep of eps) {
    const option = document.createElement("option");
    option.setAttribute("value", ep.id);
    option.innerText = `S${zeroPad(ep.season)}E${zeroPad(ep.number)} - ${ep.name}`;

    selectEp.appendChild(option);
  }
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

document.querySelector("#selectShow").addEventListener("change", async (e) => {
  eps = await getEps(e.target.value);

  populateEpSelect(eps);
  displayEps(eps);
});

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