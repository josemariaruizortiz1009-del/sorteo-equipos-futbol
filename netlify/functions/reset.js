import { json, options, saveState } from './_shared.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return options();
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  const resetCode = process.env.RESET_CODE;
  const body = await req.json().catch(() => ({}));

  if (!resetCode || body.code !== resetCode) {
    return json({ error: 'Código de reinicio incorrecto o no configurado' }, 403);
  }

  const state = {
    assignments: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await saveState(state);
  return json({ ok: true, message: 'Sorteo reiniciado' });
}

export const config = {
  path: '/api/reset'
};
