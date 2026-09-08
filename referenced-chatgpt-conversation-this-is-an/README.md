# Kalória Asszisztens – stabil MVP

Egy helyben futó, függőségmentes magyar nyelvű kalória- és makrónapló. Az MVP nem tesz úgy, mintha egy becslés laborérték lenne: minden eredményhez tartozik bizonyossági szint, és hiányzó adag vagy kétértelmű étel esetén pontosítást kér.

## Funkciók

- természetes nyelvű naplózás, például: `ebédre 200 g csirkemell és 150 g főtt rizs`
- ismert ételek kalória- és makróbecslése, adattartományokkal
- napi étkezések és összesítés helyi JSON-fájlban
- kérdés-válasz: `mai összesítés`, `mennyi egy banán?`
- életkor szerinti védelem: kiskorúnál nem számol vagy javasol veszélyesen alacsony kalóriacélt

## Indítás

Node.js 20+ szükséges.

```powershell
npm.cmd start
```

Ezután nyisd meg a `http://localhost:3000` címet. Az adatok a `data/store.json` fájlba kerülnek. Fejlesztéshez és visszaállításhoz a `DELETE /api/meals` végpont üríti a naplót.

## Architektúra és MVP-korlátok

- `src/nutrition.js`: determinisztikus ételadatok, becslés és szövegértelmezés
- `src/policy.js`: egészségvédelmi szabályok
- `src/store.js`: kis, atomikus fájltároló
- `src/server.js`: HTTP API és statikus felület

Az ételadatbázis demonstrációs, tipikus átlagértékeket tartalmaz; nem orvosi, címke- vagy dietetikusi adatforrás. A valós termékcímke, recept, zsiradék és elkészítés számottevően módosíthatja az eredményt. Produkcióban hiteles tápanyag-adatforrás, felhasználói hitelesítés, adatvédelmi szabályzat és auditált LLM-eszközhívás szükséges.
