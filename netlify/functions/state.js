import { PLAYERS, json, options, buildTeams, getState } from './_shared.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return options();
  if (req.method !== 'GET') return json({ error: 'Método no permitido' }, 405);

  try {
    const state = await getState();
    return json({
      players: PLAYERS,
      assignments: state.assignments,
      teams: buildTeams(state.assignments),
      updatedAt: state.updatedAt
    });
  } catch (error) {
    return json({ error: 'No se pudo cargar el sorteo', detail: error.message }, 500);
  }
}

export const config = {
  path: '/api/state'
};
