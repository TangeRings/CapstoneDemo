from flask import Flask, request, jsonify, render_template
import replicate
import tempfile
import os
import boto3
from dotenv import load_dotenv
from flask_cors import CORS
from botocore.exceptions import NoCredentialsError
import time


load_dotenv()

bucket_name = "precopilot"
app = Flask(__name__)
model = replicate


s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

app = Flask(__name__)
CORS(app)


@app.route("/transcribe-audio", methods=["POST"])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    audio_file = request.files['audio']
    file_format = audio_file.content_type.split('/')[-1]

    try:
        # Create a unique file name using the current timestamp
        timestamp = int(time.time())
        file_name = f"audio-{timestamp}.{file_format}"

        # Set the temp directory path relative to the current working directory
        temp_dir = os.path.join(os.getcwd(), 'temp')
        temp_audio_path = os.path.join(temp_dir, file_name)

        # Ensure the temp directory exists
        os.makedirs(temp_dir, exist_ok=True)

        # Save the file to the temp directory
        audio_file.save(temp_audio_path)

        # Upload the file to S3
        s3.upload_file(temp_audio_path, bucket_name, file_name)

        # Generate a public URL for the uploaded file
        audio_file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"

        # Call the Replicate model to transcribe the audio
        output = model.run(
            "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
            input={
                "task": "transcribe",
                "audio": audio_file_url,
                "language": "english",
                "timestamp": "chunk",
                "batch_size": 64,
                "diarise_audio": False
            }
        )

        # Assuming output is a dictionary containing the transcript
        transcript = output.get('text', '')

        # Clean up the temp file
        os.remove(temp_audio_path)

        return jsonify({"transcript": transcript})
    except Exception as e:
        # Clean up the temp file in case of an error
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)

