from pydantic import BaseModel
from typing import List, Optional

# ---------- User Schemas ----------
class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True  


# ---------- Group Schemas ----------
class GroupBase(BaseModel):
    name: str
    user_ids: List[int]

class Group(GroupBase):
    id: int

    class Config:
        from_attributes = True  

class GroupResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True  


# ---------- Expense Schemas ----------
class ExpenseSplitSchema(BaseModel):
    user_id: int
    amount: Optional[float] = None
    percentage: Optional[float] = None

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: str  
    splits: List[ExpenseSplitSchema]
