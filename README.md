# Bless Cuts — барбершоп у Львові

Живий сайт: **https://nazya-why.github.io/bless-cuts-barbershop/**

Одностраничний сайт реального барбершопу. Чистий HTML/CSS/JS, без білд-кроку і фреймворків — весь код в одному `index.html`.

## Структура проєкту

```
index.html          — весь сайт: розмітка, стилі, скрипт
images/              — фото (JPG-оригінали + WebP-версії для продуктивності)
sitemap.xml          — для пошукових систем
robots.txt
docs/                — повна документація редизайну (дослідження, аудит, дизайн-система, рішення)
  00-inventory.md
  01-research.md
  02-audit.md
  03-strategy-ia.md
  04-design-system.md
  DECISIONS.md        — журнал усіх ключових рішень з обґрунтуванням
  PROGRESS.md
  REPORT.md
  CASE-STUDY.md        — текст кейсу для портфоліо
  screenshots/before/  та /after/ — на 375/768/1280/1920px
  audit-a11y.js         — скрипт axe-core аудиту (Playwright)
  shot.js               — скрипт скріншотів на 4 брейкпоінтах
```

## Як запустити локально

Білд-кроку немає — досить відкрити `index.html` у браузері, або підняти будь-який статичний сервер:

```bash
npx serve .
# або
python3 -m http.server 8000
```

## Як задеплоїти (GitHub Pages)

Сайт уже налаштований на GitHub Pages з гілки `main`, корінь репозиторію. Щоб оновити:

```bash
git checkout main
git merge redesign     # або squash-merge через Pull Request
git push origin main
```

GitHub Pages автоматично пересобирає сторінку протягом ~1 хвилини після пушу в `main`.

## Аудит і скріншоти (відтворити самостійно)

```bash
npm install --no-save playwright axe-core
npx playwright install chromium
node docs/shot.js index.html docs/screenshots/after      # скріншоти 375/768/1280/1920
node docs/audit-a11y.js                                   # axe-core, звіт у docs/axe-report.json
```

## Керування контентом

- **Онлайн-запис** — зовнішня система Altegio, кожен майстер має власне посилання в масиві `BARBERS` у `<script>` в кінці `index.html`.
- **Ціни** — об'єкт `TIERS` там само, 6 рівнів майстрів × 13 послуг.
- **Фото** — додаються в `images/`, для нового фото варто одразу згенерувати WebP-версію (`Pillow`, `save(..., 'WEBP', quality=78)`) і підключити через `<picture><source type="image/webp" ...>`.

## Контекст редизайну

Цей сайт пройшов повний цикл UX/UI редизайну 2026 року — дослідження ринку, аудит (включно з інструментальним axe-core скануванням доступності), нову інформаційну архітектуру, систематизацію дизайн-системи і впровадження SEO/доступності/продуктивності. Повний журнал рішень і обґрунтувань — `docs/DECISIONS.md`; підсумковий звіт — `docs/REPORT.md`.
