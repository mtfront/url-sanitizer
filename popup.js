chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    const url = tabs[0].url;

    const oldURLLabel = document.getElementById("original");
    oldURLLabel.value = url;
    oldURLLabel.addEventListener('input', (event) => {
        // reset hint
        const hint = document.getElementById("hint");
        hint.innerText = "";
        sanitizeURL(event.target.value);
    });
    // prefil sanitized URL
    const newURL = sanitizeURL(url);
    copyTextToClipboard(newURL)
});

function sanitizeURL(url) {
    if (url == null) {
        return;
    }
    let newURL = url;
    // youtube share use format like 
    // share: https://youtu.be/{vid}?si={sid} or
    // click: https://www.youtube.com/watch?v={vid}
    if (url.includes('youtu')) {
        newURL = url.split("?si")[0];
    } else {
        newURL = url.split("?")[0];
    }

    const newURLLabel = document.getElementById("sanitized");
    newURLLabel.value = newURL;

    const copy = document.getElementById("copy");
    copy.addEventListener("click", () => {copyTextToClipboard(newURL)});
    return newURL;
}

// https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension
// navigator.clipboard.writeText doesn't not work on mac for chrome 116.0.5845.179
function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to. 
    var copyFrom = document.createElement("textarea");
  
    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;
  
    //Append the textbox field into the body as a child. 
    //"execCommand()" only works when there exists selected text, and the text is inside 
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);
  
    //Select all the text!
    copyFrom.select();
  
    //Execute command
    document.execCommand('copy');
  
    //(Optional) De-select the text using blur(). 
    copyFrom.blur();
  
    //Remove the textbox field from the document.body, so no other JavaScript nor 
    //other elements can get access to this.
    document.body.removeChild(copyFrom);

    const hint = document.getElementById("hint");
    hint.innerText = "Copied to clipboard!";
  }