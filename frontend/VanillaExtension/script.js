document.addEventListener('DOMContentLoaded', function() {
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    const option3 = document.getElementById('option3');
    const readTextButton = document.getElementById('readTextButton');
  
    option1.addEventListener('change', function() {
      alert('Option 1 selected!');
      console.log('Read listener block');
    });
  
    option2.addEventListener('change', function() {
      alert('Option 2 selected!');
    });
  
    option3.addEventListener('change', function() {
      alert('Option 3 selected!');
    });
  
    readTextButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              function: () => {
                const specificElements = document.querySelectorAll('.single__content___9ekjR .rich-text:not(.sn-conversion) p');
                specificElements.forEach(element => {
                  element.textContent = 'New Text'; // Replace 'New Text' with the text you want to set
                });
              }
            }
          );
        });
      });
    });