from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy import func


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_group(db: Session, group: schemas.GroupBase):
    try:
        db_group = models.Group(name=group.name)
        db.add(db_group)
        db.commit()
        db.refresh(db_group)

        for user_id in group.user_ids:
            db.add(models.GroupUser(group_id=db_group.id, user_id=user_id))

        db.commit()
        return {"id": db_group.id, "name": db_group.name}

    except Exception as e:
        print(" Group creation failed:", e)
        raise



def get_group(db: Session, group_id: int):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    users = db.query(models.User).join(models.GroupUser).filter(models.GroupUser.group_id == group_id).all()
    total_expenses = db.query(func.sum(models.Expense.amount)).filter(models.Expense.group_id == group_id).scalar() or 0
    return {
        "id": group.id,
        "name": group.name,
        "users": [{"id": u.id, "name": u.name} for u in users],
        "total_expenses": total_expenses
    }


def create_expense(db: Session, group_id: int, expense: schemas.ExpenseCreate):
    db_expense = models.Expense(
        group_id=group_id,
        description=expense.description,
        amount=expense.amount,
        paid_by=expense.paid_by,
        split_type=expense.split_type,
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    if expense.split_type == "equal":
        members = db.query(models.GroupUser).filter(models.GroupUser.group_id == group_id).all()
        share = round(expense.amount / len(members), 2)
        for member in members:
            db.add(models.ExpenseSplit(expense_id=db_expense.id, user_id=member.user_id, amount=share))
    elif expense.split_type == "percentage":
        for split in expense.splits:
            amount = round((split.percentage / 100.0) * expense.amount, 2)
            db.add(models.ExpenseSplit(expense_id=db_expense.id, user_id=split.user_id, amount=amount))
    db.commit()
    return db_expense


def calculate_group_balances(db: Session, group_id: int):
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()

    balances = {}
    for exp in expenses:
        splits = db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == exp.id).all()
        for s in splits:
            balances[s.user_id] = balances.get(s.user_id, 0) - s.amount
        balances[exp.paid_by] = balances.get(exp.paid_by, 0) + exp.amount

    users = db.query(models.User).join(models.GroupUser).filter(models.GroupUser.group_id == group_id).all()
    results = []
    for user in users:
        results.append({
            "user_id": user.id,
            "name": user.name,
            "balance": round(balances.get(user.id, 0), 2)
        })
    return results


def calculate_user_balances(db: Session, user_id: int):
    all_groups = db.query(models.GroupUser.group_id).filter(models.GroupUser.user_id == user_id).all()
    user_balances = []
    for g in all_groups:
        group_id = g.group_id
        group_info = get_group(db, group_id)
        balances = calculate_group_balances(db, group_id)
        for b in balances:
            if b["user_id"] == user_id:
                user_balances.append({
                    "group": group_info["name"],
                    "group_id": group_id,
                    "balance": b["balance"]
                })
    return user_balances

def get_all_groups(db: Session):
    return db.query(models.Group).all()
