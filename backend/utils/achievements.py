from datetime import date, timedelta
from calendar import monthrange

from database import db
from models import Achievement, HabitLog, Habit


def unlock(user_id, title, description=""):
    """Evita logros duplicados."""
    exists = Achievement.query.filter_by(user_id=user_id, title=title).first()
    if exists:
        return

    achievement = Achievement(
        user_id=user_id,
        title=title,
        description=description
    )
    db.session.add(achievement)
    db.session.commit()


def compute_streak(habit_id):
    logs = HabitLog.query.filter_by(habit_id=habit_id, completed=True).order_by(HabitLog.date).all()

    if not logs:
        return 0, 0

    best_streak = 0
    current_streak = 1
    last_date = logs[0].date

    for log in logs[1:]:
        if log.date == last_date + timedelta(days=1):
            current_streak += 1
        else:
            current_streak = 1

        if current_streak > best_streak:
            best_streak = current_streak

        last_date = log.date

    return current_streak, best_streak


def evaluate_log_achievements(user_id, habit_id, log_date):
    """
    Revisa automáticamente qué logros desbloquear al registrar un hábito.
    """
    habit = Habit.query.get(habit_id)

    # Total completados
    total_completed = HabitLog.query.filter_by(habit_id=habit_id, completed=True).count()

    # Rachas
    logs = HabitLog.query.filter_by(habit_id=habit_id).order_by(HabitLog.date).all()

    current_streak = 0
    best_streak = 0
    last_date = None

    for log in logs:
        if log.completed:
            if last_date and log.date == last_date + timedelta(days=1):
                current_streak += 1
            else:
                current_streak = 1

            if current_streak > best_streak:
                best_streak = current_streak

        last_date = log.date

    # ===========================
    # LOGROS AUTOMÁTICOS
    # ===========================

    # 🟢 Primer día completado
    if total_completed == 1:
        unlock(user_id, "Primer día", "Completaste tu primer registro de hábito")

    # 🔥 Racha de 3 días
    if best_streak >= 3:
        unlock(user_id, "Racha 3 días", "Mantenés una racha de 3 días seguidos")

    # 🔥 Racha de 7 días
    if best_streak >= 7:
        unlock(user_id, "Racha 7 días", "Mantener hábitos consistentemente por una semana")

    # 🔥 Racha de 30 días
    if best_streak >= 30:
        unlock(user_id, "Racha 30 días", "Una racha de un mes completo")

    # 🟦 10 veces completado
    if total_completed >= 10:
        unlock(user_id, "10 completados", "Completaste este hábito 10 veces")

    # 🟪 50 veces completado
    if total_completed >= 50:
        unlock(user_id, "50 completados", "50 veces es enorme constancia 💪")

    # 🟧 Mes perfecto (todos los días del mes)
    logs_month = [
        l for l in logs if l.date.month == log_date.month and l.date.year == log_date.year
    ]

    days_in_month = monthrange(log_date.year, log_date.month)[1]

    completed_days = sum(1 for l in logs_month if l.completed)

    if completed_days == days_in_month:
        unlock(user_id, "Mes perfecto", "Completaste el hábito todos los días del mes 🎯")
