// Create the callback function for generating the summary
async function fetchData(url) {
  try {
    const response = await fetch('http://127.0.0.1:5000/fetch_info', { //API CALL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url}),
    });


    const payload = await response.json();
    console.log('API response:', payload);
    return payload;
  } catch (error) {
    console.error('Error during API call:', error);
    return null;
  }
}

chrome.runtime.onMessage.addListener ((message, sender, sendResponse) => {
  processRequest(message).then(sendResponse);
  return true;
  });

async function processRequest(message){
  if (message.action === 'fetchSummary'){
    const url = message.url;
    const responseData = await fetchData(url)
    chrome.runtime.sendMessage({action: 'updateSidePanel', info: responseData}); //Send payload over to the sidepanel!
    console.log("Sending response data:", responseData);
    return responseData;
  }
}

