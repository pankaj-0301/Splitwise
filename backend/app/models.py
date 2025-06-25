from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Group(Base):
    __tablename__ = 'groups'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class GroupUser(Base):
    __tablename__ = 'group_users'
    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey('groups.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey('groups.id'))
    description = Column(String)
    amount = Column(Float)
    paid_by = Column(Integer, ForeignKey('users.id'))
    split_type = Column(String)  

class ExpenseSplit(Base):
    __tablename__ = 'expense_splits'
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey('expenses.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    amount = Column(Float)
