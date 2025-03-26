"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db , User , Minigames , Played_games
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token , jwt_required , get_jwt_identity
from api.minigames import populate_minigames

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Población de tabla minigames
@api.route('/populate_minigames', methods=['GET'])
def populate_minigames_endpoint():
    """
    Endpoint para poblar la tabla Minigames con datos predefinidos.
    """
    minigames_data = [
        {
            "title": "Who's that Pokémon?",
            "description": "Adivina qué Pokémon es por su silueta",
            "points_per_win": 10,
            "lives": 4,
            "game_time": 300,
            "click_time": 5
        },
        {
            "title": "Aimlab",
            "description": "Haz click en el botón lo más rápido posible y el mayor número de veces",
            "points_per_win": 20,
            "lives": 5,
            "game_time": 10,
            "click_time": 2
        },
        {
            "title": "Fair Price",
            "description": "Adivina el precio de productos aleatorios",
            "points_per_win": 10,
            "lives": 5,
            "game_time": 200,
            "click_time": 10
        },
        {
            "title": "Mithril Clicker",
            "description": "Un autoclicker de minar mithril",
            "points_per_win": 5,
            "lives": 5,
            "game_time": 200,
            "click_time": 10
        },
        {
            "title": "Potterdle",
            "description": "Adivina el personaje de Harry Potter.",
            "points_per_win": 20,
            "lives": 5,
            "game_time": 200,
            "click_time": 10
        },
        {
            "title": "Movie Higher Lower",
            "description": "Descubre qué películas tienes más puntuación que otras",
            "points_per_win": 10,
            "lives": 5,
            "game_time": 200,
            "click_time": 10
        }
    ]

    try:
        for game_data in minigames_data:
            # Formatear el título para evitar duplicados (en minúsculas y sin espacios)
            title_formatted = game_data["title"].replace(" ", "").lower()
            # Verificar si el juego ya existe en la base de datos
            existing_game = Minigames.query.filter_by(title=title_formatted).first()

            if existing_game is None:
                # Si no existe, agregarlo a la base de datos
                new_game = Minigames(
                    title=game_data["title"],
                    description=game_data["description"],
                    points_per_win=game_data["points_per_win"],
                    lives=game_data["lives"],
                    game_time=game_data["game_time"],
                    click_time=game_data["click_time"]
                )
                db.session.add(new_game)

        # Confirmar los cambios en la base de datos
        db.session.commit()
        return jsonify({"msg": "Minijuegos poblados correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al poblar los minijuegos: {str(e)}"}), 500




#######################----METODOS DE LA TABLA User------###################################################
############################################################################################################

@api.route('/users', methods=['GET'])
def get_all_users():

    all_users = User.query.all()

    if not all_users:

        return jsonify({'msg':"No hay ningun usuario en la base de datos"}), 404

    users_info = [user.serialize() for user in all_users]

    return jsonify(users_info), 200

@api.route('/user/<int:id_us>', methods = ['GET'])
def get_user_by_id(id_us):

    user_by_id = User.query.filter_by(id_user = id_us).first()


    if not user_by_id:

        return jsonify({'msg':"No hay ningun usuario con ese id en la base de datos"}), 404

    users_info = user_by_id.serialize() 

    return jsonify(users_info), 200

@api.route('/user/singup', methods = ["POST"])
def post_user():

   request_new_user = request.get_json()

   if "email" not in request_new_user or "password" not in request_new_user:
                          
        return jsonify({"msg": "Tienes que introducir email y password para poder registrarte"}), 400

   user_email = User.query.filter_by(email = request_new_user["email"]).first()

   if user_email is not None:
       
       return jsonify({"msg": "Ya hay una cuenta con este Email usa otro"}), 400
   
   user_by_user_name = User.query.filter_by(user_name = request_new_user["user_name"]).first()
   
   if user_by_user_name is not None:
       
        return jsonify({"msg": "Ya hay una cuenta con este User Name usa otro"}), 400

   
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
####################################################################
@api.route('/user/<int:id_us>', methods = ['DELETE'])
def delete_user(id_us):


    user_to_delete = User.query.filter_by(id_user = id_us).first()

    all_played_game_by_user = Played_games.query.filter_by(user_id = id_us).all()

    if user_to_delete :

        if not all_played_game_by_user :

            print("EL User no ha jugado a ningun juego")
            
        else:
            for game in all_played_game_by_user:
                db.session.delete(game)
            db.session.commit()
            print("Se eliminaron todas las partidas del jugador")

        try:

            db.session.delete(user_to_delete)
            db.session.commit()
            return jsonify({"msg":"El usuario se ha borrado correctameente"},user_to_delete.serialize()),200
    
        except Exception as e:

            db.session.rollback()

            return jsonify({'msg': "No existe el usuario que deseas borrar con este id:" + id_us}),400


