# Merak İstasyonu — Bilişim mini oyunları

Oyun kataloğunda ada veya konuya göre arama yapabilir, konu filtreleriyle listeyi daraltabilir veya görünür oyunlardan birini sürpriz olarak seçebilirsin. Ayrı bulmaca filtresi sıralama, sınıflandırma, bilmece, eşleştirme ve kelime avı turlarını bir araya getirir.

5. ve 6. sınıf öğrencileri için özgün, Türkçe, statik web oyunları. HTML, CSS ve tarayıcı JavaScript'i dışında çalışma zamanı bağımlılığı yoktur. Soru ve oyun verileri `js/data.js`, oyun akışları `js/app.js`, isteğe bağlı yerel sesler `js/sound.js` içindedir. Harici fotoğraf, oyun kütüphanesi, izleyici, reklam, hesap veya kişisel veri toplama yoktur. İllüstrasyonlar CSS ile çizilmiştir; sesler Web Audio ile cihazda üretilir.

## Oyunlar

- Bilgi Çarkı — bilişim konularından birini seçip soru çözme
- Gizemli Kutu — kavramı ipucundan bulma
- Dijital Düzen — giriş/çıkış birimlerini sınıflandırma (dokunarak seç-yerleştir veya sürükle)
- Kod Garajı — bilişim sorularıyla ilerleyen bilgi yarışı
- Kelime Robotu — bilişim kavramlarını harf harf bulma
- Robot Rotası — algoritma komutlarını sıralama
- Siber Dedektif — dijital güvenlik senaryolarında karar verme
- İkili Sayı Büyüsü — 8–4–2–1 basamaklarıyla hedef sayıyı kurma
- Kavram Hafızası — donanım ve görev eşleştirme
- Dosya Dedektifi — dosya uzantılarını türlerine ayırma
- Hata Avcısı — bir akışta işe yaramayan algoritma adımını bulma
- Arama Sihirbazı — kaynak ve bilgi güvenilirliğini değerlendirme
- Siber Kalkan — parola güvenliği alışkanlıklarını gerçek parola girmeden seçme
- Veri Merdiveni — bayt, kilobayt, megabayt, gigabayt ve terabaytı sıralama
- Döngü Dokumacısı — bir şekil/komut bloğunu kaç kez yinelemek gerektiğini görerek bulma
- Robotun Yanılgısı — eğitim örneklerinin çeşitliliğini açıkça basitleştirilmiş bir modelde sınama
- Paket Postanesi — numaralı veri parçalarını seçerek mesajı yeniden birleştirme
- Piksel Atölyesi — 5×5 ikili piksel tablosuyla bitmap şekilleri oluşturma
- Koşul Köprüsü — “eğer … ise” kurallarıyla algoritmanın karar vermesi
- Sayı Şifreleri — Türk alfabesindeki harf sıra numaralarıyla basit kod çözme
- İzin Bekçisi — uygulama izinlerinin istenen özellikle ilgili olup olmadığını değerlendirme
- Veri Sıkıştırma — tekrarlanan sembolleri kısa, kayıpsız bir gösterimle ifade etme
- Web Sayfası Mimarı — sayfa bileşenlerini anlamlı okuma sırasına yerleştirme
- Renk Laboratuvarı — kırmızı, yeşil ve mavi ışıkların RGB karışımını keşfetme
- Görsel Lisansı Dedektifi — Creative Commons işaretlerinin temelini ve görsel kaynağını doğrulamayı öğrenme
- Erişilebilirlik Kahramanı — altyazı, alternatif metin, kontrast, klavye odağı ve kapsayıcı tasarım
- Bulut Kuryesi — bulut eşitlemesi, paylaşım izinleri, çevrimdışı erişim ve yedekleme
- Yapay Zekâ Gerçeklik Kontrolü — cevapları doğrulama, gizlilik, önyargı ve özgünlük
- Mantık Kapıları Laboratuvarı — anahtarlarla VE, VEYA, DEĞİL ve XOR devrelerini çalıştırma
- Ağ Rotası Kurucusu — modem, switch, erişim noktası ve router görevlerini ağ üzerinde eşleştirme

