from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Habit, HabitLog
from datetime import date, datetime, timedelta
from calendar import monthrange
from sqlalchemy import extract

# LOGROS 🔥
from utils.achievements import evaluate_log_achievements

habits_bp = Blueprint("habits", __name__, url_prefix="/api/habits")

# ===============================
#           GET HABITS
# ===============================
@habits_bp.route("/", methods=["GET"])
@jwt_required()
def get_habits():
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    habits = Habit.query.filter_by(user_id=user_id).all()

    result = []
    for h in habits:
        result.append({
            "id": h.id,
            "name": h.name,
            "description": h.description,
            "frequency": h.frequency,
            "goal_value": h.goal_value,
            "created_at": h.created_at.isoformat(),
        })

    return jsonify(result)

# ===============================
#         CREATE HABIT
# ===============================
@habits_bp.route("/", methods=["POST"])
@jwt_required()
def create_habit():
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    data = request.get_json()

    habit = Habit(
        user_id=user_id,
        name=data.get("name"),
        description=data.get("description"),
        frequency=data.get("frequency", "daily"),
        goal_value=data.get("goal_value"),
    )

    db.session.add(habit)
    db.session.commit()

    return jsonify({"message": "Hábito creado", "id": habit.id}), 201

# ===============================
#         UPDATE HABIT
# ===============================
@habits_bp.route("/<int:habit_id>", methods=["PUT"])
@jwt_required()
def update_habit(habit_id):
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

    data = request.get_json()
    habit.name = data.get("name", habit.name)
    habit.description = data.get("description", habit.description)
    habit.frequency = data.get("frequency", habit.frequency)
    habit.goal_value = data.get("goal_value", habit.goal_value)

    db.session.commit()

    return jsonify({"message": "Hábito actualizado"})

# ===============================
#         DELETE HABIT
# ===============================
@habits_bp.route("/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habit_id):
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

    db.session.delete(habit)
    db.session.commit()

    return jsonify({"message": "Hábito eliminado"})

# ===============================
#          LOG HABIT
# ===============================
@habits_bp.route("/<int:habit_id>/log", methods=["POST"])
@jwt_required()
def log_habit(habit_id):
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

    data = request.get_json()
    log_date_str = data.get("date")
    completed = data.get("completed", True)
    value = data.get("value")

    if log_date_str:
        year, month, day = map(int, log_date_str.split("-"))
        log_date = date(year, month, day)
    else:
        log_date = date.today()

    log = HabitLog.query.filter_by(habit_id=habit.id, date=log_date).first()
    if not log:
        log = HabitLog(habit_id=habit.id, date=log_date)

    log.completed = completed
    log.value = value

    db.session.add(log)
    db.session.commit()

    # LOGROS 🔥
    evaluate_log_achievements(user_id, habit.id, log_date)

    return jsonify({"message": "Registro guardado"})

# ===============================
#          HABIT STATS
# ===============================
@habits_bp.route("/<int:habit_id>/stats", methods=["GET"])
@jwt_required()
def habit_stats(habit_id):
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

    logs = HabitLog.query.filter_by(habit_id=habit.id).order_by(HabitLog.date).all()

    if not logs:
        return jsonify({
            "habit_id": habit.id,
            "current_streak": 0,
            "best_streak": 0,
            "total_completed": 0,
            "percentage": 0,
            "history": []
        })

    # Cálculo de rachas
    best_streak = 0
    current_streak = 0
    last_date = None
    total_completed = 0

    for log in logs:
        if log.completed:
            total_completed += 1

        if log.completed:
            if last_date is None:
                current_streak = 1
            else:
                if log.date == last_date + timedelta(days=1):
                    current_streak += 1
                else:
                    current_streak = 1

            if current_streak > best_streak:
                best_streak = current_streak

            last_date = log.date
        else:
            current_streak = 0
            last_date = log.date

    history = [
        {
            "date": log.date.isoformat(),
            "completed": log.completed,
            "value": log.value
        }
        for log in logs
    ]

    percentage = round((total_completed / len(logs)) * 100, 2)

    return jsonify({
        "habit_id": habit.id,
        "current_streak": current_streak,
        "best_streak": best_streak,
        "total_completed": total_completed,
        "percentage": percentage,
        "history": history
    })

# ===============================
#          HABIT CHARTS
# ===============================
@habits_bp.route("/<int:habit_id>/charts", methods=["GET"])
@jwt_required()
def habit_charts(habit_id):
    user_id = int(get_jwt_identity())  # ←🔥 FIX IMPORTANTE
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

    today = date.today()

    # -- DAILY (30 días)
    last_30_days = today - timedelta(days=29)

    logs_30 = (
        HabitLog.query
        .filter(
            HabitLog.habit_id == habit_id,
            HabitLog.date >= last_30_days
        )
        .order_by(HabitLog.date)
        .all()
    )

    daily = []
    day_pointer = last_30_days

    log_dict = {log.date: log.completed for log in logs_30}

    for _ in range(30):
        daily.append({
            "date": day_pointer.isoformat(),
            "completed": log_dict.get(day_pointer, False)
        })
        day_pointer += timedelta(days=1)

    # -- WEEKLY (4 semanas)
    weeks = []
    for i in range(4):
        start = today - timedelta(days=(i+1)*7)
        end = today - timedelta(days=i*7)

        logs_week = (
            HabitLog.query
            .filter(
                HabitLog.habit_id == habit_id,
                HabitLog.date >= start,
                HabitLog.date < end
            )
            .all()
        )

        total = len(logs_week)
        completed = sum(1 for log in logs_week if log.completed)

        weeks.append({
            "week": f"Semana {4-i}",
            "completed": completed,
            "total": total
        })

    weeks.reverse()

    # -- MONTHLY (mes actual)
    current_year = today.year
    current_month = today.month
    days_in_month = monthrange(current_year, current_month)[1]

    logs_month = (
        HabitLog.query
        .filter(
            HabitLog.habit_id == habit_id,
            extract('year', HabitLog.date) == current_year,
            extract('month', HabitLog.date) == current_month
        )
        .all()
    )

    completed_month = sum(1 for log in logs_month if log.completed)
    percentage_month = round((completed_month / days_in_month) * 100, 2)

    return jsonify({
        "daily": daily,
        "weekly": weeks,
        "monthly": {
            "completed": completed_month,
            "days": days_in_month,
            "percentage": percentage_month
        }
    })
