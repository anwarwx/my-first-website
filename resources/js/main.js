window.addEventListener("load", initialize);

function initialize() {
  const mode = document.querySelector(".mode");
  
  let load = window.localStorage.THEME;
  if (load)
    document.querySelector("link").href = `/css${load}`;
  
  mode.addEventListener("click", toggle_style);
}

function toggle_style() {
  const theme = window.localStorage.THEME;
  if (theme === "/main.css" || theme === undefined) {
    document.querySelector("link").href = "/css/main.dark.css";
    window.localStorage.THEME = "/main.dark.css";
  } else {
    document.querySelector("link").href = "/css/main.css";
    window.localStorage.THEME = "/main.css";
  }
}
