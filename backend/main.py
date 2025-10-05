from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
import os

from dotenv import load_dotenv

# Load variables from .env (placed in project root)
load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")  

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    mode: str
    question: str
    personalData: dict | None = None


if not HF_API_KEY:
    raise RuntimeError("HF_API_KEY is not set")

client = InferenceClient(provider="nebius", api_key=HF_API_KEY)
MODEL_ID = "google/gemma-2-2b-it"


@app.post("/ask")
def ask_agent(req: Query):
    system = (
        "Answer concisely. Use GBP (£) and UK market context where prices are relevant."
    )
    user_content = f"Mode: {req.mode}\nQuestion: {req.question}"
    if req.mode == "personal" and req.personalData:
        user_content += f"\nPersonal Data: {req.personalData}"

    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user_content},
    ]

    try:
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=messages,
            max_tokens=512,
            temperature=0.3,
            top_p=0.9,
        )
        text = completion.choices[0].message.content if completion.choices else ""
        return {"response": text}
    except Exception as e:
        return {"response": f"Error generating response: {e}"}
