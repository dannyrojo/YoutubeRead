/* TRANSIENT GLOBALS */
let globalConfigOptions = []

/* STATE */
document.addEventListener('DOMContentLoaded', onDomLoad);

function onDomLoad(){ 
  chrome.storage.sync.get(["storedOptions"]).then((result) => {
    if (result || result.storedOptions > 0){
      globalConfigOptions = result.storedOptions;
      console.log("The previous state was loaded:", result.storedOptions);
    }
    else if (!result || result.storedOptions.length < 1 || result.length < 1){
      const defaultConcise = {mapText : 'Please write a concise summary of the following:', reduceText : 'Please write a concise summary of the following:'};
      globalConfigOptions = [defaultConcise];
      console.log("No previous state found. Loading Default");
    }
    refreshDropdownMenu();
    object = getSelectedObject();
    setTextObject(object);
  });
}

/* LISTENERS */
document.getElementById('submitOptionButton').addEventListener('click', setConfig);
document.getElementById('addOptionButton').addEventListener('click', addOptionCallback);
document.getElementById('dropdownMenu').addEventListener('change', changeOption);
document.getElementById('removeOptionButton').addEventListener('click', removeOptionCallback);

/*BUTTON CALLBACKS*/
async function setConfig(){
  const object = getTextObject();
  storeCurrentConfig(object);
}
async function addOptionCallback(){
  object = getTextObject();
  addOption(object);
  refreshDropdownMenu();
  storeOptions();
}
async function changeOption(){
  object = getSelectedObject();
  setTextObject(object);
}
async function removeOptionCallback(){
  removeOption();
  refreshDropdownMenu();
  changeOption();
}


/* DOM FUNCTIONS */
function getTextObject(){ 
  mapText = document.getElementById('mapText').value;
  reduceText = document.getElementById('reduceText').value;
  return {mapText, reduceText};
}
function setTextObject(object){
  const mapText = object.mapText;
  const reduceText = object.reduceText; 
  document.getElementById('mapText').value = mapText;
  document.getElementById('reduceText').value = reduceText;
}

/* STORAGE FUNCTIONS */
async function storeCurrentConfig(object){ 
  const currentConfig = object;
  chrome.storage.sync.set({currentConfig : currentConfig});
  return console.log("currentConfig Stored:", currentConfig);
}
async function storeOptions(){
  chrome.storage.sync.set({storedOptions : globalConfigOptions});
  return console.log("Global Options Stored To Sync:", globalConfigOptions);
}

/* DROPDOWN FUNCTIONS */
function refreshDropdownMenu(){ 
  const dropdown = document.getElementById('dropdownMenu');
  dropdown.innerHTML = "";
  const options = globalConfigOptions;
  options.forEach((object, index) => {
    const map = object.mapText.substring(0,20);
    const reduce = object.reduceText.substring(0,20);
    const option = document.createElement('option');
    option.text = `${index} Map:${map}... Reduce:${reduce}...`;
    option.value = index;
    dropdown.appendChild(option);
  });
  const dropdownLength = options.length;
  dropdown.options[dropdownLength-1].selected = true;
  return console.log("Dropdown options populated.");
}
function getSelectedObject(){ 
  const dropdown = document.getElementById('dropdownMenu');
  const dropdownIndex = parseInt(dropdown.value, 10);
  const options = globalConfigOptions;
  const selectedOption = options[dropdownIndex];
  const mapText = selectedOption.mapText;
  const reduceText = selectedOption.reduceText;
  console.log("Dropdown Value Changed:", mapText, reduceText);
  return {mapText, reduceText};  
}
function removeOption(){
  const dropdown = document.getElementById('dropdownMenu');
  const dropdownIndex = parseInt(dropdown.value, 10);
  const options = globalConfigOptions;
  const removedOption = options.splice(dropdownIndex, 1);
  globalConfigOptions = options;
  chrome.storage.sync.set({storedOptions : globalConfigOptions});
  return console.log("Option removed:", removedOption);
}
function addOption(object){ 
  const newOptions = globalConfigOptions;
  newOptions.push(object);
  globalConfigOptions = newOptions;
  return console.log("New option stored to global (not storage):", object);
}