Katalog 100 özgün mini oyuna ulaştı; 70 yeni mini oyun altı farklı etkileşim biçiminde çalışır: senaryolu çoktan seçmeli görev, dokunarak adım sıralama, sınıflandırma kartı, yazılı cevaplı bilmece, kavram-açıklama eşleştirme ve harf ızgarasında kelime arama. Kelime avında kesişen harfler birden fazla cevapta kullanılabilir; klavyeyle ok tuşları, Enter ve boşlukla da oynanabilir. Yeni koleksiyonlar dijital vatandaşlık, web kaynakları, donanım, veri, yapay zekâ, ağ, çevre dostu teknoloji, dijital medya, algoritma, güvenli paylaşım, dosya biçimleri, elektronik tablo, sunum, sensörler, gizlilik ve erişilebilirliği kapsar.

## Yerelde çalıştırma

Klasörde `python -m http.server 8080` çalıştırıp `http://localhost:8080` adresini açın. Sunucu olmadan da `index.html` çoğu tarayıcıda açılır. Hiçbir derleme adımı gerekmez.

Soru/veri kontrolleri için Node.js kurulu bir bilgisayarda `node --test tests/validate-data.mjs` çalıştırın.

## Yeni oyun ekleme

Küçük, sabit görev kümelerini `js/data.js` içinde; etkileşim ve puan akışını `js/app.js` içinde tutun. Oyun kataloğuna `id`, `icon`, `title`, `desc`, `topic`, `color`, `time` ve `run` alanlarıyla bir kayıt ekleyin; basit üç seçenekli görevlerde ortak `choiceMissionGame` akışını kullanın. Özel etkileşimlerde doğru/yanlış denemeleri, yeniden puan kazanmayı engellemeyi ve yeni tura geçişi ayrıca ele alın. Yeni stilleri uygun oyun stil dosyasına (`interactions.css`, `match.css` veya `wordsearch.css`) ekleyin; klavye odağını görünür, dokunma hedeflerini en az 46 px ve dar ekran düzenini okunaklı tutun. `tests/validate-data.mjs` içine veri doğrulaması ve başarı/yeniden deneme testleri ekleyin, sonra `node --test tests/validate-data.mjs` çalıştırın. Katalog sayısı ve oyun listesi README ile birlikte güncellenmelidir.

## Blogger'a bağlama

Bu klasörü önce HTTPS destekleyen statik bir sunucuya (ör. mevcut site alan adınız altında ayrı bir dizin) yayımlayın. Blogger'da bir menü/sayfa bağlantısı ile dış oyuna gitmek en güvenilir seçenektir. Sayfa içine gömmek isterseniz örnek:

```html
<iframe src="https://SİTENİZ/merak-istasyonu/" title="Merak İstasyonu bilişim oyunları" loading="lazy" style="width:100%;min-height:900px;border:0;border-radius:16px" allow="fullscreen"></iframe>
```

Gerçek Blogger temasında mobil yükseklik, klavye odağı ve iframe davranışını ayrıca test edin. Bu proje henüz yayımlanmış veya Blogger'a bağlanmış değildir.

## İçerik referansı ve kullanım

Konu çerçevesi, MEB'in [Bilişim Teknolojileri ve Yazılım Dersi (5–6) öğretim programına](https://tymm.meb.gov.tr/ogretim-programlari/ders/bilisim-teknolojileri-ve-yazilim-dersi) göre özgün olarak yazılmıştır; MEB'e ait metin veya görsel kopyalanmamıştır. Etkileşimler sade web standartlarıyla, erişilebilir etiketler ve dokunmatik kullanım düşünülerek hazırlanmıştır. Sürükleme oyununun ayrıca dokunarak seç-yerleştir yöntemi vardır. Lisans oyununun temel açıklamaları [Creative Commons lisans rehberine](https://creativecommons.org/share-your-work/use-remix/cc-licenses/) dayanır; oyun gerçek bir görsel için hukuki uygunluk kararı vermez, kaynak sayfasını doğrulamayı öğretir.

Genel etkinlik biçimlerini incelerken [Kahoot!'un sınıf içi soru ve sıralama biçimleri](https://kahoot.com/schools/ways-to-play/) ile [Educaplay'in bulmaca, eşleştirme ve kelime arama etkinliklerinden](https://www.educaplay.com/support-center/) esinlenildi. Yalnızca yaygın oyun mekanikleri örnek alındı; bu projedeki adlar, Türkçe görevler, anlatım, kod ve görsel tasarım özgündür. Bu sitelerle bir ortaklık veya onay ilişkisi yoktur.
