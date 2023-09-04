// This function's async is NOW working properly
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // Do not mark the callback function as "async" it will break the whole dang thing.
  if (message.action === 'fetchUrlList') {
    fetch_array(message.url)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: "An error occurred while fetching array" }));
    return true;  // Return true to indicate asynchronous response in Chrome API, will break if used with async callback.  don't mix callbacks and promises!
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // Do not mark the callback function as "async" it will break the whole damn thing.
  if (message.action === 'fetchVideoInformation') {
    fetch_video_info(message.url)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: "An error occurred while fetching video Info" }));
    return true;  // Return true to indicate you wish to send a response asynchronously
  }
});

// You do you beau. 
async function fetch_array(url) {
  try {
    const response = await fetch('http://127.0.0.1:5000/fetch_url_array', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url}),
    });

    const payload = await response.json();
    console.log('background received response from fetch_url_array:', payload);
    return payload;

  } catch (error) {
    console.error('Error during background reception from fetch_url_array:', error);
    throw error;
  }
}



// Perfection
async function fetch_video_info(url) {
  try {
    const response = await fetch('http://127.0.0.1:5000/fetch_video_info', { //Fetch the url_array
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url}),
    });

    const payload = await response.json();
    console.log('background receieved response from fetch_video_info:', payload);  //debug
    
    return payload;

  } catch (error) {
    console.error('Error during background reception from fetch_video_info:', error);
    return null;
  }
}


