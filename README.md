<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sorteo de Equipos</title>
  <style>
    :root {
      --bg: #07120d;
      --card: #102018;
      --card2: #15281f;
      --green: #21d375;
      --white: #ffffff;
      --muted: #b8c6bd;
      --danger: #ff5959;
      --line: rgba(255, 255, 255, 0.14);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background:
        radial-gradient(circle at top, rgba(33,211,117,.22), transparent 32%),
        linear-gradient(180deg, #07120d, #020403);
      color: var(--white);
      min-height: 100vh;
      padding: 22px;
    }

    .container {
      max-width: 1060px;
      margin: 0 auto;
    }

    .hero {
      text-align: center;
      padding: 22px 10px 18px;
    }

    .badge {
      display: inline-block;
      background: rgba(33,211,117,.12);
      border: 1px solid rgba(33,211,117,.45);
      color: var(--green);
      padding: 7px 12px;
      border-radius: 999px;
      font-size: 14px;
      margin-bottom: 10px;
    }

    h1 {
      margin: 8px 0 8px;
      font-size: clamp(30px, 6vw, 56px);
      line-height: 1;
    }

    .subtitle {
      color: var(--muted);
      max-width: 670px;
      margin: 0 auto;
      font-size: 17px;
    }

    .status {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      margin: 18px 0;
    }

    .pill {
      background: rgba(255,255,255,.08);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 9px 13px;
      color: var(--muted);
      font-size: 14px;
    }

    .pill strong { color: var(--white); }

    .panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      align-items: start;
    }

    .card {
      background: rgba(16,32,24,.92);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 20px 60px rgba(0,0,0,.25);
    }

    .card h2 {
      margin: 0 0 12px;
      font-size: 22px;
    }

    .players-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .player-btn {
      width: 100%;
      border: 1px solid rgba(33,211,117,.35);
      border-radius: 12px;
      padding: 13px 10px;
      background: var(--card2);
      color: var(--white);
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: transform .12s ease, background .12s ease, border .12s ease;
    }

    .player-btn:hover {
      transform: translateY(-1px);
      background: rgba(33,211,117,.14);
      border-color: var(--green);
    }

    .player-btn:disabled {
      cursor: not-allowed;
      opacity: .55;
      background: #202020;
      border-color: rgba(255,255,255,.12);
      transform: none;
    }

    .teams {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .team-box {
      background: rgba(255,255,255,.06);
      border: 1px solid var(--line);
      border-radius: 15px;
      padding: 14px;
      min-height: 240px;
    }

    .team-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 9px;
      color: var(--green);
      font-weight: bold;
      font-size: 18px;
    }

    .count {
      color: var(--white);
      background: rgba(33,211,117,.18);
      border: 1px solid rgba(33,211,117,.35);
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 13px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: 10px;
      margin: 7px 0;
      background: rgba(0,0,0,.23);
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,.08);
    }

    .empty {
      color: var(--muted);
      font-size: 14px;
      margin-top: 16px;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .action-btn {
      flex: 1;
      min-width: 170px;
      border: none;
      border-radius: 12px;
      padding: 13px 12px;
      color: #04140a;
      background: var(--green);
      font-weight: bold;
      cursor: pointer;
      font-size: 15px;
    }

    .action-btn.secondary {
      background: #ffffff;
    }

    .toast {
      position: fixed;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      background: #fff;
      color: #08120d;
      padding: 14px 18px;
      border-radius: 999px;
      font-weight: bold;
      box-shadow: 0 18px 60px rgba(0,0,0,.35);
      display: none;
      max-width: calc(100vw - 32px);
      text-align: center;
      z-index: 10;
    }

    .toast.error { color: var(--danger); }

    @media (max-width: 820px) {
      body { padding: 14px; }
      .panel, .teams { grid-template-columns: 1fr; }
      .players-grid { grid-template-columns: 1fr; }
      .team-box { min-height: auto; }
    }
  </style>
</head>
<body>
  <main class="container">
    <section class="hero">
      <div class="badge">⚽ Dinámica de futbol</div>
      <h1>Sorteo de Equipos</h1>
      <p class="subtitle">Toca únicamente tu nombre. El sistema te mandará automáticamente al Equipo 1 o Equipo 2 y tu nombre quedará bloqueado.</p>

      <div class="status">
        <div class="pill">Jugadores asignados: <strong id="assignedCount">0</strong>/<strong id="totalCount">15</strong></div>
        <div class="pill">Última actualización: <strong id="updatedAt">---</strong></div>
      </div>
    </section>

    <section class="panel">
      <div class="card">
        <h2>Elige tu nombre</h2>
        <div id="players" class="players-grid"></div>
      </div>

      <div class="card">
        <h2>Equipos</h2>
        <div class="teams">
          <div class="team-box">
            <div class="team-title">Equipo 1 <span id="count1" class="count">0</span></div>
            <ul id="team1"></ul>
            <div id="empty1" class="empty">Aún no hay jugadores.</div>
          </div>

          <div class="team-box">
            <div class="team-title">Equipo 2 <span id="count2" class="count">0</span></div>
            <ul id="team2"></ul>
            <div id="empty2" class="empty">Aún no hay jugadores.</div>
          </div>
        </div>

        <div class="actions">
          <button class="action-btn" onclick="shareResults()">Compartir resultados por WhatsApp</button>
          <button class="action-btn secondary" onclick="shareLink()">Compartir link</button>
        </div>
      </div>
    </section>
  </main>

  <div id="toast" class="toast"></div>

  <script>
    let currentState = {
      players: [],
      assignments: {},
      teams: { 'Equipo 1': [], 'Equipo 2': [] }
    };

    const selectedKey = 'sorteoEquipoJugadorSeleccionado';

    function toast(message, isError = false) {
      const box = document.getElementById('toast');
      box.textContent = message;
      box.className = isError ? 'toast error' : 'toast';
      box.style.display = 'block';
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => box.style.display = 'none', 3200);
    }

    async function loadState() {
      try {
        const res = await fetch('/api/state', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al cargar');
        currentState = data;
        render();
      } catch (error) {
        toast('No se pudo cargar el sorteo. Revisa el deploy de Netlify.', true);
        console.error(error);
      }
    }

    function render() {
      const playersDiv = document.getElementById('players');
      playersDiv.innerHTML = '';

      const alreadySelected = localStorage.getItem(selectedKey);

      currentState.players.forEach(player => {
        const assigned = currentState.assignments[player];
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        btn.textContent = assigned ? `${player} · ${assigned.team}` : player;
        btn.disabled = Boolean(assigned) || Boolean(alreadySelected);
        btn.onclick = () => join(player);
        playersDiv.appendChild(btn);
      });

      renderTeam('team1', 'empty1', currentState.teams['Equipo 1']);
      renderTeam('team2', 'empty2', currentState.teams['Equipo 2']);

      const c1 = currentState.teams['Equipo 1'].length;
      const c2 = currentState.teams['Equipo 2'].length;
      document.getElementById('count1').textContent = c1;
      document.getElementById('count2').textContent = c2;
      document.getElementById('assignedCount').textContent = c1 + c2;
      document.getElementById('totalCount').textContent = currentState.players.length;
      document.getElementById('updatedAt').textContent = currentState.updatedAt ? new Date(currentState.updatedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '---';
    }

    function renderTeam(listId, emptyId, players) {
      const list = document.getElementById(listId);
      const empty = document.getElementById(emptyId);
      list.innerHTML = '';
      empty.style.display = players.length ? 'none' : 'block';

      players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        list.appendChild(li);
      });
    }

    async function join(player) {
      const alreadySelected = localStorage.getItem(selectedKey);
      if (alreadySelected) {
        toast(`Este celular ya eligió a ${alreadySelected}.`, true);
        return;
      }

      const ok = confirm(`¿Confirmas que eres ${player}?\n\nSolo puedes elegir una vez.`);
      if (!ok) return;

      try {
        const res = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al asignar');

        localStorage.setItem(selectedKey, player);
        toast(`${player}, te tocó ${data.team} ⚽`);
        await loadState();
      } catch (error) {
        toast(error.message, true);
        console.error(error);
      }
    }

    function makeMessage(includeUrl = false) {
      const t1 = currentState.teams['Equipo 1'];
      const t2 = currentState.teams['Equipo 2'];
      let msg = '⚽ *Sorteo de equipos* ⚽\n\n';
      msg += '*Equipo 1:*\n';
      msg += t1.length ? t1.map(n => `• ${n}`).join('\n') : 'Sin jugadores';
      msg += '\n\n*Equipo 2:*\n';
      msg += t2.length ? t2.map(n => `• ${n}`).join('\n') : 'Sin jugadores';
      if (includeUrl) msg += `\n\nToca tu nombre aquí:\n${location.href}`;
      return msg;
    }

    function shareResults() {
      const msg = encodeURIComponent(makeMessage(false));
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    }

    function shareLink() {
      const msg = encodeURIComponent('⚽ Dinámica de futbol ⚽\n\nToca únicamente tu nombre y el sistema te asignará automáticamente al Equipo 1 o Equipo 2.\n\n' + location.href);
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    }

    loadState();
    setInterval(loadState, 10000);
  </script>
</body>
</html>
