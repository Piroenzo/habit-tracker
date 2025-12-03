from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from database import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "El email ya está registrado"}), 400

    user = User(email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))

    return jsonify({"message": "Usuario creado", "token": token}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Credenciales inválidas"}), 401

    # identity DEBE ser string o el backend devolverá 422 en las rutas protegidas
    access_token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": access_token}), 200
