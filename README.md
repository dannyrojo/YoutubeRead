# YouTubeRead 0.8

A personal project that extracts key information from YouTube videos and provides concise summaries.

## Description

Inspired by countless hours of scrolling through Youtube videos trying to find that thing I forgot.  This tool captures the auto-generated captions from Youtube videos and processes them using ChatGPT.  Use the browser's native popup button to open an options page.  Configure your prompts and fetch summaries based on those prompts using the browser's native sidepanel (or in firefox, sidebar)

## Features

- **Configuration Options**
    - Action popup now allows you to adjust the chat prompt!  
    - This is synced across all devices!
    - Click the puzzle piece in the corner of your browser.

- **Side Panel** 
    - Information is now on the sidepanel, (or in firefox, the sidebar *ctrl+B*)
    - Now a dropdown menu for to store your summaries for the session!

- **State Management**
    - State is saved within session! (*warning: will delete if you close browser*)  

- **Download Information**
    - Save any summary to your PC
    - Saves as a markdown file
   
- **DOTENV**
    - Store your API safely in a .env file in the root directory

- **Coming soon**
    - Style functions such as font changing and display options
    - Bug fixes

## Setup and Use  

<sub>tl;dr Install dependencies with "pip install -r requirements". Put the api key into ".env" file in root.  Fire up the backend server with "python3 app.py". Copy and rename manifest file for specific browser, chrome or firefox. Load the extension into your browser. Configure with popup action (puzzle).  Fetch info with sidepanel (ctrl+B in firefox).</sub>

1.   **Install the Dependencies**

- Clone this repository:
    - git clone https://github.com/dannyrojo/YoutubeRead.git

- Install the dependencies:
    - Navigate to "YoutubeRead/backend/"
    - (optional) create a virtual environment if you want with "python3 -m venv nameofvenv"
    - pip install -r requirements.txt 

2.   **Get OpenAI API**

- Subscribe to openAI API and create API key:
    - Subscribe at https://openai.com/blog/openai-api
    - Create an API key
- Set environment key:
    - Create a file named ".env" in the root directory of this project.  
    - In this file write "openaikey=YOURKEYHERE" on the first line

3.   **Start the Backend Server**

-  Fire up the backend API:
    - Navigate to the backend folder 
    - Start up the server "python3 app.py"

4.  **Install the Extension**

<sub>The manifest file is the director for most browser extension configurations.  Chrome and firefox converge on most manifest keywords, however in Manifest V3, many are still being phased in and out.  This means that for the time being we will need to have separate manifest files for each browser.  If you know a work around for this, please let me know!</sub>

- Check the manifest file (This is **Important!**) 
    - Go to manifest folder and pick chrome or firefox manifest.  Rename it to *manifest.json* 
    - Place the manifest in the root of VanillaExtension folder and delete any other manifests there. (There can be only one!)

- Load the extension in your browser  
        
    Chrome:
    - Open chrome and turn on developer mode for extension, and click "load unpacked"
    - Load the contents of frontend/VanillaExtension

    Firefox:  
    - FYI: (Unfortunately, you will have to install this everytime you load up firefox, due to security) - If you know a workaround, let me know!
    - Go to "about:debugging" in the navigator and load a temporary extension.   Select the manifest.json *(make sure to select the correct one)* in the VanillaExtension folder.
    
5.  **Use the Extension**

    Chrome: 
    - The popup action is a native button that looks like a puzzle piece in the top right.  Configure and set your prompts here.  You can add and remove prompts.  If you remove all prompts, next session will sync to the default prompt.   
    - Click the sidebar button (looks like a square with a sidebar) at the top right of the browser to open up the information display.
    - Click on the dropdown menu and select "YoutubeRead"
    - Navigate to a youtube video or playlist and click "Fetch Info"


    Firefox:
    - Firefox has security settings in place, click the native popup action (puzzle peice) at the top right to give permission to the extension.
    - The popup action will also allow you to configure you prompts.  If you remove all prompts, the next session will default to the original prompts.
    - After navigating to a youtube video or playlist, open the side bar with "ctrl+B" and click "fetch info"

## Configuring the Prompts

The popup action will allow you to set your prompts.  I suggest the following format,

        Map:  Please write a concise summary of the following:
        Reduce:  Please write a concise summary of the following:

This seems to be the quickest way to get a summary. If you would like to try different prompts, remember that the mapping phase seems to be the bottleneck.  If you write something like Map: "Rewrite the following text with only minor grammatical or syntatical changes" you can preserve most of the text, however, it will be a pretty slow turnaround.  Additionally, if you want to filter the results, use the Reduce prompt as a filter, like this, Reduce: "List and define important keywords related to machine learning in the following text:"

## Contributing

This is just a personal project to learn how to make useful stuff.  I welcome all feedback, suggestions, or contributions.

## License

I suppose this is licensed under the MIT License.

## Acknowledgements

Thanks to yt-dlp, langchain, openai, and the other various tools that can make things like this happen.  And of course to all the Youtube Content Creators sharing knowledge to interested people.  