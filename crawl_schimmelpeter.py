import urllib.request
import urllib.parse
from html.parser import HTMLParser
import re
import os
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "https://www.schimmelpeter.de"
START_URLS = [
    "https://www.schimmelpeter.de/",
    "https://www.schimmelpeter.de/partner/wuppertal-kellersanierung",
    "https://www.schimmelpeter.de/schimmelbeseitigung",
    "https://www.schimmelpeter.de/feuchte-waende",
    "https://www.schimmelpeter.de/partner-suche",
    "https://www.schimmelpeter.de/ueber-uns",
    "https://www.schimmelpeter.de/horizontalsperre",
    "https://www.schimmelpeter.de/kellerabdichtung",
    "https://www.schimmelpeter.de/kellersanierung"
]

IMG_DIR = "D:/SOS24/assets-source/schimmelpeter"
os.makedirs(IMG_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

visited_urls = set()
pages_data = []
all_image_urls = set()
downloaded_images = []

class WebScraper(HTMLParser):
    def __init__(self, current_url):
        super().__init__()
        self.current_url = current_url
        self.title = ""
        self.in_title = False
        self.text_blocks = []
        self.current_tag = ""
        self.links = set()
        self.images = []

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        attr_dict = dict(attrs)

        if tag == "title":
            self.in_title = True

        # Extract links
        if tag == "a" and "href" in attr_dict:
            href = attr_dict["href"].strip()
            if href and not href.startswith(("#", "mailto:", "tel:", "javascript:")):
                full_link = urllib.parse.urljoin(self.current_url, href)
                # Keep within schimmelpeter.de
                if "schimmelpeter.de" in full_link:
                    # Strip fragment
                    clean_link = urllib.parse.urldefrag(full_link)[0]
                    self.links.add(clean_link)

        # Extract images
        src = attr_dict.get("src") or attr_dict.get("data-src")
        if tag == "img" and src:
            full_img = urllib.parse.urljoin(self.current_url, src.strip())
            alt = attr_dict.get("alt", "").strip()
            self.images.append((full_img, alt))
            all_image_urls.add((full_img, alt))

        # Check srcset
        srcset = attr_dict.get("srcset")
        if srcset:
            parts = [p.strip().split(" ")[0] for p in srcset.split(",") if p.strip()]
            for p in parts:
                full_img = urllib.parse.urljoin(self.current_url, p)
                all_image_urls.add((full_img, ""))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        self.current_tag = ""

    def handle_data(self, data):
        txt = data.strip()
        if not txt:
            return
        if self.in_title:
            self.title += txt
        elif self.current_tag in ["h1", "h2", "h3", "h4", "p", "li", "span", "div", "strong"]:
            self.text_blocks.append((self.current_tag, txt))

def fetch_page(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content_type = resp.headers.get_content_type()
            if "text/html" not in content_type:
                return None, None
            html = resp.read().decode("utf-8", errors="replace")
            return html, resp.geturl()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None, None

def download_image(img_url, alt=""):
    try:
        parsed = urllib.parse.urlparse(img_url)
        raw_name = os.path.basename(parsed.path)
        if not raw_name or "." not in raw_name:
            return None
        
        # Clean file name
        ext = os.path.splitext(raw_name)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"]:
            return None
        
        base_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', raw_name)
        target_path = os.path.join(IMG_DIR, base_name)
        
        if not os.path.exists(target_path):
            req = urllib.request.Request(img_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                if len(data) > 500: # avoid empty tracking pixels
                    with open(target_path, "wb") as f:
                        f.write(data)
                    print(f"  ✓ Downloaded: {base_name} ({len(data)} bytes)")
                    return {
                        "filename": base_name,
                        "rel_path": f"/assets-source/schimmelpeter/{base_name}",
                        "source": img_url,
                        "alt": alt,
                        "size": len(data)
                    }
        else:
            return {
                "filename": base_name,
                "rel_path": f"/assets-source/schimmelpeter/{base_name}",
                "source": img_url,
                "alt": alt,
                "size": os.path.getsize(target_path)
            }
    except Exception as e:
        # print(f"  Failed image {img_url}: {e}")
        return None

queue = list(START_URLS)

print("Starting SchimmelPeter.de crawl...")

while queue and len(visited_urls) < 18:
    url = queue.pop(0)
    if url in visited_urls:
        continue
    visited_urls.add(url)
    print(f"\nCrawling [{len(visited_urls)}]: {url}")
    
    html, final_url = fetch_page(url)
    if not html:
        continue

    parser = WebScraper(final_url or url)
    parser.feed(html)
    
    pages_data.append({
        "url": final_url or url,
        "title": parser.title,
        "texts": parser.text_blocks,
        "images": parser.images
    })

    # Add discovered links
    for l in parser.links:
        if l not in visited_urls and l not in queue:
            # Focus on key informational pages
            if not any(x in l for x in ["/datenschutz", "/impressum", "/agb", "/assets", "/files", ".pdf"]):
                queue.append(l)

print(f"\nCrawled {len(pages_data)} pages. Found {len(all_image_urls)} unique image URLs.")
print("\nDownloading images to D:/SOS24/assets-source/schimmelpeter/ ...")

for img_url, alt in sorted(all_image_urls):
    info = download_image(img_url, alt)
    if info:
        downloaded_images.append(info)

print(f"\nSuccessfully downloaded {len(downloaded_images)} images.")

# Write SCHIMMELPETER_WEBSITE_ARCHIVE.md
md_path = "D:/SOS24/SCHIMMELPETER_WEBSITE_ARCHIVE.md"
with open(md_path, "w", encoding="utf-8") as f:
    f.write("# SchimmelPeter® Website Archive & Media Catalog\n\n")
    f.write(f"- Source Domain: `https://www.schimmelpeter.de/`\n")
    f.write(f"- Total Pages Archived: {len(pages_data)}\n")
    f.write(f"- Total Downloaded Images: {len(downloaded_images)}\n")
    f.write(f"- Local Image Directory: `D:/SOS24/assets-source/schimmelpeter/`\n\n")
    
    f.write("## 1. Image Gallery Catalog\n\n")
    f.write("| Image | File Name | Size (KB) | Alt Text / Description |\n")
    f.write("| :--- | :--- | :--- | :--- |\n")
    for img in downloaded_images[:60]: # list top 60
        kb = round(img["size"] / 1024, 1)
        f.write(f"| ![{img['alt'] or img['filename']}](file:///D:/SOS24/assets-source/schimmelpeter/{img['filename']}) | `{img['filename']}` | {kb} KB | {img['alt'] or 'SchimmelPeter Fachbild'} |\n")
    f.write("\n---\n\n")
    
    f.write("## 2. Archived Page Contents\n\n")
    for p in pages_data:
        f.write(f"### Page: {p['title'] or p['url']}\n")
        f.write(f"- **URL**: [{p['url']}]({p['url']})\n\n")
        
        # Group text blocks into clean paragraphs
        current_heading = ""
        current_paras = []
        for tag, text in p["texts"]:
            if len(text) < 2:
                continue
            if tag in ["h1", "h2", "h3", "h4"]:
                if current_paras:
                    f.write(" ".join(current_paras) + "\n\n")
                    current_paras = []
                f.write(f"#### {text}\n\n")
            elif tag in ["p", "li"]:
                current_paras.append(text)
            elif tag in ["div", "span"] and len(text) > 40:
                current_paras.append(text)
        if current_paras:
            f.write(" ".join(current_paras) + "\n\n")
        f.write("\n---\n\n")

print(f"Archive written successfully to: {md_path}")
