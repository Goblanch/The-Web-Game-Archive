"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db ,User , Minigames , Played_games
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token , jwt_required , get_jwt_identity



ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False



# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object

################ INICIALIZO JWT#####################
jwt = JWTManager(app)

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response




#######################----METODOS DE LA TABLA User------#####################
@app.route('/users', methods=['GET'])
def get_all_users():

    all_users = User.query.all()

    if not all_users:

        return jsonify({'msg':"No hay ningun usuario en la base de datos"}), 404

    users_info = [user.serialize() for user in all_users]

    return jsonify(users_info), 200

@app.route('/singup', methods = ["POST"])
def post_user():

   request_new_user = request.get_json()

   if "email" not in request_new_user or "password" not in request_new_user:
                          
        return jsonify({"msg": "Tienes que introducir email y password para poder registrarte"}), 400

   user = User.query.filter_by(email = request_new_user["email"]).first()

   if user is not None:
       
       return jsonify({"msg": "Ya existe el usuario que deseas crear"}), 400
   
   new_user = User(email = request_new_user["email"], 
                   password = request_new_user["password"], 
                   user_name = request_new_user["user_name"],
                   name = request_new_user["name"],
                   last_name = request_new_user["last_name"],
                   user_img = request_new_user["user_img"],
                   total_points = request_new_user["total_points"],
                   )

   ####----Establezco el hash de la password-----######
   new_user.set_password(new_user.password)
   
   try:
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg":"Usuario creado correctamente" ,"user": new_user.serialize()}), 200

   except Exception as e:

        db.session.rollback()
        return jsonify({'msg': f"Error al crear el usuario: {str(e)}"}), 500

@app.route('/user/<int:id_us>', methods = ['DELETE'])
def delete_user(id_us):


    user_to_delete = User.query.filter_by(id_user = id_us).first()

    if user_to_delete :

        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"msg":"El usuario se ha borrado correctameente"},user_to_delete.serialize()),200

    return jsonify({'msg': "No existe el usuario que deseas borrar con este id:" + id_us}),400
    
@app.route('/user/<int:id_us>', methods = ['PUT'])
def update_user(id_us):

    data = request.get_json()

    if not data:

         return jsonify({'msg':"No has enviado la data para modificar"}), 404 

    user_to_update = User.query.filter_by(id_user = id_us).first()

    if user_to_update is None:

        return jsonify({'msg':"No se encuentra el usuario que intentas editar"}), 404
    
    user_to_update.user_name = data.get('user_name', user_to_update.user_name)
    user_to_update.email = data.get('email', user_to_update.email)
    user_to_update.password = data.get('password', user_to_update.password)
    user_to_update.name = data.get('name', user_to_update.name)
    user_to_update.last_name = data.get('last_name', user_to_update.last_name)
    user_to_update.user_img = data.get('user_img', user_to_update.user_img)

      ####----Establezco el hash de la password-----######
    user_to_update.set_password(user_to_update.password)

    try:

        db.session.commit()

        return jsonify({"msg": "Se modifico el ususario correctamente"},user_to_update.serialize()),200
    
    except Exception as e:

        db.session.rollback()  # En caso de un error, rollback
        return jsonify({'msg': f"Error al modificar el usuario: {str(e)}"}), 500

@app.route('/user/totalpoints/<int:id_us>', methods = ['PUT'])
def update_totalpoints(id_us):

    data =   request.get_json()

    if 'total_points' not in data:

        return jsonify({'msg':"No has enviado el campo total_points"}), 400

    try:

        new_points_to_add = int(data['total_points'])

    except ValueError:

        return jsonify({'msg': "El valor de 'total_points' debe ser un número entero válido"}), 400

    user_points_update = User.query.filter_by(id_user = id_us).first()

    if user_points_update is None:

         return jsonify({'msg':"No se encuentra el usuario que intentas editar"}), 404
    
    new_total_points = new_points_to_add + user_points_update.total_points

    user_points_update.total_points = new_total_points

    try:
        db.session.commit()

        return jsonify({'msg':'Los Total Points se modificaron correctamente'}, new_total_points), 200

    except Exception as e:

        db.session.rollback()  # En caso de un error, rollback
        return jsonify({'msg': f"Error al modificar los puntos: {str(e)}"}), 500

@app.route('/user/login', methods = ['POST'])
def login():

    data = request.get_json()

    if not data:

        return jsonify({'msg':"No has enviado la data para poder logearte"}), 400

    user = User.query.filter_by(email = data['email']).first()

     # Verificar que el usuario existe y que la contraseña es correcta
    if user is None or not user.check_password(data['password']):

        return jsonify({'msg': 'El usuario o la contraseña no coinciden'}), 401

    access_token = create_access_token(identity = str(user.id_user))

    return jsonify({ "token": access_token,"id_user": user.id_user})

@app.route('/user/password/<int:id_us>', methods = ['PUT'])
def change_password(id_us):

    data = request.get_json()

    if not data:

        return jsonify({'msg':"Debes enviar la password para cambiarla"}), 400

    user = User.query.filter_by(id_user = id_us).first()

    if user is None or not user.check_password(data['password']):

        return jsonify({'msg':f"No existe el usuario con este id:{id_us} , o la password es incirrecta"}), 401

    user.password = data.get('new_password', user.password)

    user.set_password(user.password)

    try:

        db.session.commit()

        return jsonify({'msg':"La password se cambio correctamente"}), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({'msg':f"Error al modificar la password en la Base de datos: {str(e)}"}), 500
    
#######################----METODOS DE LA TABLA Minigames------#####################

@app.route('/minigames', methods=['GET'])
def get_all_minigames():

    all_minigames = Minigames.query.all()

    if not all_minigames:

        return jsonify({'msg':"No hay ningun minijuego en la base de datos"}), 404

    minigame_info = [minigame.serialize() for minigame in all_minigames]

    return jsonify(minigame_info), 200


# @app.route('/minigames/<int:id_mini', methods = ['POST'])
# def post_minigame(id_mini):

#     data = request.get_json()

#     if not data:

#         return jsonify({'msg': "No has enviado data para crear el minijuego"}), 400

#     minigame = Minigames.querry.filter_by(id_minigame)

    


#######################----METODOS DE LA TABLA Played_games------#####################

@app.route('/played_games', methods=['GET'])
def get_all_usergames():

    all_usergames = Played_games.query.all()

    if not all_usergames:
        
        return jsonify({'msg': 'No hay ningun juego jugado todavia'}), 400

    usergame_info = [usergame.serialize() for usergame in all_usergames]

    return jsonify(usergame_info), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

