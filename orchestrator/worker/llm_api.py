from dotenv import load_dotenv
from openai import OpenAI
import os
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # type: ignore

def call_openai_api(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content

