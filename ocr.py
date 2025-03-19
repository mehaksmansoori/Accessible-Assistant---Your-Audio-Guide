from PIL import Image
import pytesseract
import json

def extract_text(image_path):
    """Extract text from an image using Tesseract OCR."""
    image = Image.open(image_path).convert("RGB")
    text = pytesseract.image_to_string(image, lang='eng+hin')
    return text

def save_extracted_text(text, output_path):
    """Save the extracted text to a JSON file."""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({"extracted_text": text}, f, ensure_ascii=False)