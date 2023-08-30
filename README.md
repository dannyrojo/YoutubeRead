# YouTube Video Summarizer

A personal project that extracts key information from YouTube videos and provides concise summaries.

## Description

Inspired by countless hours of scrolling through Youtube videos trying to find that thing I forgot.  This tool captures the auto-generated captions from Youtube videos and processes them using ChatGPT.  

## Features

- **Automatic Summarization**: 
    - Extract the most relevant content without manual input.

- **Summarization Types**:  
    - Use _tunnelblaster_ to bounce down either a single URL or playlsit!  

## Setup and Use  (tl;dr Fire up the backend server with app.py, Adjust the manifest for chrome or firefox, load the extension in browser, go to youtube)

-   **Get OpenAI API**

1. Subscribe to openAI API and create API key:
    - Subscribe at https://openai.com/blog/openai-api
    - Create an API key
2. Set environment key:
    - In the terminal where you are running the scripts or app.py "export openaikey=YOURKEYHERE"

-   **Running the Python Scripts**

1. Clone this repository:
    - git clone https://github.com/dannyrojo/YoutubeRead.git

2. Install the dependencies:
    - Navigate to the backend folder (and create a virtual environment if you want with "python3 -m venv nameofvenv")
    - pip install -r requirements.txt

3. Run the test_scripts 
    - Navigate to the test_scripts folder, these are fully functioning  
    - python3 yt_summarizer.py https://YOUTUBEURL.com
    - These will download to the test_scripts folder

-   **Setting up the browser extension**

1. Start the backend server:
    -Navigate to the backend folder and run app.py after installing requirements.txt (see instructions for running Python Scripts)

2. Load the extension **Important -- You need to adjust the manifest.json file to run the background scripts**
    - Check the manifest.json file and adjust the background scripts setting.  Chrome uses service-workers, firefox does not. Comment out one you don't use.
        
        __Chrome__:
    -Open chrome and turn on developer mode for extension, and click "load unpacked"
    -Load the contents of frontend/VanillaExtension
    -Navigate to any youtube page and you will see a yellow bar with a blue button at the bottom of the page.  Wait for the summary to be fetched (10 seconds)

        __Firefox__:
    - Go to "about:debugging" in the navigator and load a temporary extension.   Select the manifest.json file in the VanillaExtension folder.
    - Navigate to any youtube video then click the extension button
    - Click fetch summary and wait 10 seconds



## Contributing

This is just a personal project to learn how to make useful stuff.  I welcome all feedback, suggestions, or contributions.

## License

I suppose this is licensed under the MIT License.

## Acknowledgements

Thanks to yt-dlp, langchain, openai, and the other various tools that can make things like this happen.  And of course to all the Youtube Content Creators sharing knowledge to interested people.  