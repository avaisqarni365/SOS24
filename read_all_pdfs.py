import os
import glob
import sys
from pypdf import PdfReader

# Ensure stdout handles UTF-8 / emojis safely
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

pdf_files = glob.glob("D:/SOS24/*.pdf")
print(f"Found {len(pdf_files)} PDF files.")

results = {}

for pdf_path in sorted(pdf_files):
    filename = os.path.basename(pdf_path)
    safe_name = filename.encode("ascii", errors="replace").decode("ascii")
    print(f"\nProcessing: {safe_name}")
    try:
        reader = PdfReader(pdf_path)
        num_pages = len(reader.pages)
        print(f"  Pages: {num_pages}")
        text_content = []
        for i, page in enumerate(reader.pages):
            txt = page.extract_text() or ""
            text_content.append(f"--- Page {i+1} ---\n{txt}")
        
        full_text = "\n".join(text_content)
        results[filename] = full_text
        
        # Save as a safe ASCII-named txt or utf-8 txt
        safe_base = "".join([c if c.isalnum() or c in " ._-" else "_" for c in filename])
        out_txt_path = f"D:/SOS24/{safe_base}.txt"
        with open(out_txt_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"  Saved extracted text to {safe_base}.txt ({len(full_text)} chars)")
    except Exception as e:
        print(f"  Error reading {safe_name}: {e}")

summary_path = "D:/SOS24/PDFS_SUMMARY.md"
with open(summary_path, "w", encoding="utf-8") as f:
    f.write("# Summary of Extracted PDFs in D:/SOS24\n\n")
    for fname, txt in results.items():
        f.write(f"## {fname}\n\n")
        f.write(f"- Character count: {len(txt)}\n\n")
        f.write("### Excerpt:\n```text\n")
        f.write(txt[:2000] + ("\n..." if len(txt) > 2000 else ""))
        f.write("\n```\n\n---\n\n")

print(f"\nCompleted! Written summary to {summary_path}")
