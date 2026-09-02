# TC Electronic G-Force — UA Manual

Український переклад посібника G-Force з брендингом VIRPIL Controls (Markdown → PDF, як у LinkTool).

## Структура

| Папка / файл | Опис |
|--------------|------|
| `source/tc_electronic_g_force.PDF` | Оригінальний PDF (англ.) |
| `manuals/GForce.ua.part1.md` | Markdown — вступ, безпека |
| `manuals/GForce.ua.part2.md` | Markdown — основний текст |
| `translations.mjs` | Переклади по сторінках |
| `pages_*_*.mjs` | Фрагменти перекладів |
| `out/` | Проміжні PDF при збірці |
| `tc_electronic_g_force_UA.pdf` | Готовий результат |

## Збірка PDF

```powershell
cd C:\Users\Vortex\Downloads\tc_electronic_g_force
npm install
npm run build
```

## Залежності

- npm: pdf-lib
- LinkTool repo: marked, puppeteer-core, Oswald fonts, VIRPIL logo
- Edge або Chrome для Puppeteer
