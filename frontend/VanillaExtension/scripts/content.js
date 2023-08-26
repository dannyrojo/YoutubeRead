async function injectDataIntoDOM(data) {
    try {
        const tabIdArray = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabIdArray.length > 0) {
            const tabId = tabIdArray[0].id;
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: createDiv,
                args: [data],
            });
        } else {
            console.error('No active tab found.');
        }
    } catch (error) {
        console.error('Error during DOM injection:', error);
    }
}

async function createDiv(data) {
    try {
        const newDiv = document.createElement('div');
        newDiv.textContent = `${data.video_title}, ${data.summary}, ${data.video_duration}`;
        newDiv.style.backgroundColor = 'yellow';
        newDiv.style.position = 'fixed';
        newDiv.style.bottom = '0';
        newDiv.style.left = '0';
        newDiv.style.width = '100%';
        newDiv.style.padding = '10px';
        newDiv.style.zIndex = '9999';

        await new Promise(resolve => {
            document.body.appendChild(newDiv);
            resolve();
        });
    } catch (error) {
        console.error('Error during div creation:', error);
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'injectData') {
        try {
            await injectDataIntoDOM(message.data);
        } catch (error) {
            console.error('Error during data injection:', error);
        }
    }
});
