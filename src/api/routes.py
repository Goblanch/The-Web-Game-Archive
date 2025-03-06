"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db , User , Minigames , Played_games
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token , jwt_required , get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



#######################----METODOS DE LA TABLA User------###################################################
############################################################################################################

@api.route('/users', methods=['GET'])
def get_all_users():

    all_users = User.query.all()

    if not all_users:

        return jsonify({'msg':"No hay ningun usuario en la base de datos"}), 404

    users_info = [user.serialize() for user in all_users]

    return jsonify(users_info), 200

@api.route('/user/singup', methods = ["POST"])
def post_user():

   request_new_user = request.get_json()

   if "email" not in request_new_user or "password" not in request_new_user:
                          
        return jsonify({"msg": "Tienes que introducir email y password para poder registrarte"}), 400

   user = User.query.filter_by(email = request_new_user["email"]).first()

   if user is not None:
       
       return jsonify({"msg": "Ya existe el usuario que deseas crear"}), 400
   
   new_user = User(
                   email = request_new_user["email"], 
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

@api.route('/user/<int:id_us>', methods = ['DELETE'])
def delete_user(id_us):


    user_to_delete = User.query.filter_by(id_user = id_us).first()

    if user_to_delete :

        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"msg":"El usuario se ha borrado correctameente"},user_to_delete.serialize()),200

    return jsonify({'msg': "No existe el usuario que deseas borrar con este id:" + id_us}),400
    
@api.route('/user/<int:id_us>', methods = ['PUT'])
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

@api.route('/user/totalpoints/<int:id_us>', methods = ['PUT'])
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

@api.route('/user/login', methods = ['POST'])
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

@api.route('/user/password/<int:id_us>', methods = ['PUT'])
def change_password(id_us):

    data = request.get_json()

    if not data:

        return jsonify({'msg':"Debes enviar la password para cambiarla"}), 400

    user = User.query.filter_by(id_user = id_us).first()

    if user is None :

        return jsonify({'msg':f"No existe el usuario con este id:{id_us} , o la password es incirrecta"}), 401

    user.password = data.get('new_password', user.password)

    user.set_password(user.password)

    try:

        db.session.commit()

        return jsonify({'msg':f"La password se cambio correctamente a : {user.password}"}), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({'msg':f"Error al modificar la password en la Base de datos: {str(e)}"}), 500
    
@api.route("/user/private", methods=["GET"])
@jwt_required()
def private():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:

        return jsonify({'msg':"No se encuentra el usuario"}), 400

    return jsonify({"msg": "El usuario tiene acceso a la ruta privada" ,"id": user.id_user, "email": user.email }), 200


##########################----METODOS DE LA TABLA Minigames------###########################################
############################################################################################################

@api.route('/minigames', methods=['GET'])
def get_all_minigames():

    all_minigames = Minigames.query.all()

    if not all_minigames:

        return jsonify({'msg':"No hay ningun minijuego en la base de datos"}), 404

    minigame_info = [minigame.serialize() for minigame in all_minigames]

    return jsonify(minigame_info), 200


@api.route('/minigame/<int:id_mini>', methods = ['POST'])
def post_minigame(id_mini):

    data = request.get_json()

    if not data:

        return jsonify({'msg': "No has enviado data para crear el minijuego"}), 400

    minigame = Minigames.query.filter_by(id_minigame  = id_mini).first()

    if minigame is not None:

        return jsonify({'msg': f"Ya existe un Minigame con ese id:{id_mini}"})

    new_minigame = Minigames(
                            title = data['title'],
                            description = data['description']
    
                            )

    try:
        db.session.add(new_minigame)
        db.session.commit()

        return jsonify({"msg":"Minijuego creado correctamente" ,"user": new_minigame.serialize()}), 200

    except Exception as e:

        db.session.rollback()
        return jsonify({'msg': f"Error al crear el minigame: {str(e)}"}), 500


@api.route('/minigame/<int:id_mini>', methods = ['PUT'])
def put_minigame(id_mini):

    data = request.get_json()

    if not data:

        return jsonify({'msg': "No has enviato informacion para editar el minijuego"}), 404

    minigame = Minigames.query.filter_by(id_minigame = id_mini).first()

    if minigame is None:

        return jsonify({'msg': f"El minijuego con la id:{id_mini} no existe"}), 400

    minigame.title = data.get('title' , minigame.title)
    minigame.description = data.get('description' , minigame.description)

    try:

        db.session.commit()

        return jsonify({'msg' : "Se ha modificado el minjuego correctamen"}), 200
    
    except Exception as e :

        db.session.rollback()

        return jsonify({'msg': f"Fallo al modificar el minijuego en la Base de datos : {str(e)}"})


