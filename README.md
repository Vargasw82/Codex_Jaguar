# Landing Page - Mexico Salvando al Jaguar

Landing de donaciones en HTML/CSS/JS con objetivo unico: llevar al visitante a donar en GoFundMe.

## Ejecutar localmente

```bash
python3 -m http.server 8080
```

Abrir: `http://localhost:8080`

## Configuracion de contenido

Todo el contenido editable esta en `content/site.json`.

Campos clave:
- `gofundmeUrl`: URL final de GoFundMe
- `hero`: headline, subheadline y microcopy
- `problem`: datos del reto y solucion
- `impactTiers`: montos y resultado por monto
- `socialProof`: contador, aliados y testimonios
- `transparency`: distribucion de recursos y sellos
- `contact`: email y links legales

## Tracking implementado

Eventos enviados a `dataLayer`:
- `page_view`
- `scroll_depth` (25, 50, 75, 100)
- `cta_click`
- `donation_start`
- `donation_complete` (via `?donation=complete`)
- `share_click`
- `updates_click`

## Archivos legales temporales

Se incluyen placeholders editables en:
- `legal/privacidad.html`
- `legal/terminos.html`
- `legal/reporte.html`
