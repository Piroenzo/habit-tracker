from datetime import datetime, date
from database import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    habits = db.relationship("Habit", backref="user", lazy=True)
    achievements = db.relationship("Achievement", backref="user", lazy=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Habit(db.Model):
    __tablename__ = "habits"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    frequency = db.Column(db.String(20), default="daily")  # daily / weekly / custom
    goal_value = db.Column(db.Integer, nullable=True)  # ej: minutos, pasos, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    logs = db.relationship("HabitLog", backref="habit", lazy=True)


class HabitLog(db.Model):
    __tablename__ = "habit_logs"

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable=False)
    date = db.Column(db.Date, default=date.today, nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    value = db.Column(db.Integer, nullable=True)  # ej: 30 min, 8000 pasos

    __table_args__ = (
        db.UniqueConstraint("habit_id", "date", name="uq_habit_date"),
    )


class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
