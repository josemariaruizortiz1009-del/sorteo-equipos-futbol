import { getStore } from '@netlify/blobs';

export const PLAYERS = [
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

export function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
  });
}

export function options() {
  return new Response('', {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
  });
}

function cleanAssignments(assignments = {}) {
  const clean = {};
  for (const player of PLAYERS) {
    const item = assignments[player];
    if (item && (item.team === 'Equipo 1' || item.team === 'Equipo 2')) {
      clean[player] = item;
    }
  }
  return clean;
}

export function buildTeams(assignments = {}) {
  const team1 = [];
  const team2 = [];

  for (const player of PLAYERS) {
    const item = assignments[player];
    if (item?.team === 'Equipo 1') team1.push(player);
    if (item?.team === 'Equipo 2') team2.push(player);
  }

  return { 'Equipo 1': team1, 'Equipo 2': team2 };
}

export async function getState() {
  const store = getStore(STORE_NAME);
  let state = null;

  try {
    state = await store.get(STATE_KEY, { type: 'json', consistency: 'strong' });
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

export async function saveState(state) {
  const store = getStore(STORE_NAME);
  state.updatedAt = new Date().toISOString();
  await store.setJSON(STATE_KEY, state);
  return state;
}