@api.route('/minigame/<int:id_mini>', methods = ['DELETE'])
def delete_minigame(id_mini):


    minigame_to_delete = Minigames.query.filter_by(id_minigame = id_mini).first()

    if minigame_to_delete is None:


        return jsonify({'msg': "No existe el usuario que deseas borrar con este id:" + id_mini}), 400


    try:

        db.session.delete(minigame_to_delete)
        db.session.commit()
        return jsonify({"msg":"El minijuego se ha borrado correctameente"},minigame_to_delete.serialize()), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({'msg': f"Fallo al modificar el minijuego en la Base de datos : {str(e)}"})



###########################----METODOS DE LA TABLA Played_games------#######################################
############################################################################################################


@api.route('/played_games', methods=['GET'])
def get_all_usergames():

    all_usergames = Played_games.query.all()

    if not all_usergames:
        
        return jsonify({'msg': 'No hay ningun juego jugado todavia'}), 400

    usergame_info = [usergame.serialize() for usergame in all_usergames]

    return jsonify(usergame_info), 200


@api.route('/played_games', methods = ['POST'])
def post_played_games():

    data = request.get_json()

    if not data:

        return({"msg" : "No has enviado la informacion parta crear el played_game"}), 400
    
    played_game = Played_games.query.filter_by(user_id = data["user_id"] , minigame_id = data["minigame_id"]).first()

    if played_game is not None:

        return({"msg" : "El played_game ya existe no se puede crear"}), 400

    new_played_game = Played_games(
                                    user_id = data["user_id"],
                                    minigame_id = data["minigame_id"],
                                    game_data = data["game_data"],
                                    game_points = data["game_points"]
                                    )
    
    try:

        db.session.add(new_played_game)
        db.session.commit()

        return({"msg" : "El played_game ha sido creado correctamente"}), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({'msg': f"Fallo al crear played_games en la Base de datos : {str(e)}"}), 500


@api.route('/played_games/game_points/<int:id_played_gam>' , methods = ['PUT'])
def put_game_points(id_played_gam):

    data = request.get_json()

    if "game_points" not in data:

        return({"msg" : "No has enviado la informacion para editar played_game"}), 400

    played_game = Played_games.query.filter_by(id_played_games = id_played_gam).first()

    if played_game is None:

        return({"msg" : "El played_games que deseas editar no existe"}), 400

    try:

        new_points_to_add = int(data['game_points'])

    except ValueError:

        return jsonify({'msg': "El valor de 'total_points' debe ser un número entero válido"}), 400

    new_game_points = new_points_to_add + played_game.game_points

    played_game.game_points = new_game_points

    try:

        db.session.commit()

        return({"msg" : "Los game_points han sido editado correctamente"}), 200
    
    except Exception as e:

        return({"msg" : "Fallo al al agregar los game_points"}), 500


@api.route("/played_games/<int:id_played_gam>" , methods = ['DELETE'])
def delete_played_games(id_played_gam):

    played_game = Played_games.query.filter_by(id_played_games = id_played_gam).first()

    if played_game is None:

        return({"msg" : "EL played_game que deseas borrar no existe"}), 400
    
    try:

        db.session.delete(played_game)
        db.session.commit()
        return jsonify({"msg":"El played_game se ha borrado correctameente"},played_game.serialize()), 200


    except Exception as e:

        db.session.rollback()

        return jsonify({'msg': f"Fallo al borrar played_games en la Base de datos : {str(e)}"}), 500
    
@api.route("/played_games/game_data/<int:id_played_gam>" , methods = ['PUT'])
def put_game_data(id_played_gam):

    data = request.get_json()

    if "game_data" not in data:

        return jsonify({"msg": "No has enviado los game_points para sumarles"}), 400
    
    played_game = Played_games.query.filter_by(id_played_games = id_played_gam).first()

    if played_game is None:

        return jsonify({"msg": f"No existe el played_game con esta id : {str(id_played_gam)}"}), 400
    
    played_game.game_data = data.get("game_data", played_game)

    try:

        db.session.commit()

        return({"msg" : "La game_data ha sido editada correctamente"}), 200
    
    except Exception as e:

        return({"msg" : "Fallo al editar la game_data en la base de datos"}), 500
    
