
// Dictionary of words to fix
const WordFixer = {
    "the": "te",
    "that": "dat",
    "this": "dis",
    "these": "dese",
    "those": "dose",
    "with": "wit",
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


// We are gonna walk through the tree instead of nuking the code
function replacedocument(root) {

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

// Run it (please dont break please dont break)
replaceDocument(document.body);

const observer = new MutationObserver(mutations => {

    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            replaceDocument(node);
        });
    });
});

// Observe the entire body for changes then update?
observer.observe(document.body, {
    childList: true,
    subtree: true
});
