// A function for creating the little yellow div at the bottom of the page
function createNewDiv() {
    try {
        //Create the div
        const newDiv = document.createElement('div');
        newDiv.id = 'summaryDiv'
        newDiv.textContent = 'Wait a little while for summary (10 seconds)'
        newDiv.style.backgroundColor = 'yellow';
        newDiv.style.position = 'fixed';
        newDiv.style.bottom = '0';
        newDiv.style.left = '0';
        newDiv.style.width = '100%';
        newDiv.style.padding = '10px';
        newDiv.style.zIndex = '9999';  //Might need to change (covers the youtube navigation slider)
        document.body.appendChild(newDiv); //Append it

        //Create the 'Fetch' button
        const generateSummaryButton = document.createElement('button');
        generateSummaryButton.textContent = 'Fetch Summary';
        generateSummaryButton.style.backgroundColor = 'blue';
        generateSummaryButton.style.color = 'white';
        generateSummaryButton.style.padding = '5px 10px';
        generateSummaryButton.style.border = 'none';
        generateSummaryButton.style.cursor = 'pointer';
        generateSummaryButton.addEventListener('click', fetchSummary);
        newDiv.appendChild(generateSummaryButton); //Append it

        //Create the "Font" Button's Div
        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'buttonDiv';
        buttonDiv.style.backgroundColor = 'yellow';
        buttonDiv.style.position = 'fixed';
        buttonDiv.style.bottom = '0';
        buttonDiv.style.left = '85%';
        buttonDiv.style.width = '15%';
        buttonDiv.style.padding = '10px';
        buttonDiv.style.zIndex = '9999';  //Might need to change (covers the youtube navigation slider)
        document.body.appendChild(buttonDiv); //Append it
        
        //Creat the "Font" Button
        const increaseTextSizeButton = document.createElement('button');
        increaseTextSizeButton.textContent = 'Increase Text Size';
        increaseTextSizeButton.style.backgroundColor = 'green';
        increaseTextSizeButton.style.color = 'white';
        increaseTextSizeButton.style.padding = '5px 10px';
        increaseTextSizeButton.style.border = 'none';
        increaseTextSizeButton.style.cursor = 'pointer';
        increaseTextSizeButton.addEventListener('click', increaseTextSize);
        buttonDiv.appendChild(increaseTextSizeButton); //Append it

    } catch (error) {
            console.error('Error during div creation:', error);
    }
}

// A function for increasing font size
function increaseTextSize() {
    const fontSizeIncrement = 2;  
    const changeDiv = document.getElementById('summaryDiv');  
    const currentFontSize = parseFloat(getComputedStyle(changeDiv).fontSize);  //Method for parsing the font size
    const newFontSize = currentFontSize + fontSizeIncrement + 'px';
    changeDiv.style.fontSize = newFontSize;
}

// A function for sending the current window's URL to the background script for processing (asynchronous because YOU WAIT, you must wait.)
async function fetchSummary() {
    const currentUrl = window.location.href;
    const message = {action: 'fetchSummary', url: currentUrl};
    chrome.runtime.sendMessage(message, handleSummaryPayload);  //Send message to background script
    }

// A function for parsing the response payload
function handleSummaryPayload(response) {
    console.log ("Content script recieved the payload:", response)  //Debug (switch to try block when time)
    
    //Destructure the array manually (needs refactoring for simplicity)
    const firstobject = response.results[0];
    const changeDiv = document.getElementById('summaryDiv');
    const summary = response.results[0].summary
    console.log("The summary looks like this:", summary);

    //Print the summary
    changeDiv.textContent = summary;

    document.body.appendChild(changeDiv);
}

function formatSummary(summaryObject) {
    const formattedSummary = `- ${summaryObject.summary}\n`                      
    return formattedSummary;
}

createNewDiv();


