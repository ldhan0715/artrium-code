let cm_editor = CodeMirror.fromTextArea(document.querySelector("textarea"),{
    theme: "material",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    indentUnit: 3,
    autofocus: true,
    dragDrop: false,
    htmlMode: true,
    extraKeys: {"Ctrl-Space": "autocomplete", "Ctrl-/": "toggleComment"},
});

const languageLists = {
    js: "javascript",
    json: "javascript",
    html: "xml",
    rst: "rust",
    py: "python",
    sh: "shell",
    ps1: "powershell",
    rb: "ruby",
    md: "markdown",
    txt: ""
};

const keywords = ["const","var","let","func","function","def","class"];

let cm = document.querySelector(".CodeMirror");

function importLang(file) {
    let lang = languageLists[file.classList[1]];
    if (!lang) lang = file.classList[1];
    if (!document.head.querySelector(`script[src='https://codemirror.net/mode/${lang}/${lang}.js']`)) {
        const newScript = document.createElement("script");
        newScript.src = `https://codemirror.net/mode/${lang}/${lang}.js`;
        document.head.appendChild(newScript);
    }
}

function configure(event) {
    let lang = languageLists[event.target.classList[1]];
    if (!lang) lang = event.target.classList[1];
    cm_editor.setValue(files[event.target.id].code);
    setTimeout(() => cm_editor.setOption("mode",lang));
}

function saveChanges() {
    files[document.querySelector(".file.selected").id].code = cm_editor.getValue();
}

function syntaxHighlight() {
    document.querySelectorAll("span.cm-keyword").forEach((keyword) => {
        if (!keywords.includes(keyword.innerHTML)) {
            keyword.classList.add("cm-conditional");
        }
    });
    document.querySelectorAll("span.cm-variable").forEach((variable) => {
        document.querySelectorAll("span.cm-def").forEach((func) => {
            if (func.innerHTML === variable.innerHTML && !variable.classList.contains("cm-def")) {
                variable.classList.add("cm-def");
                variable.classList.remove("cm-variable");
            }
        });
    });
}

function init() {
    setInterval(() => {
        document.querySelectorAll(".file").forEach((shortcut) => {
            shortcut.addEventListener("click",configure);
            importLang(shortcut);
        })
        syntaxHighlight();
    });
    cm.querySelector("textarea").addEventListener("input",saveChanges);
}

init();