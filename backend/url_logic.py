from urllib.parse import urlparse, parse_qs, urlunparse

def clean_video_url(url):
    parsed_url = urlparse(url)
    qs = parse_qs(parsed_url.query)
    
    # If you want to handle playlist when &list= is detected
    # if "list" in qs:
    #     return f"https://www.youtube.com/playlist?list={qs['list'][0]}"
    
    # If you just want the single video URL, strip the extra params:
    if "v" in qs:
        return f"https://www.youtube.com/watch?v={qs['v'][0]}"
    
    # If neither a video or playlist, return original URL (or handle differently)
    return url
