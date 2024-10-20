# import os
# from flask import Flask, jsonify, request
# from PyPDF2 import PdfReader
# from transformers import pipeline
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for the entire app

# # Define the uploads directory
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the uploads directory exists

# # Summarizer
# summarizer = pipeline("summarization")

# # Function to extract text from the uploaded PDF
# def extract_text_from_pdf(pdf_path):
#     reader = PdfReader(pdf_path)
#     text = ""
#     for page in reader.pages:
#         page_text = page.extract_text()
#         if page_text:  # Check if text extraction was successful
#             text += page_text
#     return text

# @app.route('/upload', methods=['POST'])
# def upload_pdf():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     # Check if the uploaded file is a PDF
#     if file and file.filename.endswith('.pdf'):
#         filename = file.filename
#         file_path = os.path.join(UPLOAD_FOLDER, filename)

#         # Save the uploaded file
#         file.save(file_path)

#         # Extract text from the PDF
#         extracted_text = extract_text_from_pdf(file_path)

#         # Check if extracted text is empty
#         if not extracted_text.strip():
#             os.remove(file_path)  # Clean up the file if no text was extracted
#             return jsonify({"error": "No text extracted from the PDF."}), 400

#         # Summarize the extracted text
#         summary = summarizer(extracted_text, max_length=350, min_length=100, do_sample=False)

#         # Store the summary in a text file alongside the PDF
#         summary_path = os.path.join(UPLOAD_FOLDER, f"{filename}.summary.txt")
#         with open(summary_path, 'w') as summary_file:
#             summary_file.write(summary[0]['summary_text'])

#         return jsonify({
#             "filename": filename,
#             "summary": summary[0]['summary_text']
#         })
    
#     return jsonify({"error": "Invalid file format. Please upload a PDF file."}), 400

# @app.route('/files', methods=['GET'])
# def list_uploaded_files():
#     """Return a list of uploaded files."""
#     files = os.listdir(UPLOAD_FOLDER)
#     return jsonify({"files": files})

# @app.route('/summary/<filename>', methods=['GET'])
# def get_summary(filename):
#     """Return the summary for the specified uploaded file."""
#     summary_path = os.path.join(UPLOAD_FOLDER, f"{filename}.summary.txt")
#     if os.path.exists(summary_path):
#         with open(summary_path, 'r') as summary_file:
#             summary = summary_file.read()
#         return jsonify({"summary": summary})
#     return jsonify({"error": "Summary not found."}), 404

# @app.route('/delete/<filename>', methods=['DELETE'])
# def delete_file(filename):
#     """Delete the specified uploaded file and its summary."""
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     summary_path = os.path.join(UPLOAD_FOLDER, f"{filename}.summary.txt")

#     # Delete the PDF file if it exists
#     if os.path.exists(file_path):
#         os.remove(file_path)

#     # Delete the summary file if it exists
#     if os.path.exists(summary_path):
#         os.remove(summary_path)

#     return jsonify({"message": "File deleted successfully."})

# if __name__ == '__main__':
#     app.run(debug=True)

import os
from flask import Flask, jsonify, request
from PyPDF2 import PdfReader
from transformers import pipeline
from flask_cors import CORS
from PIL import Image
import pytesseract  # Add this import

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Define the uploads directory
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the uploads directory exists

# Summarizer
summarizer = pipeline("summarization")

# Function to extract text from the uploaded PDF
def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:  # Check if text extraction was successful
            text += page_text
    return text

# Function to extract text from the uploaded image
def extract_text_from_image(image_path):
    # Open the image file
    with Image.open(image_path) as img:
        # Use pytesseract to do OCR on the image
        text = pytesseract.image_to_string(img)
    return text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = file.filename
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # Save the uploaded file
    file.save(file_path)

    # Check the file extension
    if filename.endswith('.pdf'):
        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_path)
    elif filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        # Extract text from the image
        extracted_text = extract_text_from_image(file_path)
    else:
        return jsonify({"error": "Invalid file format. Please upload a PDF or image file."}), 400

    # Check if extracted text is empty
    if not extracted_text.strip():
        os.remove(file_path)  # Clean up the file if no text was extracted
        return jsonify({"error": "No text extracted from the file."}), 400

    # Summarize the extracted text
    summary = summarizer(extracted_text, max_length=60, min_length=50, do_sample=False)

    # Store the summary in a text file alongside the file
    summary_path = os.path.join(UPLOAD_FOLDER, f"{filename}.summary.txt")
    with open(summary_path, 'w') as summary_file:
        summary_file.write(summary[0]['summary_text'])

    return jsonify({
        "filename": filename,
        "summary": summary[0]['summary_text']
    })

@app.route('/files', methods=['GET'])
def list_uploaded_files():
    """Return a list of uploaded files."""
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify({"files": files})

@app.route('/summary/<filename>', methods=['GET'])
def get_summary(filename):
    """Return the summary for the specified uploaded file."""
    summary_path = os.path.join(UPLOAD_FOLDER, f"{filename}.summary.txt")
    if os.path.exists(summary_path):
        with open(summary_path, 'r') as summary_file:
            summary = summary_file.read()
        return jsonify({"summary": summary})
    return jsonify({"error": "Summary not found."}), 404

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete the specified uploaded file and its summary."""
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    summary_path = os.path.join(UPLOAD_FOLDER, f"{filename}.summary.txt")

    # Delete the uploaded file if it exists
    if os.path.exists(file_path):
        os.remove(file_path)

    # Delete the summary file if it exists
    if os.path.exists(summary_path):
        os.remove(summary_path)

    return jsonify({"message": "File deleted successfully."})

if __name__ == '__main__':
    app.run(debug=True)
