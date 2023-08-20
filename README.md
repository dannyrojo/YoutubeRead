# YouTube Video Summarizer

A personal project that extracts key information from YouTube videos and provides concise summaries.

## Description

Inspired by countless hours of scrolling through Youtube videos trying to find that thing I forgot.  This tool captures the auto-generated captions from Youtube videos and processes them using ChatGPT.  

## Features

- **Automatic Summarization**: 
    - Extract the most relevant content without manual input.

- **Multiple Summarization Types**:  
    - Use _jargoner_ for brand new topics you've never heard of.  Extracts key terms and defines them.  
    - Use  _howtutor_ to extract a step by step instructions.  (needs some work)
    - Use _tunnelblaster_ to bounce down an entire playlist using the _ytsummarizer_.  Make sure you use a playlist URL.

## Setup and Use

1. Clone this repository:
    git clone https://github.com/dannyrojo/YoutubeRead.git

2. Run the scripts with the URL as your argument, they'll       download to the root folder in markdown.  
    python3 yt_summarizer.py https://YOUTUBEURL.com


## Contributing

This is just a personal project to learn how to make useful stuff.  I welcome all feedback, suggestions, or contributions.

## License

I suppose this is licensed under the MIT License.

## Acknowledgements

Thanks to yt-dlp, langchain, openai, and the other various tools that can make things like this happen.  And of course to all the Youtube Content Creators sharing knowledge to interested people.  