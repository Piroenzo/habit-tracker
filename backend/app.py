from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from database import db, migrate
from routes.auth_routes import auth_bp
from routes.habit_routes import habits_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(habits_bp)

    @app.route("/api/health")
    def health():
        return {"status": "ok"}, 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
