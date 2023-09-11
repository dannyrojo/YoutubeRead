/* TRANSIENT GLOBALS */ 

let globalInformationObject = [] 

/* STATE */

document.addEventListener('DOMContentLoaded', onDomLoad);
function onDomLoad(){
  chrome.storage.session.get(["storedInfo"]).then((result) => {
    if (result.storedInfo){
        console.log("ONLOAD: This info was pulled from storage:", result);
        globalInformationObject = result.storedInfo;
        refreshMenu();
      }
    });
}

/* LISTENERS */

document.getElementById('fetch-info-button').addEventListener('click', fetchCallback);
document.getElementById('prev-button').addEventListener('click', navPrevious);
document.getElementById('next-button').addEventListener('click', navNext);
document.getElementById('dropdownMenu').addEventListener('click', updateDom);
document.getElementById('download-info-button').addEventListener('click', downloadCurrentInfo);
document.getElementById('download-all-button').addEventListener('click', downloadAllInfo);
document.getElementById('description-toggle').addEventListener('click', toggleVisibility)
document.getElementById('increase-font').addEventListener('click', increaseFont)

/* FETCHING FUNCTIONS */

async function fetchCallback (){  //main callback function
  activeUrl = await getUrl();  // get the active window's URL
  config = await getCurrentConfig(); //get current promp configuration
  if (activeUrl !== null){
    const firstMessage = {action: 'fetchUrlList', url: activeUrl};  //checks if the url is a playlist on the backend
    const listPayload = await chrome.runtime.sendMessage(firstMessage);
    for(const [index, value] of listPayload.url_array.entries()){   //for loop sends messages so that summaries will display one at a time
        const secondMessage = {action: 'fetchVideoInformation', url: value, prompts: config};
        const infoPayload = await chrome.runtime.sendMessage(secondMessage);
        const info = infoPayload.video_info;
        addSummary(info);
        refreshMenu();
        storeInfo();  //save state
      }
  }
}
async function getUrl() { // Uses the "tabs" API
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;
  const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=.+|playlist\?list=.+)$/;
  if (youtubeUrlPattern.test(url)){
    return url;
  } else {
    return null;
  }
}

async function downloadCurrentInfo(){  //downloads as Markdown file
     //identify index via selected dropdown option
      const dropdown = document.getElementById('dropdownMenu');
      const dropdownIndex = parseInt(dropdown.value, 10);
      const globalInfo = globalInformationObject;
      const info = globalInfo[dropdownIndex];
      // convert to string
      var markdownText = `- **Title**: ${info.title}\n  **URL**: ${info.url}\n **Upload Date**: ${info.upload_date}\n **Duration**: ${info.duration}\n **Summary**: ${info.summary}\n **Description**: ${info.description}\n`;
      //make the binary
      var blob = new Blob([markdownText], {type: 'text/markdown'}); 
      // create a link
      var url = URL.createObjectURL(blob);
      //create a clean title for saving
      const cleanTitle = info.title 
      newTitle = cleanTitle.replace(/[^a-z0-9/s]/gi, '_').trim();  //learn more about regular expressions
      console.log("Clean Title:", newTitle);
      //download the binary and clear the link
      chrome.downloads.download({
        url: url,
        filename: `${newTitle}`,
        saveAs:true  // for a menu popup
      }, function(){URL.revokeObjectURL(url);
      })
};
async function downloadAllInfo(){  //downloads all info objects in global memory
  //identify index via selected dropdown option
   const globalInfo = globalInformationObject;
   for (const info of globalInfo){
      var markdownText = `- **Title**: ${info.title}\n  **URL**: ${info.url}\n **Upload Date**: ${info.upload_date}\n **Duration**: ${info.duration}\n **Summary**: ${info.summary}\n **Description**: ${info.description}\n`;
      var blob = new Blob([markdownText], {type: 'text/markdown'}); 
      var url = URL.createObjectURL(blob);
      const cleanTitle = info.title 
      newTitle = cleanTitle.replace(/[^a-z0-9/s]/gi, '_').trim();  //learn more about regular expressions
      console.log("Clean Title:", newTitle);
      chrome.downloads.download({
        url: url,
        filename: `${newTitle}`,
        saveAs:false //no menu popup
      }, function(){URL.revokeObjectURL(url);
      })
   }
};
async function getCurrentConfig(){  //pulls prompt configuration from sync storage
  object = chrome.storage.sync.get('currentConfig');
  console.log("Pulled current config from storage:", object);
  return object;
}
async function storeInfo (){  //stores global information object to session storage
  const storedInfo = globalInformationObject;
  await chrome.storage.session.set({storedInfo: storedInfo});
  return console.log("Stored information to session storage:", storedInfo);
}

