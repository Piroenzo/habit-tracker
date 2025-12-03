import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-jwt-secret")

    _db_user = os.getenv("DB_USER")
    _db_password = os.getenv("DB_PASSWORD")
    _db_host = os.getenv("DB_HOST")
    _db_port = os.getenv("DB_PORT")
    _db_name = os.getenv("DB_NAME")

    if all([_db_user, _db_password, _db_host, _db_port, _db_name]):
        SQLALCHEMY_DATABASE_URI = (
            f"postgresql://{_db_user}:{_db_password}@{_db_host}:{_db_port}/{_db_name}"
        )
    else:
        SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///habits.db")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
