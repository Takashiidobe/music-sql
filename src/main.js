import throttle from "lodash.throttle";

const API_URL = "https://music-api.takashiidobe.com/api/sql";

let params = new URLSearchParams(document.location.search);
let query = params.get("q") || "";

document.getElementsByTagName("textarea")[0].value = query;
let input = document.getElementsByTagName("textarea")[0];

function removeChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

let throttled = throttle(async () => {
  await fetchData();
}, 1000);

async function fetchData() {
  var table = document.getElementsByTagName("table")[0];
  var thead = document.getElementsByTagName("thead")[0];
  var tbody = document.getElementsByTagName("tbody")[0];
  var header = document.querySelector(".header");

  let data = await fetch(API_URL, {
    method: "POST",
    credentials: "same-origin",
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: input.value,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });

  if (data.length) {
    removeChildNodes(header);
    let keys = Object.keys(data[0]);
    removeChildNodes(tbody);
    for (const key of keys) {
      let th = document.createElement("th");
      th.textContent = key;
      header.appendChild(th);
    }
    for (const obj of data) {
      let tr = document.createElement("tr");
      for (const val of Object.values(obj)) {
        let td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
}

function filterInput() {
  try {
    throttled();
  } catch (err) {
    console.log(err.message);
  }
}

input.addEventListener("keyup", function (event) {
  let searchParams = new URLSearchParams(window.location.search);

  searchParams.set("q", event.target.value);

  if (window.history.replaceState) {
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();

    window.history.replaceState(
      {
        path: url,
      },
      "",
      url
    );
  }
  filterInput();
});

filterInput();
