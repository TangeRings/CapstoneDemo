import streamlit as st
import pdfplumber
from io import BytesIO
import os
from openai import OpenAI
from dotenv import load_dotenv


# Initialize OpenAI client


load_dotenv()


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

def get_project_description(syllabus):
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




# Streamlit UI
st.title('PDF Project Description Extractor')

uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")

if uploaded_file is not None:
    pdf_file = BytesIO(uploaded_file.getvalue())
    extracted_text = extract_text_from_pdf(pdf_file)
    if st.button('Get Project Description'):
        description = get_project_description(extracted_text)
        st.text_area("Project Description", value=description, height=300)


