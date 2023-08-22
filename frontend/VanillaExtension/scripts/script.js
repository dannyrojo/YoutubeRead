// Construct variables for popup elements
const generateSummaryButton = document.getElementById('generateSummaryButton');

// Add event listeners for settings (popup)
generateSummaryButton.addEventListener('click', handleGenerateSummaryButtonClick);

// Create the callback function for generating the summary
async function handleGenerateSummaryButtonClick() {
  try {
    // Extract URL using async/await
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) {
      throw new Error('No active tab found.');
    }
    const activeTab = tabs[0];
    const url = activeTab.url;

    // Prepare data
    const data = { url: url };
    console.log(data)

    // Send to API using fetch
    const response = await fetch('http://127.0.0.1:5000/fetch_webpage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Handle API response
    const responseData = await response.json();
    console.log('API response:', responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}
