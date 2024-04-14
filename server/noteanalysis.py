import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import traceback
from openai import OpenAI
import json
from dotenv import load_dotenv

# Initialize the Flask app and CORS
load_dotenv()
app = Flask(__name__)
CORS(app)

# Directory for storing uploaded files, relative to the script location
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")

# Initialize OpenAI client with your API key
openai_api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

def analyze_transcript(transcript):
    """Uses GPT to analyze the meeting transcript and provide outputs in a structured JSON-like format."""
    response = client.chat.completions.create(
        model="gpt-4",
        temperature=0.5,  # Adjust temperature as needed for creativity
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that summarizes meeting transcripts and lists action items in a university setting."
            },
            {
                "role": "user",
                "content": (
                    f"This is a transcript from a conversation between a professor and a student regarding a Capstone project: {transcript} "
                    "First summarize the main points in the conversation. Include key topics discussed. For example, "
                    "- Questions the students asked, concerns raised, and the professor's response; "
                    "- Questions the professor asked and the issues raised, and the student's responses. "
                    "Be concise and easy to read. The overall summary should not exceed 100 words."
    
                    "Then, reflect what was discussed and implied in the conversation, list the action items for the student, such as promised deliverables and tasks assigned by the professor. "
                    "Ensure your response is structured as follows in a JSON format: "
                    '{"Summary": ["Summary text"], "Action Points": ["- action 1", "- action 2", ...]}'
                )
            }
        ]
    )
    # The response content will then be parsed to separate summary and action items
    return response.choices[0].message.content

def parse_ai_response(response_content):
    """Parse AI response to extract summary and action items."""
    try:
        response_data = json.loads(response_content)
        summary = response_data["Summary"]
        action_points = response_data["Action Points"]
        # Remove the leading '- ' from each action point and strip whitespace
        action_items = [{"label": item.lstrip('- ').strip(), "checked": False} for item in action_points]
        return summary, action_items
    except json.JSONDecodeError:
        app.logger.error("Failed to decode AI response as JSON.")
        return "Failed to parse summary and action items.", []

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = secure_filename(file.filename)
    temp_path = os.path.join(TEMP_DIR, filename)
    os.makedirs(TEMP_DIR, exist_ok=True)
    file.save(temp_path)

    try:
        with open(temp_path, 'r') as text_file:
            transcript_content = text_file.read()

        # Analyze the transcript using OpenAI
        ai_response = analyze_transcript(transcript_content)

        # Print the AI response in the terminal for debugging
        print("AI Response:", ai_response)

        # Parse the response to separate summary and action items
        summary, action_items = parse_ai_response(ai_response)

        # Print the parsed summary and action items for debugging
        print("Parsed Summary:", summary)
        print("Parsed Action Items:", action_items)

        # Remove the temporary file after processing
        os.remove(temp_path)
        
        return jsonify({"documentId": filename, "summary": summary, "actionItems": action_items}), 200
    except Exception as e:
        traceback_str = ''.join(traceback.format_tb(e.__traceback__))
        app.logger.error(f"Exception: {e}")
        app.logger.error(f"Traceback: {traceback_str}")
        # Ensure the temporary file is cleaned up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": "An error occurred during processing", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(port=7070)



