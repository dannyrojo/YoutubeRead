import yt_dlp
import requests
import urllib.request
import shutil
import xml.etree.ElementTree as ET
import argparse
from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter

def extract_metadata(video_url):
    ydl_opts = {'quiet':True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        metadata = ydl.extract_info(video_url, download=False)
        return metadata

def get_subtitle_url(metadata, lang):
    language_codes_to_check = [lang, lang.split('-')[0]]  # Create an array of possible subtitle keywords
    for code in language_codes_to_check:
        if 'automatic_captions' in metadata and code in metadata['automatic_captions']:
                for cap in metadata['automatic_captions'][code]:
                    if cap['ext'] == 'ttml':
                        return cap['url']
        if 'subtitles' in metadata and code in metadata['subtitles']:
            for sub in metadata['subtitles'][code]:
                if sub['ext'] == 'ttml':
                    return sub['url']
    return None  # Return None if URL not found
               
def get_plain_text_from_ttml(url):
    if url:    
        response = requests.get(url)
        if response.status_code == 200:
            root = ET.fromstring(response.content)
            texts = [elem.text.strip() for elem in root.iter() if elem.text]
            plain_text = " ".join(texts)    
            return plain_text
        else:
            print(f"Failed to retrieve captions content. Status codeD {response.status_code}")
    else:
        print("No valid URL for captions available.")
    return None
    
def map_reduce_and_summarize(plain_text):
    if plain_text:
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key="openaikey")
        num_tokens = llm.get_num_tokens(plain_text)
        print (f"Our text has {num_tokens} tokens")

        text_splitter = RecursiveCharacterTextSplitter(separators=[" "], chunk_size=10000, chunk_overlap=500)
        docs = text_splitter.create_documents([plain_text])
        
        num_docs = len(docs)
        num_tokens_first_document = llm.get_num_tokens(docs[0].page_content)
        num_tokens_last_document = llm.get_num_tokens(docs[-1].page_content)
        print (f"Now we have {num_docs} documents and the first one has {num_tokens_first_document} tokens, and the last one has {num_tokens_last_document}")
        
    
        map_prompt = """
        The following text has important information on how to use an API library, please write a summary that includes all information related to using the API. 
        "{text}"
        SUMMARY:
        """
        map_prompt_template = PromptTemplate(template=map_prompt, input_variables=["text"])
        
        combine_prompt = """
        The following text includes important information on using an API, please list the information in a numbered step by step way.
        '''{text}'''
        MAIN POINTS:
        """
        combine_prompt_template = PromptTemplate(template=combine_prompt, input_variables=["text"])
        summary_chain = load_summarize_chain(llm=llm,
                                            chain_type='map_reduce',
                                            map_prompt=map_prompt_template,
                                            combine_prompt=combine_prompt_template,
                                            verbose=False
                                            )
        summary = summary_chain.run(docs)
        return summary
    else:
        print("No valid plain text content available for summarization.")
        summary = "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! \n\n No valid captions for this video, so no summary.  WOMP WOMP WOMP \n\n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        return summary
    
def get_title_and_description(metadata):
    video_title = metadata.get('title')
    video_description = metadata.get('description')
    upload_date = metadata.get('upload_date')
    duration_string = metadata.get('duration_string')
    return video_title, video_description, upload_date, duration_string


def save_info(video_url, summary, video_title, video_description, upload_date, duration_string):    
        #Sanitize the video title
        sanitized_video_title = video_title.replace('/','_').replace('\\','_')        
        # Save video information to a text document
        with open(f'{sanitized_video_title}' + '_info.md', 'w') as md_file:
            md_file.write(f"Video Title: {video_title}\n")
            md_file.write(f"Duration: {duration_string}\n")
            md_file.write(f"URL: {video_url}\n")
            md_file.write(f"Upload Date: {upload_date}\n\n")
            md_file.write(f"Summary: {summary}\n\n")
            md_file.write(f"Video Description: {video_description}\n\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = "Provide the url, output path, and (potentially) areas of focus")
    parser.add_argument("url", help="URL of Video")
    #parser.add_argument("refine", help="Refine the summary with parameters")
    args = parser.parse_args()
    
    # Specify the video URL and output path
    video_url = args.url
  
    lang = "en-US"
   

    # Call the functions
    metadata = extract_metadata(video_url)
    subtitle_url = get_subtitle_url(metadata, lang)
    plain_text = get_plain_text_from_ttml(subtitle_url)
    summary = map_reduce_and_summarize(plain_text)
    video_title, video_description, upload_date, duration_string = get_title_and_description(metadata)
    save_info(video_url, summary, video_title, video_description, upload_date, duration_string)




