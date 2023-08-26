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

    // Handle API response
    const responseData = await response.json();
    console.log('API response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error during API call:', error);
    return null;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'generateSummary') {
    try {
      const responseData = await fetchData(message.url);
      if (responseData) {
        const activeTab = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab.length > 0) {
          const tabId = activeTab[0].id;
          // Place the sendMessage call here, after responseData is available
          chrome.tabs.sendMessage(tabId, { action: 'injectData', data: responseData });
        }
      }
    } catch (error) {
      console.error('Error during generateSummary:', error);
    }
  }
});
