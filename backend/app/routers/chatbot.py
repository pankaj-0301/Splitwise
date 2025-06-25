from fastapi import APIRouter, Body
from app.database import SessionLocal
from app import models
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv() 

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def get_context_from_db():
    db = SessionLocal()
    groups = db.query(models.Group).all()
    context = []

    for group in groups:
        group_data = {
            "name": group.name,
            "expenses": [],
            "users": []
        }

        users = db.query(models.User).join(models.GroupUser).filter(models.GroupUser.group_id == group.id).all()
        for user in users:
            group_data["users"].append({"id": user.id, "name": user.name})

        expenses = db.query(models.Expense).filter(models.Expense.group_id == group.id).all()
        for exp in expenses:
            splits = [
                {"user_id": s.user_id, "amount": s.amount}
                for s in db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == exp.id).all()
            ]
            group_data["expenses"].append({
                "description": exp.description,
                "amount": exp.amount,
                "paid_by": exp.paid_by,
                "split_type": exp.split_type,
                "splits": splits
            })

        context.append(group_data)

    db.close()
    return context

@router.post("/chatbot")
def ask_chatbot(message: str = Body(..., embed=True)):
    try:
        context_data = get_context_from_db()
        print("data is",context_data)
        prompt = f"""
        You are a helpful financial assistant.
        Below is user/group/expense data in JSON format:
        {context_data}

        Now answer this user query: "{message}"

        Respond clearly in 1-3 lines, only based on data provided.
        """
        response = model.generate_content(prompt)
        return {"reply": response.text.strip()}
    except Exception as e:
        return {"error": str(e)}
