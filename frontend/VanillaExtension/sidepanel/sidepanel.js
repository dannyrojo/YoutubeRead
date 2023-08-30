  // A function to update the side panel's content with payload
  function updateSidePanelContent(infoArray) {
    
    // Identify the parent container
    const sidePanelContent = document.querySelector('.side-panel-content');
  
    // Clear existing content
    sidePanelContent.innerHTML = '';
  
    // Iterate over the payload
    for (const [index, info] of infoArray.entries()) {  //Destructure infoArray into index/value pair


        //Create a unique container
        const infoDiv = document.createElement('div');  //Create the divider
        infoDiv.classList.add('info-entry');  //Name the selector
        infoDiv.id = `info-${index}`; //Create a unique id

        //Add elements
        const title = document.createElement('h3');
        title.textContent = info.title;
        const url = document.createElement('p');
        url.textContent = info.url;
        const uploadDate = document.createElement('p');
        uploadDate.textContent = `Upload Date: ${info.upload_date}`;
        const duration = document.createElement('p');
        duration.textContent = `Duration: ${info.duration}`;
        const summary = document.createElement('p');
        summary.textContent = `Summary: ${info.summary}`;
        const description = document.createElement('p');
        description.textContent = `Description: ${info.description}`;
    
        //Append the elements
        infoDiv.appendChild(title);
        infoDiv.appendChild(url);
        infoDiv.appendChild(uploadDate);
        infoDiv.appendChild(duration);
        infoDiv.appendChild(summary);
        infoDiv.appendChild(description);
        
        //Print the container
        sidePanelContent.appendChild(infoDiv);
    }

    showCurrentObject();
  }

  // Listen for payload from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateSidePanel') {
      const payload = message.info;
      infoArray = payload.results //change the global
      console.log("Sidepanel received payload from background script:", infoArray);
      updateSidePanelContent(infoArray);
    }
  });

// Initialize a global variables for navigation
let infoArray = [];
let currentObjectIndex = 0;  

// A function for displaying the appropriate ObjectContainer(future: create logic to check against present video-url)
function showCurrentObject() {
  const containers = document.querySelectorAll('.info-entry'); //Grab all the entries
  
  containers.forEach((container, index) => { //Destructure the array of entries and index them
    if (index === currentObjectIndex) {
      container.style.display = 'block';  //Hide the element
    } else {
      container.style.display = 'none';  //Show the element
    }
  });
}

// Functions for navigation
function navigatePrevious(){
  currentObjectIndex = (currentObjectIndex -1 + infoArray.length) % infoArray.length;  //Change the global
  showCurrentObject();
}
function navigateNext() {
  currentObjectIndex = (currentObjectIndex + 1) % infoArray.length;  //Change the global
  showCurrentObject();
}

// Listeners for the buttons
document.getElementById('prev-button').addEventListener('click', navigatePrevious);
document.getElementById('next-button').addEventListener('click', navigateNext);