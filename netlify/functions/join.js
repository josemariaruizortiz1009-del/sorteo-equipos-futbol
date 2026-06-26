import { PLAYERS, json, options, buildTeams, getState, saveState } from './_shared.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return options();
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const player = String(body.player || '').trim();

    if (!PLAYERS.includes(player)) {
      return json({ error: 'Jugador no válido' }, 400);
    }

    const state = await getState();

    if (state.assignments[player]) {
      return json({
        ok: true,
        alreadyAssigned: true,
        player,
        team: state.assignments[player].team,
        teams: buildTeams(state.assignments)
      });
    }

    const teams = buildTeams(state.assignments);
    const count1 = teams['Equipo 1'].length;
    const count2 = teams['Equipo 2'].length;

    let team;
    if (count1 < count2) team = 'Equipo 1';
    else if (count2 < count1) team = 'Equipo 2';
    else team = Math.random() < 0.5 ? 'Equipo 1' : 'Equipo 2';

    state.assignments[player] = {
      team,
      assignedAt: new Date().toISOString()
    };

    await saveState(state);

    return json({
      ok: true,
      alreadyAssigned: false,
      player,
      team,
      teams: buildTeams(state.assignments)
    });
  } catch (error) {
    return json({ error: 'No se pudo asignar el equipo', detail: error.message }, 500);
  }
}

export const config = {
  path: '/api/join'
};