/* NAV FUNCTIONS */

function navNext(){
  const dropdown = document.getElementById('dropdownMenu');
  if (dropdown.selectedIndex < dropdown.options.length - 1) {
    dropdown.selectedIndex += 1; 
  } else {
    dropdown.selectedIndex = 0;
  }
  updateDom();
}
function navPrevious(){
  const dropdown = document.getElementById('dropdownMenu');
  if (dropdown.selectedIndex > 0) {
    dropdown.selectedIndex -= 1; 
  } else {
    dropdown.selectedIndex = dropdown.length - 1;
  }
  updateDom();
}

/* DOM FUNCTIONS*/

function addSummary(object){ //pushes new summary to global information object
  const newObject = globalInformationObject;
  newObject.push(object);
  globalInformationObject = newObject;
  return console.log("New object stored to global (not storage):", object);
}
function refreshMenu(){  //updates the dropdown menu using global information object
  const dropdown = document.getElementById('dropdownMenu');
  dropdown.innerHTML = "";
  const summaries = globalInformationObject;
  summaries.forEach((object, index) => {
    const title = object.title.substring(0,20); //first 20 words of the title becomes dropdown title
    const option = document.createElement('option');
    option.text = `${index} : ${title}...`;
    option.value = index;
    dropdown.appendChild(option);
  });
  return console.log("Dropdown options populated.");
}
function updateDom(){  //prints summary to DOM using dropdown menu selection as index
  const dropdown = document.getElementById('dropdownMenu');
  const dropdownIndex = parseInt(dropdown.value, 10);
  const globalInfo = globalInformationObject;
  const info = globalInfo[dropdownIndex];
  const sidePanel = document.querySelector('.side-panel-content');
  sidePanel.innerHTML = "";

  //Create a unique container
  const infoDiv = document.createElement('div');  //Create the divider
  infoDiv.classList.add('info-entry');  //Name the selector
  infoDiv.id = "infoDiv";

  //Add elements
  const title = document.createElement('h3');
  title.textContent = info.title;
  const uploader_id = document.createElement('p');
  uploader_id.textContent = `Uploader: ${info.uploader_id}`;
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
  description.id = "description";

  //Append the elements
  infoDiv.appendChild(title);
  infoDiv.appendChild(uploader_id);
  infoDiv.appendChild(url);
  infoDiv.appendChild(uploadDate);
  infoDiv.appendChild(duration);
  infoDiv.appendChild(summary);
  infoDiv.appendChild(description);
  
  //Print the container
  sidePanel.appendChild(infoDiv);

  //Toggle display state
  toggleVisibility();
  return console.log("Modified DOM to display:", info);
}
function toggleVisibility(){
  descriptionToggle = document.getElementById('description-toggle');
  description = document.getElementById('description');
  if (descriptionToggle.checked){
    description.style.display = "none";
  } else {
    description.style.display = "block";
  }
}
/* STYLING FUNCTIONS */

function increaseFont() { 
  const fontSizeIncrement = 2;  
  const changeDiv = document.getElementById('infoDiv');  
  const currentFontSize = parseFloat(getComputedStyle(changeDiv).fontSize);  
  const newFontSize = currentFontSize + fontSizeIncrement + 'px';
  changeDiv.style.fontSize = newFontSize;
}