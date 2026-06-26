# Sorteo de Equipos de Futbol para Netlify

Esta app permite que cada jugador toque su nombre y quede asignado automáticamente al Equipo 1 o Equipo 2.

## Jugadores incluidos

- Mario Zepeda
- Martin
- Jose Luis
- Daniel Reyes
- Toño Ybañez
- Efrain
- Jaime
- Isra
- Oscar Hinojosa
- Ricardo
- Francisco R
- Pelayo
- JJ
- Chema
- Angel

## Cómo subirlo a Netlify

### Opción recomendada: GitHub + Netlify

1. Descomprime este ZIP.
2. Crea un repositorio nuevo en GitHub.
3. Sube todos los archivos y carpetas a ese repositorio.
4. En Netlify entra a Add new project > Import an existing project.
5. Selecciona GitHub y el repositorio.
6. Deploy.
7. Comparte el link de Netlify por WhatsApp.

## Importante

Esta app usa Netlify Functions y Netlify Blobs para guardar los equipos.
No es solo una página estática, porque necesita recordar qué nombres ya fueron elegidos.

## Reiniciar sorteo

La función de reinicio está preparada, pero debes configurar una variable de ambiente llamada RESET_CODE en Netlify.
Después puedes hacer una llamada POST a /api/reset con JSON: { "code": "TU_CODIGO" }.
