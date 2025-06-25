from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{group_id}/expenses")
def add_expense(group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, group_id, expense)
