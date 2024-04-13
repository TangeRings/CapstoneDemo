# Syllabus.py
import pdfplumber
import os
from openai import OpenAI
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import logging



load_dotenv()
app = Flask(__name__)
CORS(app)


SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
SPREADSHEET_ID = os.getenv('GOOGLE_SHEETS_SPREADSHEET_ID')
RANGE_NAME = 'Sheet1'  # Update if your target sheet has a different name
VALUE_INPUT_OPTION = 'RAW'

credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
sheets_service = build('sheets', 'v4', credentials=credentials)


client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


def extract_text_from_pdf(pdf_file):
    """Extracts text from an uploaded PDF file."""
    all_text = ''
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            all_text += page.extract_text() + "\n"
    return all_text

def get_meeting_dates(syllabus):
    """Uses GPT to get the project description from the script."""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a college instructor teaching business and marketing courses."
            },
            {
                "role": "user",
                "content": f"This is a syllabus for a business course.\
                            Identify the meeting dates for the students and list the dates.\
                            Your response should only list the dates, for example\
                            2024-04-10 Meeting 1\
                            2024-05-20 Meeting 2\
                            Here is the syllabus: {syllabus}"
            }
        ]
    )

   
    return response.choices[0].message.content


def append_to_sheet(values):
    """Appends the parsed meeting details to a Google Sheet."""
    body = {'values': values}
    try:
        result = sheets_service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=RANGE_NAME,
            valueInputOption=VALUE_INPUT_OPTION,
            body=body
        ).execute()
        print("Sheet updated with new meeting info")
    except HttpError as error:
        print(f"Failed to update sheet: {error}")

def parse_and_prepare_data_for_spreadsheet(response_content):
    """Parse AI response and prepare data for Google Sheets."""
    lines = response_content.strip().split("\n")
    values_to_insert = []
    for line in lines:
        parts = line.split(' ', 1)
        if len(parts) == 2:
            date_str, filename = parts
            values_to_insert.append([filename, date_str, 'meeting', 'syllabus'])
    return values_to_insert

def process_syllabus_pdf(temp_pdf_path):
    """Process the uploaded syllabus PDF."""
    pdf_text = extract_text_from_pdf(temp_pdf_path)
    meeting_dates = get_meeting_dates(pdf_text)
    values = parse_and_prepare_data_for_spreadsheet(meeting_dates)
    append_to_sheet(values)


@app.route('/syllabus', methods=['POST'])
def upload_syllabus():
    # Check if a file is part of the uploaded request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Secure the filename and create a full temporary file path
    filename = secure_filename(file.filename)
    temp_dir = r"D:\VS Projects\CapstoneAssistantDemo\server\temp"
    temp_pdf_path = os.path.join(temp_dir, filename)

    # Ensure the temp directory exists
    os.makedirs(temp_dir, exist_ok=True)

    file.save(temp_pdf_path)

    try:
        # Process the uploaded syllabus PDF
        process_syllabus_pdf(temp_pdf_path)
        
        # Cleanup the temporary file
        os.remove(temp_pdf_path)
        
        return jsonify({"success": True, "message": "Syllabus processed and uploaded to the spreadsheet"}), 200
    except Exception as e:
        # Cleanup the temporary file in case of an error
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)
        return jsonify({"error": "An error occurred during processing", "details": str(e)}), 500
    


@app.route('/getlist', methods=['GET'])
def fetch_spreadsheet_data():
    try:
        # Specify the range of cells to fetch data from
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=RANGE_NAME
        ).execute()
        values = result.get('values', [])

        if not values:
            return jsonify({"error": "No data found."}), 404
        else:
            # Return the rows of data
            return jsonify(values), 200
    except HttpError as error:
        logging.error(f"Failed to fetch data from sheet: {error}")
        return jsonify({"error": "Failed to fetch data"}), 500


if __name__ == '__main__':
    app.run(port=5050)