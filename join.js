const { getStore, connectLambda } = require('@netlify/blobs');

const PLAYERS = [
  'Mario Zepeda',
  'Martin',
  'Jose Luis',
  'Daniel Reyes',
  'Toño Ybañez',
  'Efrain',
  'Jaime',
  'Isra',
  'Oscar Hinojosa',
  'Ricardo',
  'Francisco R',
  'Pelayo',
  'JJ',
  'Chema',
  'Angel'
];

const STORE_NAME = 'sorteo-equipos-futbol';
const STATE_KEY = 'estado';

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: JSON.stringify(payload)
  };
}

function prepareBlobs(event) {
  // Netlify Blobs necesita esta conexión cuando las funciones usan el formato Lambda.
  if (typeof connectLambda === 'function') {
    connectLambda(event);
  }
}

function options() {
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: ''
  };
}

function cleanAssignments(assignments = {}) {
  const clean = {};
  for (const player of PLAYERS) {
    if (assignments[player] && (assignments[player].team === 'Equipo 1' || assignments[player].team === 'Equipo 2')) {
      clean[player] = assignments[player];
    }
  }
  return clean;
}

function buildTeams(assignments = {}) {
  const team1 = [];
  const team2 = [];
  for (const player of PLAYERS) {
    const item = assignments[player];
    if (item?.team === 'Equipo 1') team1.push(player);
    if (item?.team === 'Equipo 2') team2.push(player);
  }
  return { 'Equipo 1': team1, 'Equipo 2': team2 };
}

async function getState() {
  const store = getStore(STORE_NAME);
  let state = null;
  try {
    state = await store.get(STATE_KEY, { type: 'json' });
  } catch (error) {
    state = null;
  }

  if (!state || typeof state !== 'object') {
    state = {
      assignments: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  state.assignments = cleanAssignments(state.assignments);
  return state;
}

async function saveState(state) {
  const store = getStore(STORE_NAME);
  state.updatedAt = new Date().toISOString();
  await store.setJSON(STATE_KEY, state);
  return state;
}

module.exports = {
  PLAYERS,
  json,
  options,
  buildTeams,
  prepareBlobs,
  getState,
  saveState
};
