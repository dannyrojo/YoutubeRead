function createNewDiv() {
    try {
        const newDiv = document.createElement('div');
        newDiv.id = 'summaryDiv'
        newDiv.textContent = 'Wait a little while for summary (10 seconds)'
        newDiv.style.backgroundColor = 'yellow';
        newDiv.style.position = 'fixed';
        newDiv.style.bottom = '0';
        newDiv.style.left = '0';
        newDiv.style.width = '100%';
        newDiv.style.padding = '10px';
        newDiv.style.zIndex = '9999';
        document.body.appendChild(newDiv);
        const generateSummaryButton = document.createElement('button');
        generateSummaryButton.textContent = 'Fetch Summary';
        generateSummaryButton.style.backgroundColor = 'blue';
        generateSummaryButton.style.color = 'white';
        generateSummaryButton.style.padding = '5px 10px';
        generateSummaryButton.style.border = 'none';
        generateSummaryButton.style.cursor = 'pointer';
        generateSummaryButton.addEventListener('click', fetchSummary);
        newDiv.appendChild(generateSummaryButton);
        const increaseTextSizeButton = document.createElement('button');
        increaseTextSizeButton.textContent = 'Increase Text Size';
        increaseTextSizeButton.style.backgroundColor = 'green';
        increaseTextSizeButton.style.color = 'white';
        increaseTextSizeButton.style.padding = '5px 10px';
        increaseTextSizeButton.style.border = 'none';
        increaseTextSizeButton.style.cursor = 'pointer';
        increaseTextSizeButton.addEventListener('click', increaseTextSize);
        newDiv.appendChild(increaseTextSizeButton);   
    } catch (error) {
            console.error('Error during div creation:', error);
    }
}

function increaseTextSize() {
    const fontSizeIncrement = 2;
    const changeDiv = document.getElementById('summaryDiv');
    const currentFontSize = parseFloat(getComputedStyle(changeDiv).fontSize);
    const newFontSize = currentFontSize + fontSizeIncrement + 'px';
    changeDiv.style.fontSize = newFontSize;
}


async function fetchSummary() {
    const currentUrl = window.location.href;
    const message = {action: 'fetchSummary', url: currentUrl};
    chrome.runtime.sendMessage(message, handleSummaryPayload); 
    }

function handleSummaryPayload(response) {
    console.log ("Content script recieved the payload:", response)
    
    const firstobject = response.results[0];
    const changeDiv = document.getElementById('summaryDiv');
    const summary = response.results[0].summary
  
    console.log("The summary looks like this:", summary);
    changeDiv.textContent = summary;

    document.body.appendChild(changeDiv);
}

function formatSummary(summaryObject) {
    const formattedSummary = `- ${summaryObject.summary}\n`                      
    return formattedSummary;
}

createNewDiv();


