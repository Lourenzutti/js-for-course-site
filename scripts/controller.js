// Add data to the current page history
//history.replaceState({ page: "index.html" }, "", "index.html")

const controller_functions = {};

// load the page with the back button
window.onpopstate = function (event) {
    load_page(event.state.page);
}

// loading the main tag
function load_page(path, path_js) {
    fetch(path + ".html")
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const html = parser.parseFromString(text, "text/html");
            text = html.querySelector("main").innerHTML;
            document.querySelector('main').innerHTML = text;
            return document;
        })
        .then(() => {
            load_from_md(path + "-page", "from-md");
            return document;
        })
        .then((document) => {
            if (path_js) controller_functions[path_js]();
        });
}

// add event listener to load the pages.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.onclick = (event) => {
            load_page(link.dataset.page, link.dataset.js);
            history.pushState({ page: link.dataset.page + ".html" }, "", link.dataset.page + ".html")
            return false;
        };
    });
});

function load_from_md(file) {
    const page = "https://ubc-stat.github.io" + "/stat-200/" + file;

    fetch(page)
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const html = parser.parseFromString(text, "text/html");
            let flag = false;
            const parent_div = html.querySelector("h1").parentElement;
            let tags = parent_div.childNodes;
            for (let i = 0; i < tags.length; i++) {
                if (flag == false && tags[i].tagName != "H1") {
                    continue;
                }
                if (flag == false && tags[i].tagName == "H1") {
                    flag = true;
                    continue;
                }
                document.getElementById("from-md").appendChild(tags[i]);
                i--;
            }
        });
}


