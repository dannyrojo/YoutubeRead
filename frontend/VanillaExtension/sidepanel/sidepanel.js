  // A function to update the side panel's content with payload
  function updateSidePanelContent(infoArray) {
    const sidePanelContent = document.querySelector('.side-panel-content');
  
    // Clear existing content
    sidePanelContent.innerHTML = '';
  
    
    for (const info of infoArray) {

        // Create elements 
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('video-entry');
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
        
        //Apply the elements
        sidePanelContent.appendChild(infoDiv);
    }
  }

  // Listen for payload from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateSidePanel') {
      const payload = message.info;
      const infoArray = payload.results
      console.log("Sidepanel received payload from background script:", infoArray);
      updateSidePanelContent(infoArray);
    }
  });
  
  
  
