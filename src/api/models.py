from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
app = Flask(__name__)

jwt = JWTManager(app)

class User(db.Model):
    id_user = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(30), unique=True, nullable=False)
    name = db.Column(db.String(30), unique=False, nullable=False)
    last_name = db.Column(db.String(30), unique=False, nullable=True)
    user_img = db.Column(db.String(200), unique=False, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(1000), unique=False, nullable=False)
    total_points = db.Column(db.Integer, unique=False, nullable=False)
    relation_favorite = db.relationship('Played_games' , backref='user')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id_user": self.id_user,
            "user_name": self.user_name,
            "name": self.name,
            "last_name": self.last_name,
            "user_img": self.user_img,
            "email": self.email,
            "total_points": self.total_points

            # do not serialize the password, its a security breach
        }
    
    # Metodos para establecer y verificar la password
    def set_password(self,password):
        self.password = generate_password_hash(password)

    def check_password(self,password):
        return check_password_hash(self.password,password)

class Minigames(db.Model):
    id_minigame = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(30), unique=True, nullable=False)
    description = db.Column(db.String(300), unique=False, nullable=False)
    relation_favorite = db.relationship('Played_games' , backref='minigames')
    

    def __repr__(self):
        return f'<Minigame {self.title}>'

    def serialize(self):
        return {
            "id_minigame": self.id_minigame,
            "title": self.title,
            "description": self.description,

            # do not serialize the password, its a security breach
        }
    
class Played_games(db.Model):
    id_played_games = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id_user'))
    minigame_id = db.Column(db.Integer, db.ForeignKey('minigames.id_minigame'))
    game_data = db.Column(db.String(3000), unique=False, nullable=False)
    

    def __repr__(self):
        return f'<Played_games {self.id_played_games}>'

    def serialize(self):
        return {
            "id_played_games": self.id_played_games,
            "user_id": self.user_id,
            "minigame_id": self.minigame_id,
            "game_data": self.game_data
            

            # do not serialize the password, its a security breach
        }