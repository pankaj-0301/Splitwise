from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.GroupResponse)  
def create_group(group: schemas.GroupBase, db: Session = Depends(get_db)):
    return crud.create_group(db, group)

@router.get("/{group_id}")
def get_group(group_id: int, db: Session = Depends(get_db)):
    return crud.get_group(db, group_id)


@router.get("/", response_model=List[schemas.GroupResponse])
def list_groups(db: Session = Depends(get_db)):
    return crud.get_all_groups(db)
