from fastapi import FastAPI
from pydantic import BaseModel
from QueryProcessor import process_user_query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    answer = process_user_query(request.question)
    return {"answer": answer}
