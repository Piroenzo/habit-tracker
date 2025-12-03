@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Credenciales inválidas"}), 401

    # 🔥 identity DEBE ser string o el backend devolverá 422 en las rutas protegidas
    access_token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": access_token}), 200
