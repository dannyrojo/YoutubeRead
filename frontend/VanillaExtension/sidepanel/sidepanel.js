/* ON INSTALL (LISTENERS) */

function createSidePanelListeners() { // Create the Event Listeners for Buttons
  try {
      document.getElementById('fetch-info-button').addEventListener('click', fetchInformation);
      document.getElementById('prev-button').addEventListener('click', navigatePrevious);
      document.getElementById('next-button').addEventListener('click', navigateNext);
      document.getElementById('container-dropdown').addEventListener('change', changeContainer);
      document.getElementById('download-info-button').addEventListener('click', downloadCurrentInfo);
      } catch (error) {
          console.error('Event Listeners Missing:', error);
  }
}
createSidePanelListeners(); // Top level function runs on install

/* DOM FUNCTIONS */

function increaseTextSize() { // A function for increasing font size  
  const fontSizeIncrement = 2;  
  const changeDiv = document.getElementById('summaryDiv');  
  const currentFontSize = parseFloat(getComputedStyle(changeDiv).fontSize);  //Method for parsing the font size
  const newFontSize = currentFontSize + fontSizeIncrement + 'px';
  changeDiv.style.fontSize = newFontSize;
}
function updateSidePanelContent(info, index) {
  console.log("updateSidePanel got the info:", info);
  const input = info.video_info;   //may need to restrucure object structure later
  const sidePanelContent = document.querySelector('.side-panel-content');

  //Create a unique container
  const infoDiv = document.createElement('div');  //Create the divider
  infoDiv.classList.add('info-entry');  //Name the selector
  infoDiv.id = `info-${index}`; //Create a unique id

  //Add elements
  const title = document.createElement('h3');
  title.textContent = input.title;
  const url = document.createElement('p');
  url.textContent = input.url;
  const uploadDate = document.createElement('p');
  uploadDate.textContent = `Upload Date: ${input.upload_date}`;
  const duration = document.createElement('p');
  duration.textContent = `Duration: ${input.duration}`;
  const summary = document.createElement('p');
  summary.textContent = `Summary: ${input.summary}`;
  const description = document.createElement('p');
  description.textContent = `Description: ${input.description}`;

  //Append the elements
  infoDiv.appendChild(title);
  infoDiv.appendChild(url);
  infoDiv.appendChild(uploadDate);
  infoDiv.appendChild(duration);
  infoDiv.appendChild(summary);
  infoDiv.appendChild(description);
  
  //Print the container
  sidePanelContent.appendChild(infoDiv);
  console.log("ADDED THE CONTENT");
}

/* NAVIGATION FUNCTIONS */

let navigatorLength = 0;  // Globals for navigator, adjusted by storage listenere
let currentObjectIndex = 0;  

chrome.storage.onChanged.addListener(function(changes, namespace){
  if (namespace === "session" && changes.storedVideoInfo) {
    navigatorLength = changes.storedVideoInfo.newValue.length || 0;
    console.log("This is the new value of navigatorLength:", navigatorLength);
  }
});
function navigatePrevious() {
  if (navigatorLength > 0) {  // Check if empty so the navigation doesn't blank out
    currentObjectIndex = (currentObjectIndex - 1 + navigatorLength) % navigatorLength;
    showCurrentObjectInDom(currentObjectIndex);
  }
}
function navigateNext() {
  if (navigatorLength > 0) {  
    currentObjectIndex = (currentObjectIndex + 1) % navigatorLength;
    showCurrentObjectInDom(currentObjectIndex);
  }
}
function showCurrentObjectInDom(input) { // A function for displaying the appropriate container(perhaps have a drop down list)
  const containers = document.querySelectorAll('.info-entry'); //selects all the divs that have been appended so far
  console.log("The class selector pulled these containers:", containers);
  containers.forEach((container, index) => {  //destructures the containers and updates the state with the divs that have been added so far
    if (index === input) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
  console.log("SHOWING NEW OBJECT WITH NEW INDEX, CURRENTINDEX", currentObjectIndex);
}

/* DROP DOWN */

function populateDropdownOptions(){
  const dropdown = document.getElementById('container-dropdown');
  dropdown.innerHTML = '';
  const containers = document.querySelectorAll('.info-entry');
  containers.forEach((container, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.text = `Container ${index}`;
    dropdown.appendChild(option);
    console.log("New option added:", option.text);
  });
}
function changeContainer(){
  const dropdown = document.getElementById('container-dropdown');
  const selectedIndex = parseInt(dropdown.value, 10); // Don't forget to convert to Integer!  Dropdownw options only do strings.
  currentObjectIndex = selectedIndex;
  console.log("The dropdown was clicked and the selectedIndex was set to:", selectedIndex);
  showCurrentObjectInDom(currentObjectIndex);
}

/* STORAGE FUNCTIONS */

async function storeUrlListToSession(input) {
  // For debugging
  console.log("We just entered the storeUrlListToSession function");
  console.log("This url array will be stored to session storage:", input.url_array);
  // Retrieve stored data and append the new data
  chrome.storage.session.get(["storedUrlList"]).then((result) => { //storage is asynchronous so use promise instead of "await" on callback
    const storedData = result.storedUrlList || [];  //for maiden run checks if falsy
    console.log("This is the value of storedData in UrlList before it's appended:", storedData);
    const updatedData = storedData.concat(input.url_array);  //add the current iteration's urls
    console.log("This is the value that will be stored to storedUrlList:", updatedData);
    return chrome.storage.session.set({ storedUrlList: updatedData }); // return another asynchronous event 
  }).then(() => {
    console.log("Url List was stored successfully");
  }).catch((error) => {
    console.error('urlList did not get stored:', error);
  });
}
async function storeVideoInformationToSession(input){  //should change to session storage later
    console.log("We have juust entered the storeVideoInformationToSession function");
    console.log("This video information will be stored to session storage:", input.video_info);
    //Retrieve and append
    chrome.storage.session.get(["storedVideoInfo"]).then((result) => {
      const storedData = result.storedVideoInfo || [];
      console.log("This is the value of storedData in VideoInfo before it's appended:", storedData);
      const updatedData = storedData.concat(input.video_info);
      console.log("This is the value that will be stored in Video Info:", updatedData);
      return chrome.storage.session.set({storedVideoInfo: updatedData});
    }).then(() => {
      console.log("Video Info was stored successfully");
    }).catch((error) => {
      console.error('Video Info did not get stored:', error);
    });
}

/* DOWNLOAD FUNCTIONS */

async function downloadAllInfo(){
  //grab from storage
  chrome.storage.session.get(["storedVideoInfo"]).then((result) => {
      const storedData = result.storedVideoInfo;
      //identify index and pull object
      const index = currentObjectIndex;
      const info = storedData[index];
      console.log("THIS IS THE INFO PULLED FOR DOWNLOADING:", info);
      // convert to text by mapping and joining
      var markdownText = info.map(function(object){
        return `- **Title**: ${object.title}\n  **URL**: ${object.url}\n **Upload Date**: ${object.upload_date}\n **Duration**:${object.duration}\n **Summary**:${object.summary}\n **Description**:${object.summary}\n`;
      }).join('\n\n');
      var blob = new Blob([markdownText], {type: 'text/markdown'}); 
      var url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'data.md',
        saveAs:true
      }, function(){URL.revokeObjectURL(url);
      })
    });}
