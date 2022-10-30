let shows;
let eps;

window.onload = async () => {
  shows = getAllShows().sort((a, b) => {
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

  displayShows(shows);
}

function displayShows(shows) {
  const container = document.querySelector(".container");
  container.innerHTML = "";

  for (let show of shows) {
    const article = document.createElement("article");
    article.setAttribute("class", "card-show");

    const titleCont = document.createElement("div");
    titleCont.setAttribute("class", "cont-title");
    const title = document.createElement("h2");
    title.innerText = `${show.name}`;
    titleCont.appendChild(title);

    if (show.image && show.image.medium) {
      const img = document.createElement("img");
      img.setAttribute("class", "img");
      img.setAttribute("src", show.image.medium);
      img.setAttribute("alt", show.name);
      article.appendChild(img);
    }

    const rating = document.createElement("p");
    rating.setAttribute("class", "show-info");
    rating.innerHTML = `<b>Rating:</b> ${show.rating.average}`;

    const genres = document.createElement("p");
    genres.setAttribute("class", "show-info");
    genres.innerHTML = `<b>Genres:</b> ${show.genres.join(" | ")}`;

    const status = document.createElement("p");
    status.setAttribute("class", "show-info");
    status.innerHTML = `<b>Status:</b> ${show.status}`;

    const runtime = document.createElement("p");
    runtime.setAttribute("class", "show-info");
    runtime.innerHTML = `<b>Runtime:</b> ${show.runtime}`;

    article.appendChild(titleCont);

    article.insertAdjacentHTML("beforeend", show.summary);
    article.appendChild(rating);
    article.appendChild(genres);
    article.appendChild(status);
    article.appendChild(runtime);

    article.addEventListener("click", () => {
      goToEpSection(show.id);
    });

    container.appendChild(article);
  }
}

async function goToEpSection(showId) {
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  eps = await res.json();

  const contBackBtn = document.querySelector("#cont-back-btn");
  contBackBtn.innerHTML = "";
  const backBtn = document.createElement("button");
  backBtn.setAttribute("class", "back-btn");
  backBtn.innerText = "Back To Shows";
  backBtn.addEventListener("click", () => {
    goToShowsSection();
  });
  contBackBtn.appendChild(backBtn);

  const contNav = document.querySelector(".cont-nav");
  contNav.innerHTML = "";

  const selectEp = document.createElement("select");
  selectEp.setAttribute("id", "selectEp");
  selectEp.addEventListener("change", (e) => {
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

  const searchEp = document.createElement("input");
  searchEp.setAttribute("id", "search");
  searchEp.setAttribute("type", "text");
  searchEp.setAttribute("placeholder", "Episode Search");
  searchEp.addEventListener("keyup", (e) => {
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

  const searchText = document.createElement("span");
  searchText.setAttribute("id", "search-text");

  contNav.appendChild(selectEp);
  contNav.appendChild(searchEp);
  contNav.appendChild(searchText);

  displayEps(eps);
  populateEpSelect(eps);
}

document.querySelector("#search-shows").addEventListener("keyup", searchShows);

function searchShows(e) {
  const query = e.target.value;
  const searchText = document.querySelector("#search-shows-text");

  const showsFiltered = shows.filter(show => show.name.toLowerCase().includes(query.toLowerCase()) || show.summary.toLowerCase().includes(query.toLowerCase()) || show.genres.some(genre => genre.toLowerCase() === query.toLowerCase()));

  if (query) {
    searchText.innerText = `Displaying ${showsFiltered.length}/${shows.length} shows.`;
  } else {
    searchText.innerText = "";
  }

  displayShows(showsFiltered);
}

function goToShowsSection() {
  const contBackBtn = document.querySelector("#cont-back-btn");
  contBackBtn.innerHTML = "";

  const contNav = document.querySelector(".cont-nav");
  contNav.innerHTML = "";

  const searchShowsInput = document.createElement("input");
  searchShowsInput.setAttribute("id", "search-shows");
  searchShowsInput.setAttribute("type", "text");
  searchShowsInput.setAttribute("placeholder", "Show Search");
  searchShowsInput.addEventListener("keyup", searchShows);

  const searchShowsText = document.createElement("span");
  searchShowsText.setAttribute("id", "search-shows-text");

  contNav.appendChild(searchShowsInput);
  contNav.appendChild(searchShowsText);

  displayShows(shows);
}

function displayEps(eps) {
  const container = document.querySelector(".container");
  container.innerHTML = "";

  for (let ep of eps) {
    const article = document.createElement("article");

    const titleCont = document.createElement("div");
    titleCont.setAttribute("class", "cont-title");
    const title = document.createElement("h2");
    title.innerText = `${ep.name} - S${zeroPad(ep.season)}E${zeroPad(ep.number)}`;
    titleCont.appendChild(title);

    if (ep.image && ep.image.medium) {
      const img = document.createElement("img");
      img.setAttribute("class", "img");
      img.setAttribute("src", ep.image.medium);
      img.setAttribute("alt", ep.name);
      article.appendChild(img);
    }

    article.appendChild(titleCont);
    article.insertAdjacentHTML("beforeend", ep.summary);

    container.appendChild(article);
  }
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

// document.querySelector("#selectShow").addEventListener("change", async (e) => {
//   eps = await getEps(e.target.value);

//   populateEpSelect(eps);
//   displayEps(eps);
// });







function zeroPad(num) {
  return num < 10 ? `0${num}` : num;
}