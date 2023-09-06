/* SUBMITTING OPTIONS */

//Listen for button click
document.getElementById('submitOptionsButton').addEventListener('click', updatePrompt);

async function updatePrompt(){
//Grab the text from the form
    formText = document.getElementById('configurationText').value;
    console.log("This is the text in the form:", formText);
//Send the configuration option to the sidepanel for message passing.
    const message = { action: 'updatePrompt', prompt: formText };
    const payload = await chrome.runtime.sendMessage(message);
}


/* SAVING CONFIGURATION */

//Store the text to sync storage and create a new container option

//Delete the container and associated text