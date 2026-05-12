# ForzAI - KI Website

Dies ist eine leistungsstarke KI-Plattform, die für das Web optimiert wurde.

## Hosting auf GitHub Pages

Diese Website ist für das Hosting auf GitHub Pages vorkonfiguriert. 

1. Lade diesen Code in ein GitHub-Repository hoch.
2. Gehe zu **Settings** > **Pages**.
3. Wähle unter **Build and deployment** > **Source** die Option `GitHub Actions`.
4. Gehe zu **Settings** > **Secrets and variables** > **Actions** und füge folgende Secrets hinzu:
   - `GROQ_API_KEY`: Dein Groq API Key
   - `OPENAI_API_KEY`: Dein OpenAI API Key

Sobald du den Code pushst, wird die Website automatisch gebaut und veröffentlicht.

## Lokale Entwicklung

1. `npm install`
2. `npm run dev`

## Statischer Export (HTML Website)

Wenn du die Website manuell als statische Dateien erhalten möchtest:

1. Führe `npm run build` aus.
2. Der Ordner `dist/` enthält die fertige "HTML Website". Du kannst diesen Ordner auf jeden beliebigen Webserver hochladen.
