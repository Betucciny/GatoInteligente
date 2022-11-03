const X_IMAGE_URL = 'assets/imgs/x.png';
const O_IMAGE_URL = 'assets/imgs/o.png';

function asignaEspacio(espacio, propietario) {
  const image = document.createElement('img');
  image.src = propietario === 'x' ? X_IMAGE_URL : O_IMAGE_URL;
  espacio.appendChild(image);

  const indice = parseInt(espacio.dataset.index);
  cajasOcupadas[indice] = propietario;
  const indiceToRemove = cajasLibres.indexOf(espacio);
  cajasLibres.splice(indiceToRemove, 1);
  espacio.removeEventListener('click', cambiarAX);
}

function cambiarAX(event) {
  asignaEspacio(event.currentTarget, 'x');

  if (terminoElJuego()) {
    despliegaGanador();
  } else {
    computadoraEscogeO();
  }
}

function computadoraEscogeO() {
  const indice = bestMove('o');
  const espacioLibre = cajasLibres[indice];

  asignaEspacio(espacioLibre, 'o');

  if (terminoElJuego()) {
    despliegaGanador();
  }
}

function terminoElJuego() {
  return cajasLibres.length === 0 || obtenerGanador() !== null;
}

function despliegaGanador() {
  const ganador = obtenerGanador();

  const contenedorResultado = document.querySelector('#results');
  const header = document.createElement('h1');
  if (ganador === 'x') {
    header.textContent = 'Ganaste!';
  } else if (ganador === 'o') {
    header.textContent = 'La computadora gano';
  } else {
    header.textContent = 'Tablas';
  }
  contenedorResultado.appendChild(header);

  // Eliminar los listeners de evento restantes
  for (const caja of cajasLibres) {
    caja.removeEventListener('click', cambiarAX);
  }
}

function checarCajas(uno, dos,  tres) {
  if (cajasOcupadas[uno] !== undefined &&
      cajasOcupadas[uno] === cajasOcupadas[dos] &&
      cajasOcupadas[dos] === cajasOcupadas[tres]) {
    return cajasOcupadas[uno];
  }
  return null;
}

// Regresa 'x', 'o', o null cuando aun no hay ganador.
function obtenerGanador() {
  for (let col = 0; col < 3; col++) {
    const desplazamiento = col * 3;
    // Checa renglones y columnas.
    let result = checarCajas(desplazamiento, 1 + desplazamiento, 2 + desplazamiento) ||
        checarCajas(col, 3 + col, 6 + col);
    if (result) {
      return result;
    }
  }

  // Checar diagonales
  return checarCajas(0, 4, 8) || checarCajas(2, 4, 6);
}


function createBoard(){
  let board= [['','',''],
              ['','',''],
              ['','','']]
  for (let i in cajasOcupadas){
    let y = i % 3;
    let x = Math.floor(i/3);
    board[x][y] = cajasOcupadas[i];
  }
  return board
}

function bestMove(jugador){
  let bestScore, score, bestMove, isMax;
  let board = createBoard();
  if(jugador === 'x'){
    bestScore = -Infinity;
    isMax = 0;
  }else{
    bestScore = Infinity;
    isMax = 1;
  }
  for(let i=0; i<3;i++){
    for(let j=0; j<3; j++){
      if (board[i][j] === ''){
        board[i][j] = jugador;
        score = minimax(board, 0, isMax);
        board[i][j] = '';
        if(jugador === 'x'){
          if (score > bestScore){
            bestScore = score;
            bestMove = [i, j];
          }
        }else{
          if (score < bestScore){
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
  }
  let indice = 0, flag = false;
  for(let i=0; i<3; i++){
    for(let j=0; j<3; j++){
      if(i===bestMove[0] && j===bestMove[1]){
        flag = true;
        break;
      }
      if(board[i][j]===''){
        indice++;
      }
    }
    if(flag){
      break;
    }
  }
  return indice;
}

function checkWinner(board){
  let winner = 'n';
  for (let i =0; i<3; i++){
    if(board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][2] !== ''){
      winner= board[i][0];
      break;
    }
    if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[2][i] !== ''){
      winner= board[0][i];
      break;
    }
  }

  if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] !== ''){
    winner= board[0][0];
  }
  if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[2][0] !== ''){
    winner= board[0][2];
  }
  let open = 0;
  for (let i=0; i<3; i++){
    for (let j=0; j<3; j++){
      if(board[i][j]==='') {
        open ++;
      }
    }
  }

  if(winner === 'n' && open === 0){
    return 't';
  }else{
    return winner
  }
}

let puntos = {'x': 1,
              'o': -1,
              't': 0}

function minimax(board, depth, isMax){
  let winner = checkWinner(board);
  let score, bestScore, player;
  if(winner !== 'n' ){
    return puntos[winner];
  }
  if(isMax){
    bestScore = -Infinity;
    player = 'x';
  }else{
    bestScore = Infinity;
    player = 'o';
  }
  for(let i=0; i<3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        board[i][j] = player;
        score = minimax(board, depth + 1, !isMax);
        board[i][j] = '';
        if(isMax){
          if (score > bestScore) {
            bestScore = score;
          }
        }else{
          if (score < bestScore) {
            bestScore = score;
          }
        }
      }
    }
  }
  return bestScore;
}



function player1(){
  reiniciar()
}

function player2(){
  reiniciar()
  computadoraEscogeO();
}

function reiniciar(){
  cajasOcupadas = new Map();
  cajasLibres = [];
  const cajas = document.querySelectorAll('#grid div');
  document.querySelector('#results').innerHTML = '';
  for (const caja of cajas) {

    caja.innerHTML = '';
    caja.addEventListener('click', cambiarAX);
    cajasLibres.push(caja);
  }
}

let cajasLibres = [];
let cajasOcupadas = new Map();


const buttonHumano = document.getElementById('playerUno');
buttonHumano.addEventListener('click', player1)

const buttonMaquina = document.getElementById('playerDos');
buttonMaquina.addEventListener('click', player2)
