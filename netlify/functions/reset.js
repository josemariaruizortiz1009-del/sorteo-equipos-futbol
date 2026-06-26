const { json, options, saveState } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });

  const resetCode = process.env.RESET_CODE;
  const body = JSON.parse(event.body || '{}');

  if (!resetCode || body.code !== resetCode) {
    return json(403, { error: 'Código de reinicio incorrecto o no configurado' });
  }

  const state = {
    assignments: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await saveState(state);
  return json(200, { ok: true, message: 'Sorteo reiniciado' });
};
