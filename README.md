# YouTubeRead 0.8

A personal project that extracts key information from YouTube videos and provides concise summaries.

## Description

Inspired by countless hours of scrolling through Youtube videos trying to find that thing I forgot.  This tool captures the auto-generated captions from Youtube videos and processes them using ChatGPT.  

## Features

- **~~Script~~ or Extension**
    - ~~Run either a script in the terminal (see test_scripts)~~  (BROKEN WHILE I UPDATE TUNNELBLASTER LOGIC)
    - Or use it as a browser extension!

- **Automatic Summarization**: 
    - Extract the most relevant content without manual input!  

- **Summarization Types**:  
    - Use _tunnelblaster_ to bounce down either a single URL or playlist!  

- **Side Panel** 
    - Information is now on the sidepanel, (or in firefox, the sidebar *ctrl+B*)
    - Now a dropdown menu for easy navigation!

- **Download Information**
    - Save the information to your PC
    - Saves as a markdown file
    - All summaries will be saved in browser for the ***session only***

- **Configuration Options**
    - Action popup now allows you to adjust the chat prompt!
    - This is synced across all devices!

- **State Management**
    - State is saved within session!  Open and close the sidebar with security.

- **DOTENV**
    - Store your API safely in a .env file in the root directory

- **COMING SOON**
    - QOL functions such as font changing, display options such as summary only
    - Bug testing

## Setup and Use  
<sub>(tl;dr Fire up the backend server with app.py, Place the appropriate manifest in the Extension Folder, load the extension in browser, open up sidepanel and go to a youtube page)</sub>

-   **Get OpenAI API**

1. Subscribe to openAI API and create API key:
    - Subscribe at https://openai.com/blog/openai-api
    - Create an API key
2. Set environment key:
    - Create a file named ".env" in the root directory of this project.  
    - In this file write "openaikey=YOURKEYHERE" on the first line

-   **Install the Dependencies**

1. Clone this repository:
    - git clone https://github.com/dannyrojo/YoutubeRead.git

2. Install the dependencies:
    - Navigate to "YoutubeRead/backend/"
    - (optional) create a virtual environment if you want with "python3 -m venv nameofvenv"
    - pip install -r requirements.txt 

3. ~~Run the test_scripts ~~
    - ~~Navigate to the test_scripts folder, these are fully functioning with either a single video or a whole playlist.~~
    - ~~python3 tunnelblaster.py https://www.YOUTUBEURL.com/watch?=aslifjasfl  (replace with your URL)~~
    - ~~The results will download to the test_scripts folder~~

-   **Start the Backend Server**

1.  Fire up the backend server:
    -In the backend folder run app.py ***(python3 app.py)***

-   **Install and Use the Extension**

1. Check the manifest file **Important -- MV3 requires different syntax for different browsers, choose the appropriate one!**
    - Go to manifest folder and pick chrome or firefox manifest.  Rename it to *manifest.json* 
    - Place the manifest in the root of VanillaExtension folder and delete any other manifests there.

2. Load the extension in your browser  
        
    Chrome:
    - Open chrome and turn on developer mode for extension, and click "load unpacked"
    - Load the contents of frontend/VanillaExtension
    - Click the sidebar button (looks like a shaded rectangle in a square) at the top right of the browser
    - Click on the dropdown menu and select "YoutubeRead"
    - Set your configuration in the extension popup (puzzle piece at the top of the browser)
    - Navigate to a youtube video or playlist and click "Fetch Info"

    Firefox:  
    - FYI: (Unfortunately, you will have to install this everytime you load up firefox, due to security) - If you know a workaround, let me know!
    - Go to "about:debugging" in the navigator and load a temporary extension.   Select the manifest.json *(make sure to select the correct one)* in the VanillaExtension folder.
    - Navigate to any youtube video then click the extension button at the top of the browser (it looks like a puzzle piece), *make sure to give permission to firefox!*
    - Open the side bar with "ctrl+B" and click "fetch info"

## Contributing

This is just a personal project to learn how to make useful stuff.  I welcome all feedback, suggestions, or contributions.

## License

I suppose this is licensed under the MIT License.

## Acknowledgements

Thanks to yt-dlp, langchain, openai, and the other various tools that can make things like this happen.  And of course to all the Youtube Content Creators sharing knowledge to interested people.  