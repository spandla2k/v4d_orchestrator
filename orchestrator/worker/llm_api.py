from dotenv import load_dotenv
from openai import OpenAI
import os
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


def dummy_llm_response(prompt: str) -> str:
    return f"[OpenAI Key Missing]\nProcessed prompt:\n{prompt}"

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # type: ignore

def call_openai_api(prompt: str) -> str:
    if not client:
        return dummy_llm_response(prompt)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return dummy_llm_response(prompt)

