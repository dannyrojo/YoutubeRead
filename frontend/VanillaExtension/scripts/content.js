function createNewDiv() {
    try {
        const newDiv = document.createElement('div');
        newDiv.id = 'summaryDiv'
        newDiv.textContent = 'Summary goes here.'
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
    } catch (error) {
            console.error('Error during div creation:', error);
    }
}

async function fetchSummary() {
    const currentUrl = window.location.href;
    const message = {action: 'fetchSummary', url: currentUrl};
    chrome.runtime.sendMessage(message, handleSummaryPayload); 
    }

function handleSummaryPayload(response) {
    console.log ("Content script recieved the payload:", response)
    
    const firstobject = response.results[0];
    console.log("The first object looks like this:", firstobject);

    const changeDiv = document.getElementById('summaryDiv');
    const summary = response.results[0].summary
    //const formattedSummary = formatSummary(summary);
    console.log("The summary looks like this:", summary);
    changeDiv.textContent = summary;

    document.body.appendChild(changeDiv);
}

function formatSummary(summaryObject) {
    const formattedSummary = `- ${summaryObject.summary}\n`                      
    return formattedSummary;
}

createNewDiv();


