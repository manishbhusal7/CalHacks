import os
import tempfile

import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directly set the API key (replace with your actual API key)
api_key = "AIzaSyBSLFV5q7w3j0VnxDW5zxmWGN-IaKa-abg"

# Configure genai with the API key
genai.configure(api_key=api_key)

@app.route('/summarize', methods=['POST'])
def summarize_pdf():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    # Create a temporary file to save the uploaded PDF
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        file.save(temp_file.name)  # Save the uploaded file
        temp_file_path = temp_file.name  # Get the temporary file path

    try:
        # Upload the file to Google Generative AI
        sample_pdf = genai.upload_file(temp_file_path)

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            "Give me a summary of this pdf file by removing the medical jargon and using easy words to make it easier for the user to understand",
            sample_pdf
        ])

        return jsonify({"summary": response.text})

    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == '__main__':
    app.run(debug=True)
