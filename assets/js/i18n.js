/* Grading Lab Agency — lightweight client-side i18n.
   ---------------------------------------------------------------------------
   Translates the site into Azerbaijani (az) and Russian (ru) with a language
   switcher in the header. English (en) is the source, so it needs no entries.

   How it works: it matches each on-page text string (normalised: whitespace
   collapsed, curly apostrophes straightened) against a dictionary and swaps it
   in place. A MutationObserver re-translates anything added later (e.g. the
   certificate result). The choice is saved in localStorage.

   To translate more strings later, just add "English": "translation" pairs to
   the `az` and `ru` maps below.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var STORE = 'gla_lang';
  var SUPPORTED = { en: 'EN', az: 'AZ', ru: 'RU' };

  var DICT = {
    az: {
      // nav / chrome
      "Home": "Ana səhifə",
      "Services": "Xidmətlər",
      "Process": "Proses",
      "Certificates": "Sertifikatlar",
      "About": "Haqqımızda",
      "Contact": "Əlaqə",
      "Verify a grade": "Qiyməti yoxla",
      "Skip to content": "Məzmuna keç",
      // hero
      "Baku, Azerbaijan": "Bakı, Azərbaycan",
      "Every collectible": "Hər kolleksiya əşyasının",
      "has a story.": "bir hekayəsi var.",
      "We protect its legacy.": "Biz onun mirasını qoruyuruq.",
      "Grading Lab Agency combines expert authentication, industry-standard grading and tamper-evident encapsulation — so the value of what you own is documented, protected and verifiable anywhere in the world.": "Grading Lab Agency ekspert autentifikasiyasını, sənaye standartına uyğun qiymətləndirməni və müdaxiləyə qarşı qorunan enkapsulyasiyanı birləşdirir — beləliklə, sahib olduğunuz əşyanın dəyəri sənədləşdirilir, qorunur və dünyanın istənilən yerində yoxlanıla bilər.",
      "Submit a collectible": "Əşya təqdim et",
      "Verify a certificate": "Sertifikatı yoxla",
      // slab / cert labels
      "Certification record": "Sertifikat qeydi",
      "Centering": "Mərkəzləşmə",
      "Corners": "Künclər",
      "Edges": "Kənarlar",
      "Surface": "Səth",
      // pillars
      "Expert authentication": "Ekspert autentifikasiyası",
      "Advanced tools and trained eyes verify every detail before a grade is ever assigned.": "Qiymət təyin olunmazdan əvvəl qabaqcıl alətlər və təcrübəli mütəxəssislər hər detalı yoxlayır.",
      "Accurate grading": "Dəqiq qiymətləndirmə",
      "Industry-standard criteria applied consistently, so a GLA grade means the same thing every time.": "Sənaye standartı meyarları həmişə eyni cür tətbiq olunur, ona görə də GLA qiyməti hər dəfə eyni mənanı daşıyır.",
      "Premium encapsulation": "Premium enkapsulyasiya",
      "Tamper-evident, archival-grade holders that protect condition for the long term.": "Müdaxiləni büruzə verən, arxiv səviyyəli qablar əşyanın vəziyyətini uzun müddət qoruyur.",
      "Digital verification": "Rəqəmsal yoxlama",
      "A unique certification number and QR code let anyone confirm authenticity in seconds.": "Unikal sertifikat nömrəsi və QR kod istənilən şəxsə həqiqiliyi saniyələr içində təsdiqləməyə imkan verir.",
      // services
      "What we grade": "Nəyi qiymətləndiririk",
      "Grading for the collectibles you actually collect": "Həqiqətən topladığınız kolleksiya əşyaları üçün qiymətləndirmə",
      "From first-edition holo cards to factory-sealed cartridges, each category has its own inspection criteria — and its own dedicated holder.": "İlk buraxılış holo kartlardan zavod bağlamasında olan kartriclərə qədər — hər kateqoriyanın öz yoxlama meyarları və öz xüsusi qabı var.",
      "Trading cards": "Kolleksiya kartları",
      "Pokémon, One Piece, Yu-Gi-Oh!, Magic, Lorcana, Dragon Ball and wider TCG/CCG collections.": "Pokémon, One Piece, Yu-Gi-Oh!, Magic, Lorcana, Dragon Ball və digər TCG/CCG kolleksiyaları.",
      "Sports cards": "İdman kartları",
      "Basketball, football, baseball, soccer, UFC, Formula 1 and hockey — rookies to vintage.": "Basketbol, amerikan futbolu, beysbol, futbol, UFC, Formula 1 və xokkey — yeni başlayanlardan vintage-ə qədər.",
      "Comic books": "Komikslər",
      "Cover, spine, page quality and restoration detection, sealed in an archival comic case.": "Üz qabığı, cild, səhifə keyfiyyəti və bərpa aşkarlanması — arxiv komiks qabında möhürlənir.",
      "Video games": "Video oyunlar",
      "Factory-sealed and complete titles for PlayStation, Xbox, Nintendo, Sega, Atari and PC.": "PlayStation, Xbox, Nintendo, Sega, Atari və PC üçün zavod bağlamalı və tam komplekt oyunlar.",
      "Diecast & toys": "Metal modellər və oyuncaqlar",
      "Hot Wheels, Matchbox, Mini GT, Tomica, Auto World and limited-edition diecast.": "Hot Wheels, Matchbox, Mini GT, Tomica, Auto World və limitli buraxılış metal modellər.",
      "Coins": "Sikkələr",
      "Strike quality, luster, surface preservation, wear and authenticity — sealed in capsule.": "Zərb keyfiyyəti, parlaqlıq, səth qorunması, aşınma və həqiqilik — kapsulda möhürlənir.",
      "Banknotes": "Banknotlar",
      "Paper quality, centering, folds, stains and print quality for collectible currency.": "Kolleksiya pulları üçün kağız keyfiyyəti, mərkəzləşdirmə, qatlar, ləkələr və çap keyfiyyəti.",
      "Autographs": "Avtoqraflar",
      "Authentication for signed memorabilia, plus witnessed signing at selected events.": "İmzalı yadigarların autentifikasiyası, həmçinin seçilmiş tədbirlərdə şahidli imzalama.",
      "And more": "Və daha çox",
      "Have something unusual? Send us the details and we will tell you how we would handle it.": "Qeyri-adi bir şeyiniz var? Detalları bizə göndərin, onu necə emal edəcəyimizi sizə deyək.",
      // process
      "Our process": "Prosesimiz",
      "Five stages. One consistent standard.": "Beş mərhələ. Vahid standart.",
      "Every item follows the same structured path from your hands to its sealed holder and back.": "Hər əşya əlinizdən möhürlənmiş qaba və geri qayıdana qədər eyni strukturlaşdırılmış yolu keçir.",
      "Submit": "Təqdim et",
      "Send your item safely to us, or hand it over in person in Baku.": "Əşyanızı bizə təhlükəsiz göndərin və ya Bakıda şəxsən təhvil verin.",
      "Authenticate": "Autentifikasiya",
      "We verify authenticity using magnification, lighting and reference comparison.": "Böyütmə, işıqlandırma və istinad müqayisəsi ilə həqiqiliyi yoxlayırıq.",
      "Grade": "Qiymətləndir",
      "Graders evaluate condition against published criteria for the category.": "Qiymətləndiricilər vəziyyəti kateqoriya üzrə dərc olunmuş meyarlara əsasən qiymətləndirir.",
      "Encapsulate": "Enkapsulyasiya et",
      "The item is sealed in a tamper-evident GLA holder with its printed label.": "Əşya çap olunmuş etiketi ilə müdaxiləni büruzə verən GLA qabında möhürlənir.",
      "Return": "Qaytarılma",
      "Registered in our database, then packed and shipped back to you protected.": "Bazamızda qeydə alınır, sonra qablaşdırılıb qorunmuş şəkildə sizə geri göndərilir.",
      "Explore the grading desk": "Qiymətləndirmə masasını kəşf edin",
      "See the full seven-step process and grading scale": "Tam yeddi mərhələli prosesi və qiymətləndirmə şkalasını görün",
      // why gla
      "Built on trust": "Etimad üzərində qurulub",
      "Why collectors choose GLA": "Kolleksiyaçılar niyə GLA-nı seçir",
      "A grade is only worth what the grader's process is worth. Ours is documented, repeatable and open to inspection — because your collection deserves more than an opinion.": "Qiymət yalnız onu verən prosesin dəyəri qədər dəyərlidir. Bizimki sənədləşdirilmiş, təkrarlana bilən və yoxlamaya açıqdır — çünki kolleksiyanız sadəcə bir rəydən daha çoxuna layiqdir.",
      "About the company": "Şirkət haqqında",
      "Professional, published grading standards": "Peşəkar, dərc olunmuş qiymətləndirmə standartları",
      "Tamper-evident holders with secure seals": "Etibarlı möhürlərlə müdaxiləni büruzə verən qablar",
      "Unique certification number on every item": "Hər əşyada unikal sertifikat nömrəsi",
      "Online verification database and QR codes": "Onlayn yoxlama bazası və QR kodlar",
      "High-resolution imaging of every graded item": "Hər qiymətləndirilmiş əşyanın yüksək keyfiyyətli şəkilləri",
      "Insured handling from intake to return": "Qəbuldan qaytarılmaya qədər sığortalı daşınma",
      "A transparent process you can ask questions about": "Suallar verə biləcəyiniz şəffaf proses",
      // verification section
      "Online verification": "Onlayn yoxlama",
      "Check any GLA certification number": "İstənilən GLA sertifikat nömrəsini yoxlayın",
      "Every certified collectible is registered in our database. Enter the number printed on the label — or scan the QR code on the holder — to see the grade, category and certification date.": "Hər sertifikatlaşdırılmış əşya bazamızda qeydə alınıb. Qiyməti, kateqoriyanı və sertifikatlaşdırma tarixini görmək üçün etiketdəki nömrəni daxil edin — və ya qabdakı QR kodu skan edin.",
      "Certification number": "Sertifikat nömrəsi",
      "Three letters followed by seven digits.": "Üç hərf, ardınca yeddi rəqəm.",
      "Verify": "Yoxla",
      "Try a sample:": "Nümunə yoxlayın:",
      "Try a sample record:": "Nümunə qeyd yoxlayın:",
      "Verify a GLA certificate": "GLA sertifikatını yoxlayın",
      "Every item we certify is registered in the GLA database. Enter the certification number from the label — or scan the QR code on the holder — to confirm the grade and details.": "Sertifikatlaşdırdığımız hər əşya GLA bazasında qeydə alınır. Qiyməti və detalları təsdiqləmək üçün etiketdəki sertifikat nömrəsini daxil edin — və ya qabdakı QR kodu skan edin.",
      "Three letters followed by seven digits, printed under the item on the label.": "Üç hərf, ardınca yeddi rəqəm — etiketdə əşyanın altında çap olunur.",
      // cta
      "More than a grade.": "Sadəcə qiymət deyil.",
      "We preserve history.": "Biz tarixi qoruyuruq.",
      "Tell us what you are holding and we will walk you through submission, turnaround and pricing.": "Əlinizdə nə olduğunu bizə deyin, təqdimetmə, icra müddəti və qiymətləndirmə barədə sizi addım-addım yönləndirək.",
      "Start a submission": "Təqdimetməyə başla",
      "Browse services": "Xidmətlərə bax",
      // footer
      "Authentication, grading and secure encapsulation for collectors in Azerbaijan and beyond.": "Azərbaycanda və hüdudlarından kənarda kolleksiyaçılar üçün autentifikasiya, qiymətləndirmə və etibarlı enkapsulyasiya.",
      "Company": "Şirkət",
      "About GLA": "GLA haqqında",
      "Grading process": "Qiymətləndirmə prosesi",
      "Grading Lab Agency. All rights reserved.": "Grading Lab Agency. Bütün hüquqlar qorunur.",
      "Authenticate • Grade • Preserve": "Təsdiqlə • Qiymətləndir • Qoru",
      // verify.js dynamic
      "Searching the GLA certification database…": "GLA sertifikat bazası axtarılır…",
      "Verified": "Təsdiqlənib",
      "Authenticated": "Həqiqiliyi təsdiqlənib",
      "GLA 10-point scale": "GLA 10 ballıq şkala",
      "Category": "Kateqoriya",
      "Certified": "Sertifikatlaşdırılıb",
      "Encapsulation": "Enkapsulyasiya",
      "Record active in the GLA certification database.": "Qeyd GLA sertifikat bazasında aktivdir.",
      "No record found.": "Qeyd tapılmadı.",
      "Check the number printed on the label or the QR code on the holder. If the number is correct and this item is presented as GLA-certified,": "Etiketdəki nömrəni və ya qabdakı QR kodu yoxlayın. Nömrə düzgündürsə və bu əşya GLA sertifikatlı kimi təqdim olunursa,",
      "contact us": "bizimlə əlaqə saxlayın",
      "— it may be counterfeit.": "— o, saxta ola bilər.",
      "Couldn't reach the certification database.": "Sertifikat bazasına qoşulmaq mümkün olmadı.",
      "Please check your connection and try again in a moment.": "Bağlantınızı yoxlayın və bir azdan yenidən cəhd edin."
    },

    ru: {
      "Home": "Главная",
      "Services": "Услуги",
      "Process": "Процесс",
      "Certificates": "Сертификаты",
      "About": "О нас",
      "Contact": "Контакты",
      "Verify a grade": "Проверить оценку",
      "Skip to content": "Перейти к содержимому",
      "Baku, Azerbaijan": "Баку, Азербайджан",
      "Every collectible": "У каждого предмета",
      "has a story.": "есть своя история.",
      "We protect its legacy.": "Мы защищаем его наследие.",
      "Grading Lab Agency combines expert authentication, industry-standard grading and tamper-evident encapsulation — so the value of what you own is documented, protected and verifiable anywhere in the world.": "Grading Lab Agency объединяет экспертную аутентификацию, оценку по отраслевым стандартам и защищённую от вскрытия капсулу — так что ценность того, чем вы владеете, задокументирована, защищена и может быть проверена в любой точке мира.",
      "Submit a collectible": "Отправить предмет",
      "Verify a certificate": "Проверить сертификат",
      "Certification record": "Запись сертификата",
      "Centering": "Центровка",
      "Corners": "Углы",
      "Edges": "Края",
      "Surface": "Поверхность",
      "Expert authentication": "Экспертная аутентификация",
      "Advanced tools and trained eyes verify every detail before a grade is ever assigned.": "Прежде чем выставить оценку, современные инструменты и опытные специалисты проверяют каждую деталь.",
      "Accurate grading": "Точная оценка",
      "Industry-standard criteria applied consistently, so a GLA grade means the same thing every time.": "Отраслевые критерии применяются единообразно, поэтому оценка GLA всегда означает одно и то же.",
      "Premium encapsulation": "Премиальная капсула",
      "Tamper-evident, archival-grade holders that protect condition for the long term.": "Защищённые от вскрытия холдеры архивного класса надолго сохраняют состояние предмета.",
      "Digital verification": "Цифровая проверка",
      "A unique certification number and QR code let anyone confirm authenticity in seconds.": "Уникальный номер сертификата и QR-код позволяют любому подтвердить подлинность за секунды.",
      "What we grade": "Что мы оцениваем",
      "Grading for the collectibles you actually collect": "Оценка для тех предметов, которые вы действительно коллекционируете",
      "From first-edition holo cards to factory-sealed cartridges, each category has its own inspection criteria — and its own dedicated holder.": "От холо-карт первого издания до заводски запечатанных картриджей — у каждой категории свои критерии проверки и свой специальный холдер.",
      "Trading cards": "Коллекционные карты",
      "Pokémon, One Piece, Yu-Gi-Oh!, Magic, Lorcana, Dragon Ball and wider TCG/CCG collections.": "Pokémon, One Piece, Yu-Gi-Oh!, Magic, Lorcana, Dragon Ball и другие коллекции TCG/CCG.",
      "Sports cards": "Спортивные карты",
      "Basketball, football, baseball, soccer, UFC, Formula 1 and hockey — rookies to vintage.": "Баскетбол, американский футбол, бейсбол, футбол, UFC, Формула-1 и хоккей — от новичков до винтажа.",
      "Comic books": "Комиксы",
      "Cover, spine, page quality and restoration detection, sealed in an archival comic case.": "Обложка, корешок, качество страниц и выявление реставрации — запечатано в архивном холдере для комиксов.",
      "Video games": "Видеоигры",
      "Factory-sealed and complete titles for PlayStation, Xbox, Nintendo, Sega, Atari and PC.": "Заводски запечатанные и полные издания для PlayStation, Xbox, Nintendo, Sega, Atari и PC.",
      "Diecast & toys": "Модельки и игрушки",
      "Hot Wheels, Matchbox, Mini GT, Tomica, Auto World and limited-edition diecast.": "Hot Wheels, Matchbox, Mini GT, Tomica, Auto World и модельки ограниченного выпуска.",
      "Coins": "Монеты",
      "Strike quality, luster, surface preservation, wear and authenticity — sealed in capsule.": "Качество чеканки, блеск, сохранность поверхности, износ и подлинность — запечатано в капсуле.",
      "Banknotes": "Банкноты",
      "Paper quality, centering, folds, stains and print quality for collectible currency.": "Качество бумаги, центровка, сгибы, пятна и качество печати для коллекционных банкнот.",
      "Autographs": "Автографы",
      "Authentication for signed memorabilia, plus witnessed signing at selected events.": "Аутентификация подписанных предметов, а также подписание при свидетелях на отдельных мероприятиях.",
      "And more": "И многое другое",
      "Have something unusual? Send us the details and we will tell you how we would handle it.": "Есть что-то необычное? Пришлите нам детали, и мы расскажем, как с этим поступим.",
      "Our process": "Наш процесс",
      "Five stages. One consistent standard.": "Пять этапов. Единый стандарт.",
      "Every item follows the same structured path from your hands to its sealed holder and back.": "Каждый предмет проходит один и тот же структурированный путь — из ваших рук в запечатанный холдер и обратно.",
      "Submit": "Отправка",
      "Send your item safely to us, or hand it over in person in Baku.": "Безопасно отправьте нам предмет или передайте лично в Баку.",
      "Authenticate": "Аутентификация",
      "We verify authenticity using magnification, lighting and reference comparison.": "Мы проверяем подлинность с помощью увеличения, освещения и сравнения с эталонами.",
      "Grade": "Оценка",
      "Graders evaluate condition against published criteria for the category.": "Оценщики оценивают состояние по опубликованным критериям для данной категории.",
      "Encapsulate": "Капсулирование",
      "The item is sealed in a tamper-evident GLA holder with its printed label.": "Предмет запечатывается в защищённый от вскрытия холдер GLA с напечатанной этикеткой.",
      "Return": "Возврат",
      "Registered in our database, then packed and shipped back to you protected.": "Регистрируется в нашей базе, затем упаковывается и защищённо отправляется вам обратно.",
      "Explore the grading desk": "Изучите стол оценщика",
      "See the full seven-step process and grading scale": "Смотрите полный процесс из семи этапов и шкалу оценки",
      "Built on trust": "Построено на доверии",
      "Why collectors choose GLA": "Почему коллекционеры выбирают GLA",
      "A grade is only worth what the grader's process is worth. Ours is documented, repeatable and open to inspection — because your collection deserves more than an opinion.": "Оценка стоит ровно столько, сколько стоит процесс оценщика. Наш — задокументирован, воспроизводим и открыт для проверки, потому что ваша коллекция заслуживает большего, чем просто мнение.",
      "About the company": "О компании",
      "Professional, published grading standards": "Профессиональные, опубликованные стандарты оценки",
      "Tamper-evident holders with secure seals": "Защищённые от вскрытия холдеры с надёжными пломбами",
      "Unique certification number on every item": "Уникальный номер сертификата на каждом предмете",
      "Online verification database and QR codes": "Онлайн-база проверки и QR-коды",
      "High-resolution imaging of every graded item": "Изображения высокого разрешения каждого оценённого предмета",
      "Insured handling from intake to return": "Застрахованная обработка от приёма до возврата",
      "A transparent process you can ask questions about": "Прозрачный процесс, о котором вы можете задавать вопросы",
      "Online verification": "Онлайн-проверка",
      "Check any GLA certification number": "Проверьте любой номер сертификата GLA",
      "Every certified collectible is registered in our database. Enter the number printed on the label — or scan the QR code on the holder — to see the grade, category and certification date.": "Каждый сертифицированный предмет зарегистрирован в нашей базе. Введите номер с этикетки — или отсканируйте QR-код на холдере — чтобы увидеть оценку, категорию и дату сертификации.",
      "Certification number": "Номер сертификата",
      "Three letters followed by seven digits.": "Три буквы, затем семь цифр.",
      "Verify": "Проверить",
      "Try a sample:": "Попробуйте пример:",
      "Try a sample record:": "Попробуйте пример записи:",
      "Verify a GLA certificate": "Проверьте сертификат GLA",
      "Every item we certify is registered in the GLA database. Enter the certification number from the label — or scan the QR code on the holder — to confirm the grade and details.": "Каждый сертифицируемый нами предмет зарегистрирован в базе GLA. Введите номер сертификата с этикетки — или отсканируйте QR-код на холдере — чтобы подтвердить оценку и детали.",
      "Three letters followed by seven digits, printed under the item on the label.": "Три буквы, затем семь цифр — напечатаны под предметом на этикетке.",
      "More than a grade.": "Больше, чем оценка.",
      "We preserve history.": "Мы сохраняем историю.",
      "Tell us what you are holding and we will walk you through submission, turnaround and pricing.": "Расскажите, что у вас есть, и мы проведём вас по процессу отправки, срокам и ценам.",
      "Start a submission": "Начать отправку",
      "Browse services": "Смотреть услуги",
      "Authentication, grading and secure encapsulation for collectors in Azerbaijan and beyond.": "Аутентификация, оценка и надёжное капсулирование для коллекционеров в Азербайджане и за его пределами.",
      "Company": "Компания",
      "About GLA": "О GLA",
      "Grading process": "Процесс оценки",
      "Grading Lab Agency. All rights reserved.": "Grading Lab Agency. Все права защищены.",
      "Authenticate • Grade • Preserve": "Подтверждай • Оценивай • Сохраняй",
      "Searching the GLA certification database…": "Поиск в базе сертификатов GLA…",
      "Verified": "Подтверждено",
      "Authenticated": "Подлинность подтверждена",
      "GLA 10-point scale": "10-балльная шкала GLA",
      "Category": "Категория",
      "Certified": "Сертифицировано",
      "Encapsulation": "Капсула",
      "Record active in the GLA certification database.": "Запись активна в базе сертификатов GLA.",
      "No record found.": "Запись не найдена.",
      "Check the number printed on the label or the QR code on the holder. If the number is correct and this item is presented as GLA-certified,": "Проверьте номер на этикетке или QR-код на холдере. Если номер верен и предмет представлен как сертифицированный GLA,",
      "contact us": "свяжитесь с нами",
      "— it may be counterfeit.": "— возможно, это подделка.",
      "Couldn't reach the certification database.": "Не удалось подключиться к базе сертификатов.",
      "Please check your connection and try again in a moment.": "Проверьте соединение и повторите попытку через мгновение."
    }
  };

  function norm(s) {
    return String(s).replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
  }

  function getLang() {
    var l;
    try { l = localStorage.getItem(STORE); } catch (e) { l = null; }
    return SUPPORTED[l] ? l : 'en';
  }

  var lang = getLang();

  function translateNode(node, map) {
    // Element: walk its text nodes.
    if (node.nodeType === 1) {
      if (node.closest && node.closest('[data-i18n-skip]')) return;
      var tag = node.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return;
      var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
      var texts = [], t;
      while ((t = walker.nextNode())) texts.push(t);
      texts.forEach(function (tn) { translateTextNode(tn, map); });
    } else if (node.nodeType === 3) {
      translateTextNode(node, map);
    }
  }

  function translateTextNode(tn, map) {
    var raw = tn.nodeValue;
    if (!raw || !raw.trim()) return;
    var p = tn.parentNode;
    if (p) {
      var pt = p.nodeName;
      if (pt === 'SCRIPT' || pt === 'STYLE') return;
      if (p.closest && p.closest('[data-i18n-skip]')) return;
    }
    var hit = map[norm(raw)];
    if (hit) {
      var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      tn.nodeValue = lead + hit + trail;
    }
  }

  function apply(root) {
    if (lang === 'en') return;
    var map = DICT[lang];
    if (!map) return;
    translateNode(root || document.body, map);
  }

  function buildSwitcher() {
    var nav = document.querySelector('.nav');
    if (!nav || nav.querySelector('.lang-switch')) return;
    var toggle = nav.querySelector('.nav__toggle');
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';
    wrap.setAttribute('data-i18n-skip', '');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language / Dil / Язык');
    Object.keys(SUPPORTED).forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-switch__btn' + (code === lang ? ' is-active' : '');
      b.setAttribute('data-lang', code);
      b.setAttribute('aria-pressed', String(code === lang));
      b.textContent = SUPPORTED[code];
      b.addEventListener('click', function () {
        if (code === lang) return;
        try { localStorage.setItem(STORE, code); } catch (e) {}
        location.reload();
      });
      wrap.appendChild(b);
    });
    if (toggle) nav.insertBefore(wrap, toggle);
    else nav.appendChild(wrap);
  }

  function run() {
    document.documentElement.lang = lang;
    apply(document.body);
    buildSwitcher();
    if (lang !== 'en') {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) { apply(n); });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
