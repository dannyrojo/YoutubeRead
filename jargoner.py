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
    
def get_subtitle_url(metadata, lang, fmt):
    if 'automatic_captions' in metadata:
        if lang in metadata['automatic_captions']:
            for cap in metadata['automatic_captions'][lang]:
                if cap['ext'] == fmt:
                    return cap['url']
                
def get_plain_text_from_ttml(url):
    response = requests.get(url)
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        texts = [elem.text.strip() for elem in root.iter() if elem.text]
        plain_text = " ".join(texts)    
        return plain_text
    else:
        return None
    
def map_reduce_and_summarize(plain_text):
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
    Write a list of important concepts, technical jargon, and key terms discussed in this text: 
    "{text}"
    List of key terms:
    """
    map_prompt_template = PromptTemplate(template=map_prompt, input_variables=["text"])
    
    combine_prompt = """
    Write a concise explanation of each term in the following text delimited by triple backquotes.  Return your response in bullet points which explains eaech term.
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
    
def get_title_and_description(metadata):
    video_title = metadata.get('title')
    video_description = metadata.get('description')
    return video_title, video_description


def save_info(video_url, output_path, summary, video_title, video_description):    
        # Save video information to a text document
        with open(output_path + '_info.txt', 'w') as info_file:
            info_file.write(f"Video Title: {video_title}\n\n")
            info_file.write(f"Summary: {summary}\n\n")
            info_file.write(f"Video Description: {video_description}\n\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = "Provide the url, output path, and (potentially) areas of focus")
    parser.add_argument("url", help="URL of Video")
    parser.add_argument("file", help="Where do you want to save it")
    #parser.add_argument("refine", help="Refine the summary with parameters")
    args = parser.parse_args()
    
    # Specify the video URL and output path
    video_url = args.url
    output_path = args.file
    lang = "en"
    fmt = "ttml"

    # Call the functions
    metadata = extract_metadata(video_url)
    subtitle_url = get_subtitle_url(metadata, lang, fmt)
    plain_text = get_plain_text_from_ttml(subtitle_url)
    summary = map_reduce_and_summarize(plain_text)
    video_title, video_description = get_title_and_description(metadata)
    save_info(video_url, output_path, summary, video_title, video_description)

# Backup definitions for testing
#video_url = 'https://youtu.be/tBUBKQ4yjrc'
#output_path = 'video_info'
#lang = "en"
#fmt = "ttml"