@api.route("/played_games/delete_all/<int:id_us>" , methods = ['DELETE'])
def delete_all_played_games(id_us):

    all_played_game_by_user = Played_games.query.filter_by(user_id = id_us).all()

    if not all_played_game_by_user :

        return({"msg" : "EL User no ha jugado a ningun juego"}), 400
    
    try:

        for game in all_played_game_by_user:
            db.session.delete(game)
        db.session.commit()
        return jsonify({"msg":"Se eliminaron todas las partidas del jugador"}), 200


    except Exception as e:

        db.session.rollback()

        return jsonify({'msg': f"Fallo al borrar played_games en la Base de datos : {str(e)}"}), 500
 ########################################################################################################################################   
@api.route('/user/<int:id_us>', methods = ['PUT'])
def update_user(id_us):

    data = request.get_json()

    if not data:

         return jsonify({'msg':"No has enviado la data para modificar"}), 404 

    user_to_update = User.query.filter_by(id_user = id_us).first()


    if user_to_update is None:

        return jsonify({'msg':"No se encuentra el usuario que intentas editar"}), 404
    
    if "user_name" in data and data["user_name"] is not None:

        user_by_name_user = User.query.filter_by(user_name = data["user_name"]).first()
    
        if user_by_name_user:

            if user_by_name_user.id_user != user_to_update.id_user:


                return jsonify({"msg": "Ya existe ese User Name debes usar otro"}), 400
    
    if "email" in data and data["email"] is not None:

        user_by_email = User.query.filter_by(email = data["email"]).first()

        if user_by_email:

            if user_by_email.id_user != user_to_update.id_user:
       
            
                return jsonify({"msg": "El Email ya existe debes usar otro"}), 400
    
    
    print(data)
    user_to_update.user_name = data.get('user_name', user_to_update.user_name)
    user_to_update.email = data.get('email', user_to_update.email)
    # user_to_update.password = data.get('password', user_to_update.password)
    user_to_update.name = data.get('name', user_to_update.name)
    user_to_update.last_name = data.get('last_name', user_to_update.last_name)
    user_to_update.user_img = data.get('user_img', user_to_update.user_img)

      ####----Establezco el hash de la password-----######
    if "password" in data and data["password"] != "":

        user_to_update.password = data.get('password', user_to_update.password)
        user_to_update.set_password(user_to_update.password)

    print(user_to_update)

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
    if not user  or not user.check_password(data['password']):

        return jsonify({'msg': 'El usuario o la contraseña no coinciden'}), 401

    access_token = create_access_token(identity = str(user.id_user))

    return jsonify({"token": access_token,"id_user": user.id_user})

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

@api.route('/minigame/<int:id_mini>', methods=['GET'])
def get_minigame(id_mini):

    minigame_query = Minigames.query.filter_by(id_minigame = id_mini).first()

    if not minigame_query:

        return jsonify({'msg':"No hay ningun minijuego en la base de datos"}), 404

   

    return jsonify(minigame_query.serialize()), 200


@api.route('/minigame', methods = ['POST'])
def post_minigame():

    data = request.get_json()

    if not data:

        return jsonify({'msg': "No has enviado data para crear el minijuego"}), 400
    
    #title_formatted = data["title"].replace(" ", "").lower()

    minigame = Minigames.query.filter_by(title = data["title"]).first()

    if minigame is not None:

        return jsonify({'msg': f"Ya existe un Minigame con ese title:{data['title']}"})

    new_minigame = Minigames(
                            title = data["title"],
                            description = data['description'],
                            points_per_win = data['points_per_win'],
                            lives = data['lives'],
                            game_time = data['game_time'],
                            click_time = data['click_time']
    
                            )

    try:
        db.session.add(new_minigame)
        db.session.commit()

        return jsonify({"msg":"Minijuego creado correctamente" ,"minigame": new_minigame.serialize()}), 200

    except Exception as e:

        db.session.rollback()
        return jsonify({'msg': f"Error al crear el minigame: {str(e)}"}), 500


