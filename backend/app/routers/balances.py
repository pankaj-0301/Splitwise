from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/groups/{group_id}/balances")
def group_balances(group_id: int, db: Session = Depends(get_db)):
    return crud.calculate_group_balances(db, group_id)

@router.get("/users/{user_id}/balances")
def user_balances(user_id: int, db: Session = Depends(get_db)):
    return crud.calculate_user_balances(db, user_id)
