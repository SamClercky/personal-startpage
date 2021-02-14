function generateColorClass(name) {
    return name.split(" ").join("").toLowerCase();
}

function generateSection(name, links) {
    const section = document.createElement("section");

    const h3 = document.createElement("h3");
    h3.innerText = name;

    const ul = document.createElement("ul");
    for (const link of links) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const icon = document.createElement("i");
        const textNode = document.createTextNode(link.label);

        a.href = link.url;
        icon.className = `fa ${link.icon}`;

        ul.appendChild(li);
        li.appendChild(a);
        a.appendChild(icon);
        a.appendChild(textNode);
    }

    section.className = generateColorClass(name);

    section.appendChild(h3);
    section.appendChild(ul);

    return section;
}

function generateSelectOption(label, url) {
    const option = document.createElement("option");
    option.value = url;
    
    const text = document.createTextNode(label);
    option.appendChild(text);

    return option;
}

function formatDate(date) {
    const weekdays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
    const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    const day = weekdays[date.getDay()];
    const numberOfDay = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getYear() + 1900;

    return `${day}, ${numberOfDay} ${month} ${year}`;
}

function formatTime(date) {
    const hour = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const seconds = String(date.getSeconds()).padStart(2, 0);
    return `${hour}:${minutes}`;
}

function manageTime() {
    const datum = document.getElementById("datum");
    const timer = document.getElementById("timer");

    const updateTimer = () => {
        const now = new Date(Date.now());

        datum.innerText = formatDate(now);
        timer.innerText = formatTime(now);
    };

    updateTimer();
    setInterval(updateTimer, 60000);
}

function generateFullUrlFromEngine(engineName, searchQuery) {
    return engineName.replace(/{}/, searchQuery);
}

function manageSearch() {
    const searchForm = document.getElementById("search");
    searchForm.onsubmit = (evt) => {
        evt.preventDefault();
        
        const searchQuery = document.getElementsByName("search-query")[0].value;
        const engineString = document.getElementsByName("engine")[0].value;

        // check if is full url
        if (searchQuery.indexOf(".") != -1) {
            if (searchQuery.startsWith("http")) {
                window.location.href = searchQuery;
            } else {
                window.location.href = "https://" + searchQuery;
            }
        } else {
            window.location.href = generateFullUrlFromEngine(engineString, searchQuery);
        }
    }
}

function init() {
    // init SW
    registerWorker();

    // manage timer
    manageTime();

    // Search engines
    const engineSelector = document.getElementById("engine-select");

    for (const engine in searchEngines) {
        engineSelector.appendChild(generateSelectOption(engine, searchEngines[engine]));
    }

    // Global links
    const linkwrapper = document.getElementById("links");
    
    for (const section in sections) {
        linkwrapper.appendChild(generateSection(section, sections[section]));
    }

    manageSearch();
}

function registerWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async function() {
          try {
              const registraation = await navigator.serviceWorker.register("../sw.js");
              console.log("ServiceWorker registration succesful with scope: ", registraation.scope);
          } catch (err) {
              console.log("ServiceWorker registration failed: ", err);
          }
        });
      }
}

init();