@api.route('/minigame', methods = ['PUT'])
def put_minigame():

    data = request.get_json()

    if not data:

        return jsonify({'msg': "No has enviado informacion para editar el minijuego"}), 404

    title_formatted = data["title"].replace(" ", "").lower()

    minigame = Minigames.query.filter_by(title = title_formatted).first()

    if minigame is None:

        return jsonify({'msg': f"El minijuego con el title:{data['title']} no existe"}), 400

    minigame.title = title_formatted
    minigame.description = data.get('description' , minigame.description)
    minigame.points_per_win = data.get('points_per_win',minigame.points_per_win)
    minigame.lives = data.get('lives',minigame.lives)
    minigame.game_time = data.get('game_time',minigame.game_time)
    minigame.click_time = data.get('click_time',minigame.click_time)

    try:

        db.session.commit()

        return jsonify({'msg' : "Se ha modificado el minjuego correctamente"}), 200
    
    except Exception as e :

        db.session.rollback()

        return jsonify({'msg': f"Fallo al modificar el minijuego en la Base de datos : {str(e)}"})
    




@api.route('/minigame/<int:id_mini>', methods = ['DELETE'])
def delete_minigame(id_mini):


    minigame_to_delete = Minigames.query.filter_by(id_minigame = id_mini).first()

    if minigame_to_delete is None:


        return jsonify({'msg': "No existe el minigame que deseas borrar con este id:" + id_mini}), 400


    try:

        db.session.delete(minigame_to_delete)
        db.session.commit()
        return jsonify({"msg":"El minijuego se ha borrado correctameente"},minigame_to_delete.serialize()), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({'msg': f"Fallo al borrar el minijuego en la Base de datos : {str(e)}"})
    




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
    

    new_played_game = Played_games(
                                    user_id = data["user_id"],
                                    minigame_id = data["minigame_id"],
                                    game_data = data["game_data"],
                                    game_points = data["game_points"],
                                    record = data["record"],
                                    mithril_per_second = data["mithril_per_second"]
                                    )
    
    try:

        db.session.add(new_played_game)
        db.session.commit()

        return({"msg" : "El played_game ha sido creado correctamente"}), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({'msg': f"Fallo al crear played_games en la Base de datos : {str(e)}"}), 500


@api.route("/played_games/<int:id_played_gam>" , methods = ['PUT'])
def put_game_data(id_played_gam):

    data = request.get_json()

    if "game_data" not in data:

        return jsonify({"msg": "No has enviado la info de played_games"}), 400
    
    played_game = Played_games.query.filter_by(id_played_games = id_played_gam).first()

    if played_game is None:

        return jsonify({"msg": f"No existe el played_game con esta id : {str(id_played_gam)}"}), 400
    
    played_game.game_data = data.get("game_data", played_game.game_data)
    played_game.game_points = data.get("game_points", played_game.game_points)
    played_game.record = data.get("record", played_game.record)
    played_game.mithril_per_second = data.get("mithril_per_second", played_game.mithril_per_second)

    try:

        db.session.commit()

        return({"msg" : "EL played_game ha sido editado correctamente"}), 200
    
    except Exception as e:

        return({"msg" : "Fallo al editar el played_game en la base de datos"}), 500




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

        return jsonify({'msg': "El valor de 'game_points' debe ser un número entero válido"}), 400

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
    


    
############### TESTED ################
@api.route('/played_games/last_games/<int:id_us>', methods=['GET'])
def get_last_games(id_us):
    
    last_games = Played_games.query.filter_by(user_id=id_us).order_by(Played_games.id_played_games.desc()).limit(5).all()
    if not last_games:
        return jsonify({'msg': 'No hay ningun juego jugado todavia'}), 400

    
    usergame_info = [usergame.serialize() for usergame in last_games]

    return jsonify(usergame_info), 200

############### TESTED ################
@api.route('/played_games/best_games/<int:id_mini>', methods=['GET'])
def get_best_games(id_mini):
    
    best_games = Played_games.query.filter_by(minigame_id=id_mini).order_by(Played_games.game_points.desc()).limit(5).all()
    
    if not best_games:
        return jsonify({'msg': 'No hay ninguna partida jugada en ese minijuego'}), 400

    
    best_games_info = [best_games.serialize() for best_games in best_games]

    return jsonify(best_games_info), 200

