from fastapi import FastAPI ,Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional,List
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,allow_origins=['http://localhost:3000']
,
allow_methods=['*'],
allow_headers=['*'])

# fake data — in real app this comes from database
QUESTIONS = [
    {"id": 1, "topic": "Cardiology",    "text": "What is the first-line treatment for hypertension?",   "difficulty": "easy"},
    {"id": 2, "topic": "Neurology",     "text": "What is the mechanism of action of aspirin?",          "difficulty": "medium"},
    {"id": 3, "topic": "Cardiology",    "text": "Describe the pathophysiology of heart failure.",        "difficulty": "hard"},
    {"id": 4, "topic": "Dermatology",   "text": "What are the features of basal cell carcinoma?",       "difficulty": "medium"},
    {"id": 5, "topic": "Neurology",     "text": "What is the Glasgow Coma Scale?",                      "difficulty": "easy"},
]

class Question(BaseModel):
    id:int
    topic:str
    text:str
    difficulty:str

@app.get('/questions',response_model=List[Question])
def get_questions(
    topic:Optional[str]=Query(None),
    difficulty:Optional[str]=Query(None)
    ):

    results = QUESTIONS
    if topic:
        results =[q for q in results if q[topic].lower()== topic.lower()]
    if difficulty:
        results = [q for q in results if q[difficulty].lower() == difficulty.lower()]

    return results

@app.get('/health')
def health():
    return {'status':'Ok'}


    