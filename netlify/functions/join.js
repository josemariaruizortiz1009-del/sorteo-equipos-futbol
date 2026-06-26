const { PLAYERS, json, options, buildTeams, getState, saveState } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });

  try {
    const body = JSON.parse(event.body || '{}');
    const player = String(body.player || '').trim();

    if (!PLAYERS.includes(player)) {
      return json(400, { error: 'Jugador no válido' });
    }

    const state = await getState();

    if (state.assignments[player]) {
      return json(200, {
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

    return json(200, {
      ok: true,
      alreadyAssigned: false,
      player,
      team,
      teams: buildTeams(state.assignments)
    });
  } catch (error) {
    return json(500, { error: 'No se pudo asignar el equipo', detail: error.message });
  }
};
