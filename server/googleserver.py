from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.errors import HttpError
from datetime import datetime
from dotenv import load_dotenv
import logging
import os

# Initialize logging
logging.basicConfig(level=logging.INFO, filename='app.log', filemode='a',
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)

# Google Drive and Sheets setup
SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
FOLDER_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID')
SPREADSHEET_ID = os.getenv('GOOGLE_SHEETS_SPREADSHEET_ID')
RANGE_NAME = 'Sheet1'  # Update if your target sheet has a different name
VALUE_INPUT_OPTION = 'RAW'

credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=credentials)
sheets_service = build('sheets', 'v4', credentials=credentials)

def append_to_sheet(student_id, filename, upload_date, file_format, source, file_id, file_url):
    """Appends the upload details to a Google Sheet."""
    values = [
        [student_id, filename, upload_date, file_format, source, file_id, file_url]
    ]
    body = {'values': values}
    try:
        result = sheets_service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=RANGE_NAME,
            valueInputOption=VALUE_INPUT_OPTION,
            body=body
        ).execute()
        logging.info(f"Sheet updated with file info: {filename}")
    except HttpError as error:
        logging.error(f"Failed to update sheet: {error}")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    student_id = request.form.get('studentId', 'Unknown')
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_format = file.content_type.split('/')[-1]

    file_metadata = {'name': filename, 'parents': [FOLDER_ID]}
    media = MediaIoBaseUpload(file, mimetype=file.content_type, resumable=True)
    try:
        created_file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        file_id = created_file.get('id')
        file_url = f"https://drive.google.com/file/d/{file_id}/view"
        logging.info(f"File {filename} uploaded successfully to Google Drive with ID {created_file.get('id')}")
        # Append file details to Google Sheet
        append_to_sheet(student_id, filename, datetime.now().strftime('%Y-%m-%d'), file_format, 'upload', file_id, file_url)
        return jsonify({"success": True, "fileId": created_file.get('id')}), 200
    except HttpError as http_err:
        logging.error(f"Google API error: {http_err}")
        return jsonify({"error": "Google API error", "details": str(http_err)}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500
    
    


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
    app.run(debug=True)


