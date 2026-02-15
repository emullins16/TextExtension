
// Dictionary of words to fix
const WordFixer = {
    "the": "te",
    "that": "dat",
    "this": "dis",
    "these": "dese",
    "those": "dose",
    "with": "wit",
    // Adding more cs words
    "physics": "phys*cs",
    "shower": "sh*wer",
    "grass": "gr*ss",
    "exam": "ex*m",
    "homework": "h*mework",
    "group": "gr*up",
    "program": "pr*ject",
    "outside": "outs*de",
}

// lmaoooo we just exploded the website whoops
const skipTags = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "CODE",
  "PRE",
  "KBD",
  "SAMP",
  "VAR",
  "SELECT",
  "OPTION"
]);



// Function that actually replaces the words
function fixText(text) {

    // Replace page based on the WordFixer dictionary FIRST
    text = text.replace(/\b\w+\b/gi, function(word) {
        const lower = word.toLowerCase();
        if (WordFixer[lower]) {
            let fixed = WordFixer[lower];
            if (word[0] === word[0].toUpperCase()) {

                fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
            }
            return fixed;
        }
        return word;
    });
    
    // replace letters so the replaced words arent silly
    text = text
        .replace(/r/g, 'w')
        .replace(/R/g, 'W')
        .replace(/l/g, 'w')
        .replace(/ll/g, 'ww')
        .replace(/LL/g, 'WW');
    return text;
}

function shouldSkip(node) {
    if (!node.parentNode) return true;
    if (skipTags.has(node.parentNode.nodeName))
        return true;
    if (node.parentNode.isContentEditable) {
        return true;
    }
    return false;
}

// check if its turned on or not, luckily we can store this... allegedly locally
chrome.storage.local.get(["enabled"], result => {
  if (!result.enabled) return; 
  runReplacement(); 
});

// We are gonna walk through the tree instead of nuking the code
function replaceDocument(root) {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    let node;
    while (node = walker.nextNode()) {
        if (shouldSkip(node)) continue;
        node.textContent = fixText(node.textContent);
    }
}


// start/stop replacement based on toggle
function startObserver() {
    replaceDocument(document.body);

    observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceDocument(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}


chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled) {
    if (changes.enabled.newValue) startObserver();
    else stopObserver();
  }
});


chrome.storage.local.get(["enabled"], result => {
  if (result.enabled ?? true) startObserver();
});
