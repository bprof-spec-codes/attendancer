# Univerzális Jelenléti Ív Alkalmazás (AttenDancer)

## Projektleírás

A feladat egy olyan webalkalmazás megvalósítása, amelyet oktatási intézmények és cégek tudnak jelenléti ív írására használni.

Az alkalmazásba bárki tud regisztrálni, szükséges megadnia vezeték és keresztnevét, email címét és választott jelszavát. Bárki létrehozhat egy jelenléti ívet, amelyhez generálódik egy QR kód és a többi user a leolvasásával feliratkozhat a jelenléti ívre. Ekkor felkerül a jelenléti ívre az illető teljes neve és a pontos idő.

A jelenléti ívek létrehozásakor szükséges két extra funkció is.

- További metaadat opcionális bekérés (pl. neptunkód, ülőhely száma, stb.): ebben az esetben a QR leolvasása után ezeket be kell írni kézzel.
- Jelenléti ívek összekapcsolása: amikor létrehozunk egy ívet, akkor megadható, hogy ez egy korábbi ívvel logikailag összetartozik (pl. 4 alkalmas előadássorozat) és a logikailag csoportba foglalt ívekről megjeleníthető egy táblázatos nézet is, amelyben a sorok a nézők, az oszlopok az alkalmak, a cellákban pedig pipa van, hogyha az illető ott volt, x, hogyha nem volt ott.

## Főbb funkciók

- Felhasználókezelés
- Regisztráció / bejelentkezés / kijelentkezés
- Profiloldal, ahol megtekinthető a felhasználó profilja
- Jelszó módosítása, profil szerkesztése
- Jelenléti ív létrehozás + összekapcsolás + összekapcsolás visszavonása
- Összekapcsolt jelenléti ívek mátrixos megjelenítése
- QR kódos aláírás
