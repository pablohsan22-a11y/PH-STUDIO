# Base web para negocios

Plantilla responsive en HTML, CSS y JavaScript, sin dependencias ni compilación.

## Usar en desarrollo

Desde `/workspace/PH-STUDIO`:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

## Adaptar a cada negocio

1. Copia esta carpeta para cada proyecto, excluyendo `.git`.
2. Edita `negocio.js`: nombre, textos, servicios, color, ubicación, horario y WhatsApp.
3. Reemplaza todos los textos de ejemplo antes de publicar. WhatsApp se habilita solo cuando agregas un número internacional válido.
4. Ajusta el diseño en `styles.css` y las secciones en `index.html`.
5. Publica los archivos en un alojamiento estático con HTTPS.

La base permite trabajar con restaurantes, salones, consultorios, talleres y otros negocios. No incluye reservas, pagos, formularios con envío ni base de datos. Agrega testimonios únicamente cuando tengas testimonios reales y permiso para publicarlos.

## Verificación

```sh
node --check negocio.js
node --check app.js
curl --fail http://127.0.0.1:8000/
```
