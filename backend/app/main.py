from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import users, groups, expenses, balances, chatbot 
from dotenv import load_dotenv
load_dotenv()

print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(expenses.router, prefix="/groups", tags=["Expenses"])
app.include_router(balances.router, tags=["Balances"])
app.include_router(chatbot.router, tags=["Chatbot"])
