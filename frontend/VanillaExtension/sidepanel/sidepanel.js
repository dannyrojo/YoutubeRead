/* DOM FUNCTIONS */

// Create the Event Listeners for Buttons
function createSidePanelListeners() {
  try {
      document.getElementById('fetch-info-button').addEventListener('click', fetchInformation);
      document.getElementById('prev-button').addEventListener('click', navigatePrevious);
      document.getElementById('next-button').addEventListener('click', navigateNext);
      } catch (error) {
          console.error('Event Listeners Missing:', error);
  }
}

// A function for increasing font size  (Need to add font button later)
function increaseTextSize() {
  const fontSizeIncrement = 2;  
  const changeDiv = document.getElementById('summaryDiv');  
  const currentFontSize = parseFloat(getComputedStyle(changeDiv).fontSize);  //Method for parsing the font size
  const newFontSize = currentFontSize + fontSizeIncrement + 'px';
  changeDiv.style.fontSize = newFontSize;
}

// Top level function runs on install
createSidePanelListeners();


//Functions that deal with navigation and display options

function navigatePrevious() {
  if (infoArray.length > 0) {  // Check if empty so it doesn't blank out
    currentObjectIndex = (currentObjectIndex - 1 + infoArray.length) % infoArray.length;
    showCurrentObjectInDom();
  }
}

function navigateNext() {
  if (infoArray.length > 0) {  
    currentObjectIndex = (currentObjectIndex + 1) % infoArray.length;
    showCurrentObjectInDom();
  }
}

// A function for displaying the appropriate container(future: create logic to check against present video-url, perhaps have a drop down list)
function showCurrentObjectInDom() {
  if (infoArray.length > 0) {  
    const containers = document.querySelectorAll('.info-entry'); //selects all the divs that have been appended so far
  
  containers.forEach((container, index) => {  //destructures the containers and updates the state with the divs that have been added so far
    if (index === currentObjectIndex) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
  }
}
// Globals for navigator, keeps a running record of current index state, but should probably set this up with the session storage API.
let infoArray = [];  
let currentObjectIndex = 0;  

/* FETCHING FUNCTIONS */

// This is the main callback function for the button 'click'
async function fetchInformation (){
  console.log("We have entered the fetchInformation Function.");
  const response = await sendMessageToFetchUrlList();
  console.log("The execution has passed the 'await sendMessageToFetchUrlList' function and it came back:", response)
  await storeUrlListToSession(response);
  console.log("The execution has passed the 'await storeUrlListToSession' function")
  await processUrlList(response);
}

// A function to peek into the "tab" with "tabs" API
async function getActiveTabUrl() {
  console.log("We have entered ActiveTabUrl Function")
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const hostUrl = activeTab.url;
  return hostUrl;
}

// A function that essentially delivers the hostUrl to the background script (and potentially stores the returned value if I combine them)
async function sendMessageToFetchUrlList() {
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

// You should combine this with the previous function for flow
async function storeUrlListToSession(input){
  try {
      chrome.storage.local.set({'urlList': input }); //Send the list of urls to storage (may need to reformat the object structure later)
     } catch (error) {
        console.error('urlList did not get store:', error);
    } 
}
async function processUrlList(input){
  for(const [index, value] of input.url_array.entries()){  //destructures the object (may need to reformat the object structure later)
    console.log("This is value, index:", value, " ", index);
    const info = await sendMessageToFetchInformation(value); //send to background -> API
    await storeVideoInformationToSession(info);
    updateSidePanelContent(info, index);
    showCurrentObjectInDom(index);  //update Navigator
  }
}

async function sendMessageToFetchInformation(input){
  console.log("Send message to Fetch Info recieved value:", input);
  const message = {action: 'fetchVideoInformation', url: input};
  const payload = await chrome.runtime.sendMessage(message);
  console.log("sendMessageToFetchInfo returned payload:", payload);
  return payload;
}
async function storeVideoInformationToSession(input){  //should change to session storage later
  try {
      chrome.storage.local.set({'videoInformation': input }); 
     } catch (error) {
        console.error('videoInformation did not get stored:', error);
    } 
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
  infoArray.push(info); // Add to navigator array (clean up later with session storage)
}