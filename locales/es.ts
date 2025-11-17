export const es = {
  // PlayerSetup
  title: 'CariocAI',
  setupSubtitle: 'Configura tu partida',
  playerNamePlaceholder: "Nombre del jugador",
  players: 'Jugadores',
  addAtLeastTwo: 'Agrega al menos 2 jugadores para empezar.',
  showAdvancedOptions: 'Mostrar Opciones Avanzadas',
  hideAdvancedOptions: 'Ocultar Opciones Avanzadas',
  activeRounds: 'Rondas Activas',
  cardScoresForScanner: 'Puntajes de Cartas (para Escáner)',
  gameInstructions: 'Instrucciones del Juego',
  startGame: 'Empezar Juego',
  settings: 'Ajustes',
  language: 'Idioma',
  rounds: 'Rondas',
  scores: 'Puntajes',
  continueGame: 'Continuar Juego',
  selectAll: 'Marcar Todas',
  deselectAll: 'Desmarcar Todas',

  // RoundWinnerSelection
  round: 'Ronda',
  whoWonTheRound: '¿Quién ganó la ronda?',
  winnerGetsZero: 'El ganador recibe 0 puntos.',
  skipRound: 'Saltar Ronda',
  startNewGame: 'Empezar Nuevo Juego',
  thirteenCardRoundInfo: 'ⓘ En esta ronda se reparten 13 cartas.',
  changeRound: 'Cambiar Ronda',
  completed: 'Completada',

  // RoundScoreInput
  scorePoints: 'Puntos',
  winner: 'Ganador',
  analyzingCards: 'Analizando cartas...',
  recordScores: 'Registrar Puntos',

  // Standings
  endOfRound: 'Fin de la Ronda',
  standings: 'Tabla de Posiciones',
  scoreSheet: 'Tabla de Puntuaciones',
  total: 'Total',
  nextRound: 'Siguiente Ronda',
  viewFinalResults: 'Ver Resultados Finales',

  // GameEnd
  gameFinished: '¡Juego Terminado!',
  winnerIs: 'Ganador',
  winnersAre: 'Ganadores',
  withPoints: 'con {score} puntos',
  finalResults: 'Resultados Finales',
  playAgain: 'Jugar de Nuevo',

  // CardScanner
  cameraAccessError: 'No se pudo acceder a la cámara. Revisa los permisos.',
  scannerHelperText: 'Asegúrate de que todas las cartas estén visibles y cerca del lente.',
  cancel: 'Cancelar',
  uploadPhoto: 'Subir Foto',

  // ScanConfirmation
  confirmScore: 'Confirmar Puntaje',
  capture: 'Captura',
  detectedCardsEditable: 'Cartas Detectadas (editables)',
  rank: 'Rango',
  addCard: 'Añadir Carta',
  noCardsAddOne: 'No hay cartas. Añade una.',
  totalScore: 'Puntaje Total',
  scanAgain: 'Escanear de Nuevo',
  confirm: 'Confirmar',

  // HelpModal
  cardScores: 'Puntuación de Cartas',
  close: 'Cerrar',

  // InstructionsModal
  howToPlay: 'Cómo Jugar Carioca',
  understood: 'Entendido',
  objective: 'Objetivo:',
  objectiveText: 'Ser el jugador con menos puntos al final de todas las rondas. El juego consiste en "bajarse" (exponer las cartas en la mesa) formando las manos requeridas en cada ronda.',
  theGame: 'El Juego:',
  gameRule1: 'Se juega con 2 mazos de naipes ingleses + 4 Jokers.',
  gameRule2: 'En cada turno, un jugador debe robar una carta (del mazo o del pozo) y luego descartar una.',
  gameRule3: 'Para "bajarse", un jugador debe tener la combinación de cartas requerida por la ronda y exponerla en la mesa.',
  gameRule4: 'Una vez que un jugador se baja, debe esperar un turno completo antes de poder "echar" cartas adicionales en su propia jugada o en las de otros jugadores que también se hayan bajado.',
  gameRule5: 'La ronda termina cuando un jugador se queda sin cartas en la mano. Para señalarlo, descarta su última carta boca abajo en el pozo. ¡Ese jugador gana la ronda!',
  jokerRules: 'Reglas del Joker:',
  jokerRule1: 'No se puede colocar más de un Joker por trío o escala.',
  jokerRule2: 'Los Jokers en los extremos de una escala pueden ser movidos. Por ejemplo, en una escala JOKER-3-4-5, ese Joker puede ser reemplazado por un 2 o un 6, permitiendo que el Joker se mueva a otro lugar de la misma escala.',
  scoring: 'Puntuación:',
  scoringRule1: 'El jugador que gana la ronda (se queda sin cartas) obtiene 0 puntos.',
  scoringRule2: 'Los demás jugadores suman los puntos de las cartas que les quedaron en la mano, se hayan bajado o no.',
  scoringRule3: 'Al final de todas las rondas, el jugador con el puntaje total más bajo es el ganador.',
  goodLuck: '¡Buena suerte!',

  // Errors
  cardRecognitionError: 'No se pudieron reconocer las cartas. Intenta con una mejor foto.',
  scanError_BLURRY: 'La imagen está muy borrosa. Intenta con una foto más nítida.',
  scanError_BAD_LIGHTING: 'Mala iluminación o mucho reflejo. Busca un lugar mejor iluminado.',
  scanError_NO_CARDS_DETECTED: 'No se detectaron cartas. Asegúrate de que estén bien visibles en la foto.',
  scanError_UNKNOWN: 'Ocurrió un error desconocido. Por favor, intenta de nuevo.',

  // Rounds
  roundName_two_sets: "2 Tríos",
  roundDescription_two_sets: "2 grupos de 3 cartas del mismo valor",
  roundName_one_set_one_run: "1 Trío y 1 Escala",
  roundDescription_one_set_one_run: "1 grupo de 3 cartas iguales y 1 escala de 4 cartas",
  roundName_two_runs: "2 Escalas",
  roundDescription_two_runs: "2 escaleras de 4 cartas",
  roundName_three_sets: "3 Tríos",
  roundDescription_three_sets: "3 grupos de 3 cartas del mismo valor",
  roundName_two_sets_one_run: "2 Tríos y 1 Escala",
  roundDescription_two_sets_one_run: "2 grupos de 3 cartas iguales y 1 escala de 4 cartas",
  roundName_one_set_two_runs: "1 Trío y 2 Escalas",
  roundDescription_one_set_two_runs: "1 grupo de 3 cartas iguales y 2 escaleras de 4 cartas",
  roundName_three_runs: "3 Escalas",
  roundDescription_three_runs: "3 escaleras de 4 cartas",
  roundName_four_sets: "4 Tríos",
  roundDescription_four_sets: "4 grupos de 3 cartas del mismo valor",
  roundName_dirty_run: "Escala Sucia",
  roundDescription_dirty_run: "1 escalera de 13 cartas (puede usar Jokers)",
  roundName_royal_run: "Escala Real",
  roundDescription_royal_run: "1 escalera de 13 cartas del mismo palo (sin Jokers)"
};