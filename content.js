
// Dictionary of words to fix
const WordFixer = {
    "the": "te",
    "that": "dat",
    "this": "dis",
    "these": "dese",
    "those": "dose",
    "with": "wit",
}

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

// Talk through the DOM and replace text nodes
function replaceText(node) {
    
    // try our hardest to not explode the web page by replacing text in script/style tags or input fields
    if (
        node.nodename === 'SCRIPT' ||
        node.nodename === 'STYLE' ||
        node.nodename === 'NOSCRIPT' ||
        node.nodename === 'input' ||
        node.nodename === 'textarea' ||
        node.nodename === 'code' ||
        node.nodename === 'pre'
    ) {
        return;
    }
    
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = fixText(node.textContent);
    } 
    else {
        node.childNodes.forEach(replaceText);
    }
}

replaceText(document.body);

// Observe for changes in the DOM to replace new text
new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(replaceText);
    });
}).observe(document.body, { 
        childList: true,
        subtree: true 
    });
