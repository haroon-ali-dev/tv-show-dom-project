window.onload = () => {
  const containerEpisodes = document.querySelector(".container-episodes");
  const episodes = getAllEpisodes();

  for (let episode of episodes) {
    const article = document.createElement("article");

    const epTitleCont = document.createElement("div");
    epTitleCont.setAttribute("class", "cont-ep-title");
    const epTitle = document.createElement("h2");
    epTitle.innerText = `${episode.name} - S${zeroPad(episode.season)}E${zeroPad(episode.number)}`;
    epTitleCont.appendChild(epTitle);

    const epImg = document.createElement("img");
    epImg.setAttribute("class", "ep-img");
    epImg.setAttribute("src", episode.image.medium);

    article.appendChild(epTitleCont);
    article.appendChild(epImg);
    article.insertAdjacentHTML("beforeend", episode.summary);

    containerEpisodes.appendChild(article);
  }
}

function zeroPad(num) {
  return num < 10 ? `0${num}` : num;
}