async function downloadCurrentInfo(){
  //grab from storage
  chrome.storage.session.get(["storedVideoInfo"]).then((result) => {
      const storedData = result.storedVideoInfo;
      //identify index and pull object
      const index = currentObjectIndex; //defined globally
      const info = storedData[index];
      console.log("THIS IS THE INFO PULLED FOR DOWNLOADING:", info);
      // convert to string
      var markdownText = `- **Title**: ${info.title}\n  **URL**: ${info.url}\n **Upload Date**: ${info.upload_date}\n **Duration**: ${info.duration}\n **Summary**: ${info.summary}\n **Description**: ${info.description}\n`;
      //make the binary
      var blob = new Blob([markdownText], {type: 'text/markdown'}); 
      // create a link
      var url = URL.createObjectURL(blob);
      //download the binary and clear the link
      chrome.downloads.download({
        url: url,
        filename: `${info.title}`,
        saveAs:true  // for a menu popup
      }, function(){URL.revokeObjectURL(url);
      })
    });
}

/* CONFIGURATION OPTIONS */


/* FETCHING FUNCTIONS */

async function fetchInformation (){ // This is the main callback function for the button 'click'
  console.log("We have entered the fetchInformation Function.");
  const response = await sendMessageToFetchUrlList();
  console.log("The execution has passed the 'await sendMessageToFetchUrlList' function and it came back:", response)
  await storeUrlListToSession(response);
  console.log("The execution has passed the 'await storeUrlListToSession' function")
  await processUrlList(response);
}
async function getActiveTabUrl() { // A function to peek into the "tab" with "tabs" API
  console.log("We have entered ActiveTabUrl Function")
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const hostUrl = activeTab.url;
  return hostUrl;
}
async function sendMessageToFetchUrlList() { // A function that essentially delivers the hostUrl to the background script 
  try {
    console.log("We have entered the sendMessageToFetchUrlList function")
    hostUrl = await getActiveTabUrl();
    console.log("HostUrl came through. Gonna send the message:", hostUrl);
    const message = { action: 'fetchUrlList', url: hostUrl };
    const payload = await chrome.runtime.sendMessage(message);
    console.log("sendMessageTofetchUrlList completing... payload returned:", payload);
    
    return payload;
    
  } catch (error) {
    console.error('Sending message to fetch UrlList failed:', error);
    
  }
}
async function processUrlList(input){
  for(const [index, value] of input.url_array.entries()){  //destructures the object (may need to reformat the object structure later)
    console.log("This is value, index:", value, " ", index);
    const info = await sendMessageToFetchInformation(value); //send to background -> API
    await storeVideoInformationToSession(info);
    updateSidePanelContent(info, index);
    showCurrentObjectInDom(currentObjectIndex);  //update Navigator
    populateDropdownOptions();
  }
}
async function sendMessageToFetchInformation(input){
  console.log("Send message to Fetch Info recieved value:", input);
  const message = {action: 'fetchVideoInformation', url: input};
  const payload = await chrome.runtime.sendMessage(message);
  console.log("sendMessageToFetchInfo returned payload:", payload);
  return payload;
}