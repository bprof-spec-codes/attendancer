# attendancer

# Karma Browser Configuration

## Alapértelmezett böngésző

Alapértelmezettként a Karma a **Chrome** böngészőt használja.

## Firefox használata

Ha szeretnéd a teszteket **Firefox** böngészővel futtatni, a következő lépéseket kell követned:

1. Nyisd meg a `karma.conf.js` fájlt.
2. Keresd meg a `browsers` sort.
3. Módosítsd az értéket `['Firefox']`-ra.

Példa:
```js
module.exports = function(config) {
  config.set({
    browsers: ['Firefox'], // Firefox használata
    // ... további beállítások
  });
};