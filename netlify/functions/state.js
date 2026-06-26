const { PLAYERS, json, options, buildTeams, getState } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'GET') return json(405, { error: 'Método no permitido' });

  try {
    const state = await getState();
    return json(200, {
      players: PLAYERS,
      assignments: state.assignments,
      teams: buildTeams(state.assignments),
      updatedAt: state.updatedAt
    });
  } catch (error) {
    return json(500, { error: 'No se pudo cargar el sorteo', detail: error.message });
  }
};
