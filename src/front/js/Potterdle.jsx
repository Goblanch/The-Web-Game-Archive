import React, { useState, useEffect, useRef } from 'react';
import GameOverModal from "./component/GameOverModal.jsx";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx";
import Swal from 'sweetalert2';
import { createNewPlayedGame, addTotalPoints } from '../services/APIServices.js';

const Potterdle = () => {
  const [targetWord, setTargetWord] = useState(''); // Palabra a adivinar
  const [guesses, setGuesses] = useState([]); // Intentos anteriores
  const [currentGuess, setCurrentGuess] = useState([]); // Palabra que el usuario esta escribiendo
  const maxAttempts = 5; // Maximo de intentos
  const inputRefs = useRef([]); // Referencias a los inputs para manejar el foco
  const [score, setScore] = useState(4);
  const [gameOver, setGameOver] = useState(false);

  // Teclado virtual
  const keyboardRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split('')
  ];

  // Reinicia el juego
  const resetGame = () => {
    setGameOver(false);
    window.location.reload();
  };

  // Obtener una palabra aleatoria de la API de Harry Potter (nickname)
  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch('https://potterapi-fedeperin.vercel.app/en/characters/random');
      const data = await response.json();
      if (data.nickname) {
        const randomWord = data.nickname.toUpperCase();
        setTargetWord(randomWord);
        setCurrentGuess(Array(randomWord.length).fill('')); //Rellena el array currentGuess con '' segun la longitud de la palabra a adivinar
      } else {
        fetchWord();
      }
    };

    fetchWord();


  }, []);

  console.log(targetWord);

  useEffect(() => {

    if (guesses.length == maxAttempts || guesses.includes(targetWord)) {

      savePlayedGame()

    }


  }, [guesses])

  const savePlayedGame = () => {

    //Llamada a la API para guardar las partida y los Total Points
    const isLogin = sessionStorage.getItem("token")
    if (isLogin) {
      const potterdleInfo = {
        user_id: sessionStorage.getItem("id_user"),
        minigame_id: 5,
        game_data: "Informacion sobre la partida de Potterdle",
        game_points: score,
        record: null,
        mithril_per_second: null
      }

      createNewPlayedGame(potterdleInfo)
      addTotalPoints(score, sessionStorage.getItem("id_user"))
      console.log("Se ha subido tu partida");

    } else {

      return Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: `Debes logearte para poder guardar tus partidas`,
      });

    }


  }

  // Manejar el cambio en los inputs de la palabra
  const handleInputChange = (e, index) => {
    const value = e.target.value.toUpperCase();
    if (value === '' || (value.length === 1 && value >= 'A' && value <= 'Z')) {
      const newGuess = [...currentGuess];
      newGuess[index] = value;
      setCurrentGuess(newGuess);
      // Mover el foco al siguiente input si no es el último
      if (value && index < targetWord.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Maneja la tecla Backspace para moverse al input anterior
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !currentGuess[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Maneja los clics en el teclado virtual
  const handleKeyboardClick = (letter) => {
    const nextEmptyIndex = currentGuess.findIndex((l) => l === '');
    if (nextEmptyIndex !== -1) {
      handleInputChange({ target: { value: letter } }, nextEmptyIndex);
    }
  };

  const handleGameOver = () => {
    setGameOver(true);


  }

  // Enviar un intento
  const handleGuess = () => {
    if (currentGuess.every((letter) => letter !== '') && guesses.length < maxAttempts) {
      setGuesses([...guesses, currentGuess.join('')]);
      setCurrentGuess(Array(targetWord.length).fill(''));
      inputRefs.current[0].focus();
      setScore(score - 1);
    }
  };

  // Obtener el color de las letras en los intentos
  const getLetterColor = (letter, index, guess, targetWord) => {

    const targetLetterCount = {}; // Objeto para contar cuantas veces aparece cada letra en la palabra a adivinar
    const guessLetterCount = {}; // Objeto para contar las letras verdes que servira para asegurarse de no contar mas al momento de asignar letras amarillas

    for (let i = 0; i < targetWord.length; i++) {   // Contar la frecuencia de cada letra en la palabra a adivinar
      targetLetterCount[targetWord[i]] = (targetLetterCount[targetWord[i]] || 0) + 1;
    }

    // Identificar letras que están bien colocadas (verde)
    const greenIndices = new Array(targetWord.length).fill(false); // Array de longitud de la palabra a adivinar que marcara a true cuando la posicion de la letra coincide exactamente (verde)
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        greenIndices[i] = true;
        guessLetterCount[guess[i]] = (guessLetterCount[guess[i]] || 0) + 1;
      }
    }

    // Determinar el color de cada letra
    if (greenIndices[index]) {
      return 'bg-success text-white'; // Verde si se acierta la posición
    } else if (targetWord.includes(letter)) { // Si no es verde revisa si la letra existe en la palabra a adivinar
      const guessedSoFar = guessLetterCount[letter] || 0;
      if (guessedSoFar < (targetLetterCount[letter] || 0)) { // Compara cuantas veces se ha mostrado la letra (verde + amarillo) con cuantas veces existe en la palabra a adivinar (targetLetterCount)
        guessLetterCount[letter] = guessedSoFar + 1;
        return 'bg-warning text-dark'; // Amarillo si está en la palabra pero en otra posición
      }
    }
    return 'bg-secondary text-white'; // Gris si no está en la palabra
  };

  // Obtener el color de las teclas del teclado virtual
  const getKeyboardColor = (letter) => {
    let color = 'btn-outline-light';
    guesses.forEach((guess) => {
      guess.split('').forEach((guessLetter, i) => {
        if (guessLetter === letter) {
          if (targetWord[i] === letter) {
            color = 'bg-success text-white'; // Verde si se acierta la posición
          } else if (color !== 'bg-success text-white' && targetWord.includes(letter)) {
            color = 'bg-warning text-dark'; // Amarillo si está en la palabra pero en otra posición
          } else if (!targetWord.includes(letter)) {
            color = 'bg-secondary text-white'; // Gris si no está en la palabra
          }
        }
      });
    });
    return color;
  };

  // Mostrar "Cargando palabra" mientras se obtiene la palabra
  if (!targetWord) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <h1 className="mb-4">Potterdle</h1>
        <p>Cargando palabra...</p>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 min-vw-100 bg-dark text-white">
      <MinigameRulesModal gameName={"potterdle"} />
      <h1 className="mb-4">Potterdle</h1>
      <h3>Intentos restantes: {maxAttempts - guesses.length}</h3>
      {guesses.length < maxAttempts && !guesses.includes(targetWord) ? (
        <>
          {/* Mostrar intentos anteriores */}
          {guesses.map((guess, i) => (
            <div key={i} className="d-flex mb-2">
              {guess.split('').map((letter, j) => (
                <div key={j} className={`d-flex align-items-center justify-content-center border border-light me-1 ${getLetterColor(letter, j, guess, targetWord)}`} style={{ width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {letter}
                </div>
              ))}
            </div>
          ))}
          {/* Input para la palabra actual */}
          <div className="d-flex mb-3">
            {[...Array(targetWord.length)].map((_, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className="form-control text-center me-1"
                style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}
                maxLength={1}
                value={currentGuess[i] || ''}
                onChange={(e) => handleInputChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>
          <button onClick={() => { handleGuess(); console.log(score); }} disabled={currentGuess.some((letter) => letter === '')} className="btn btn-primary mb-3">Enter</button> {/* Disabled si hay letra sin rellenar */}
          {/* Teclado virtual */}
          <div className="keyboard d-flex flex-column align-items-center">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="d-flex justify-content-center mb-1">
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeyboardClick(key)}
                    className={`btn m-1 ${getKeyboardColor(key)}`}
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-4">
          <h2>{guesses.includes(targetWord) ? `¡Ganaste!` : `Perdiste. La palabra era: ${targetWord}`}</h2>
          <GameOverModal
            score={score}
            onRetry={resetGame}
            show={handleGameOver}
          />
        </div>
      )}
    </div>
  );
};

export default Potterdle;
