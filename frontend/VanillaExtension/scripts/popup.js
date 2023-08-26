const generateSummaryButton = document.getElementById('generateSummaryButton');

generateSummaryButton.addEventListener('click', () =>{
    getUrlFromActiveTab((url) => {
        chrome.runtime.sendMessage({action: 'generateSummary', url });    
    });    
});

function getUrlFromActiveTab(callback){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            const activeTab = tabs[0];
            const activeTabUrl = activeTab.url;
            callback(activeTabUrl);
        }
    });
}
  
