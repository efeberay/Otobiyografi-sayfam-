# Efe Beray - Kisisel Web Sitesi

Statik HTML/CSS/JS ile hazirlanan, TR/EN dil secenekli kisisel site. Ana sayfa, hakkimda, Basibuyuk mahallesi tanitim sayfasi ve iletisim bolumu; chatbot, tema anahtari, harita ve galeri bilesenleri barindirir.

## Ozellikler
- Ana sayfa: kisa biyografi, sosyal baglantilar, BerayEfe Bot kisayolu
- Hakkimda: egitim zaman cizelgesi, hobiler, teknik yetenek cubuklari, hedefler, kullandigim cihazlar
- Basibuyuk: tarihce, zaman cizelgesi, Google Maps embed, fotograf galerisi, alt sayfalar (hastane, cezaevi, universite)
- Iletisim: e-posta ve sosyal medya baglantilari, SSS, ikon seti
- Tema ve gezinme: mobil menu (`js/nav.js`), acik/koyu tema anahtari (`js/theme.js`), viewport duzeltmesi (`js/viewport.js`)
- Chatbot: `js/chatbot.js` Render uzerindeki API'ye POST atar; mesaj gecmisi ve acik/kapali durumu `localStorage`'da saklanir

## Dosya yapisi
- `index.html`: ana sayfa, hero, chatbot giris bileseni
- `hakkimda.html`: biyografi, timeline, hobiler, skill barlari, hedef kartlari, setup
- `basibuyuk.html`: mahalle tanitimi, harita, galeri, alt sayfa baglantilari
- `bsk/`: Basibuyuk alt sayfalari (`sureyyapasa.html`, `maltepe-cezaevi.html`, `basibuyuk-universite.html`)
- `iletisim.html`: iletisim kartlari, SSS, chatbot bolumu
- `en/`: sayfalarin Ingilizce karsiliklari
- `css/style.css`: genel stil dosyasi ve responsive duzenler
- `js/`: `nav.js`, `theme.js`, `viewport.js`, `gallery.js`, `chatbot.js`
- `img/`: gorseller, favicon ve OG gorselleri

## Calistirma
- Bagimlilik yok; `index.html` dosyasini dogrudan acabilir veya basit bir sunucu calistirabilirsin (ornegin `python -m http.server 8000`).
- Chatbotun calismasi icin internet gerekir; API kapaliysa uyarilarla doner.

## Dagitim
- Statik hosting (GitHub Pages/Netlify/Vercel) icin depo kokunu yuklemek yeterli.
- Alan adi degisirse `canonical` ve OG `og:url` degerlerini yeni domaine gore guncelle.
