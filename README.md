# Landing Page - Salvando al Jaguar

Landing de donación en HTML/CSS/JS, optimizada para dirigir a GoFundMe.

## Ejecutar localmente

```bash
python3 -m http.server 8080
```

Luego abre: `http://localhost:8080`

## Editar contenido sin tocar HTML

Actualiza `content/site.json`:
- `gofundmeUrl`: URL final de GoFundMe
- `hero.title` / `hero.subtitle`
- `stats`: métricas reales verificables
- `pillars`: iconos, títulos y descripción
- `trust`: cita y vocería

## Assets generados

- `assets/images/hero-desktop.jpg` (2560x1440)
- `assets/images/hero-mobile.jpg` (1080x1350)
- `assets/images/logo-oro.png` (1024x1024)
- `assets/images/trust-photo.jpg` (1600x1000)
- `assets/images/og-image.jpg` (1200x630)
- `assets/images/favicon-64.png` y `assets/images/favicon-32.png`
