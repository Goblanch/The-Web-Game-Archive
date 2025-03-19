from api.models import Minigames, db

def populate_minigames():
    """
    Función para poblar la tabla Minigames con datos predefinidos.
    """

    try:
        for game_data in minigames_data:
            title_formatted = game_data["title"].replace(" ", "").lower()
            existing_game = Minigames.query.filter_by(title=title_formatted).first()

            if existing_game is None:
                new_game = Minigames(
                    title=title_formatted,
                    description=game_data["description"],
                    points_per_win=game_data["points_per_win"],
                    lives=game_data["lives"],
                    game_time=game_data["game_time"],
                    click_time=game_data["click_time"]
                )
                db.session.add(new_game)

        db.session.commit()
        return {"msg": "Minijuegos poblados correctamente"}
    except Exception as e:
        db.session.rollback()
        return {"msg": f"Error al poblar los minijuegos: {str(e)}"}