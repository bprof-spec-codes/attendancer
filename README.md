# attendancer
# Email Service

## Leírás

Ez az **Email Service** a projekt **felhasználói regisztrációja** során küld emailt a regisztrált felhasználónak.  
A szolgáltatás **template alapú**, így minden email HTML sablonból generálódik.  

Jelenleg a fejlesztői környezetben a szolgáltatás **lokálisan futó SMTP szerverre** csatlakozik, ami a mi esetünkben egy **FakeSMTP**.

- Email template-ek a `EmailTemplates` mappában találhatók (`registration.html`, stb.)  
- A **backend** a regisztrációs folyamat végén automatikusan elküldi az emailt.  
- A **frontend** (pl. Angular) csak meghívja a regisztrációs API-t, az email küldést a backend intézi.

---

## Használat

###  SMTP szerver futtatása fejlesztéshez

- Töltsd le a **FakeSMTP**-t innen: [FakeSMTP Download](https://nilhcem.github.io/FakeSMTP/)  
- Indítsd el a programot a **localhost**-on, pl. port `25`-ön.  
- A MailKit kód a backendben így csatlakozik:

```csharp
await client.ConnectAsync("localhost", 25, false);


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