/* ============================================================
   Nozha Concept — Traductions FR / AR
   ============================================================ */

const translations = {
  fr: {
    /* Navbar */
    nav_home:        'Accueil',
    nav_histoire:    'Notre Histoire',
    nav_fondatrice:  'Mot de la Fondatrice',
    nav_homme:       'Homme',
    nav_femme:       'Femme',
    nav_enfant:      'Enfant',
    nav_nouveautes:  'Nouveautés',
    nav_mesures:     'Mesures',
    nav_commande:    'Ma Commande',

    /* Hero */
    hero_eyebrow:    'Maison de Couture Marocaine',
    hero_title:      "L'Art du Vêtement Marocain",
    hero_arabic:     'فن اللباس المغربي',
    hero_cta1:       'Découvrir la Collection',
    hero_cta2:       'Prendre Commande',

    /* Histoire */
    hist_label:      'Notre Histoire',
    hist_title:      'Un Héritage de Savoir-Faire',
    hist_quote:      'Chaque point est une promesse, chaque fil raconte une histoire vieille de siècles.',
    hist_body:       "Depuis notre fondation, Nozha Concept perpétue les traditions de la haute couture marocaine. Chaque pièce est conçue à la main par nos artisans, avec les matières les plus nobles : soie de Fès, brocart de Marrakech, broderie de Salé.",

    /* Vision */
    vis_label:       'Notre Vision',
    vis_title:       "L'Excellence au Service de la Tradition",
    pil1_title:      'Artisanat',
    pil1_text:       'Chaque pièce est confectionnée à la main par nos maîtres artisans, gardiens d\'un savoir-faire ancestral.',
    pil2_title:      'Exclusivité',
    pil2_text:       'Des collections en édition limitée, pour vous offrir une pièce unique qui ne se retrouvera nulle part ailleurs.',
    pil3_title:      'Héritage',
    pil3_text:       'Nous puisons notre inspiration dans l\'art millénaire marocain pour créer des vêtements qui traversent le temps.',

    /* Catégories */
    cat_label:       'Collections',
    cat_title:       'Explorez Notre Univers',
    cat_femme:       'Femme',
    cat_femme_sub:   'Caftan · Guendoura · Djellaba',
    cat_enfant:      'Enfant',
    cat_enfant_sub:  'Caftan · Djellaba · Fête',
    cat_new:         'Nouveautés',
    cat_new_sub:     'Collection Automne 2025',

    /* Nouveautés */
    new_label:       'Arrivages',
    new_title:       'Dernières Créations',
    new_voir_tout:   'Voir tout',

    /* Atelier */
    atel_label:      'Notre Atelier',
    atel_title:      'Le Savoir-Faire à Nu',
    atel_count1:     "15+",
    atel_label1:     "Années d'expérience",
    atel_count2:     "500+",
    atel_label2:     "Pièces créées",
    atel_count3:     "12",
    atel_label3:     "Artisans maîtres",

    /* Témoignages */
    temo_label:      'Elles nous font confiance',
    temo_title:      'La Parole de nos Clientes',

    /* Instagram */
    insta_label:     'Instagram',
    insta_title:     'Notre Atelier en Images',
    insta_cta:       'Suivez notre atelier',

    /* Footer */
    footer_desc:     'Maison de couture marocaine, gardienne d\'un savoir-faire ancestral. Chaque pièce est une œuvre d\'art vivante.',
    footer_col_nav:  'Navigation',
    footer_col_coll: 'Collections',
    footer_col_info: 'Informations',
    footer_nl_ph:    'Votre adresse email',
    footer_nl_btn:   'S\'inscrire',
    footer_copy:     '© 2025 Nozha Concept. Tous droits réservés.',
    footer_ar:       'خياطة تحكي تاريخًا',

    /* Page Femme */
    sidebar_all:     'Tout',
    sidebar_caftan:  'Caftan',
    sidebar_guend:   'Guendoura',
    sidebar_djell:   'Djellaba',
    sidebar_selham:  'Selham',
    sidebar_access:  'Accessoires',

    /* Produit */
    prod_couleur:    'Couleur',
    prod_taille:     'Taille',
    prod_perso:      'Je veux personnaliser cette pièce',
    prod_broderie:   'Broderie',
    prod_fil:        'Couleur du fil',
    prod_doublure:   'Doublure',
    prod_details:    'Détails',
    prod_matieres:   'Matières',
    prod_entretien:  'Entretien',
    prod_livraison:  'Livraison',
    prod_wa:         'Commander via WhatsApp',
    prod_ajouter:    'Ajouter à ma commande',
    prod_similaires: 'Vous aimerez aussi',
    prod_style:      'Cette pièce est portée avec',

    /* WhatsApp messages */
    wa_inquiry: (items) => {
      const list = items.map((it, i) => `${i+1}. ${it.nom} — ${it.couleur} — ${it.taille}`).join('\n');
      return `Bonjour, j'espère que tout va bien \nEst-ce que je peux me renseigner sur ces articles svp :\n\n${list}`;
    },

    wa_product: (nom, couleur, taille, perso) =>
      `Bonjour, j'espère que tout va bien \nEst-ce que je peux me renseigner sur cet article svp :\n*${nom}*\n- Couleur : ${couleur}\n- Taille : ${taille}${perso ? `\n- Personnalisation : ${perso}` : ''}`,

    wa_commande: (items, total) => {
      const lines = items.map((it, i) =>
        `${i+1}. ${it.nom} — ${it.couleur} — ${it.taille} — ${it.prix.toLocaleString('fr-MA')} MAD`
      ).join('\n');
      return `Bonjour, j'espère que tout va bien \nEst-ce que je peux me renseigner sur ces articles svp :\n\n${lines}\n\n*TOTAL estimé : ${total.toLocaleString('fr-MA')} MAD*`;
    },

    wa_mesures: (p, t, h) =>
      `Bonjour ! Voici mes mesures :\n- Poitrine : ${p} cm\n- Taille : ${t} cm\n- Hanches : ${h} cm\n\nJe souhaite commander sur mesure. Merci ! 🌹`,

    wa_newsletter: (email) =>
      `Bonjour ! Je souhaite m'inscrire à votre newsletter.\nMon email : ${email}\nMerci ! `,

    /* Mesures */
    mes_intro:       'Chaque silhouette est unique. Voici comment nous la capturer.',
    mes_title:       'Guide des Mesures',
    mes_label:       'Sur mesure',
    calc_title:      'Trouvez votre taille',
    calc_p:          'Poitrine (cm)',
    calc_t:          'Taille (cm)',
    calc_h:          'Hanches (cm)',
    calc_result:     'Votre taille recommandée',
    calc_wa:         'Envoyer mes mesures par WhatsApp',

    /* Ma Commande */
    cart_title:      'Ma Commande',
    cart_empty:      'Votre commande est vide pour l\'instant.',
    cart_browse:     'Parcourir les collections',
    cart_wa:         'Envoyer ma commande sur WhatsApp',
    cart_total:      'Total estimé',
    cart_pieces:     'pièce(s)',

    /* Nouveautés page */
    nou_countdown:   'Prochaine Collection',
    nou_notif:       'Être notifié en premier',
    nou_title:       'Nouveautés',
    nou_label:       'Arrivages récents',
  },

  ar: {
    /* Navbar */
    nav_home:        'الرئيسية',
    nav_histoire:    'قصتنا',
    nav_fondatrice:  'كلمة المؤسسة',
    nav_homme:       'رجال',
    nav_femme:       'نساء',
    nav_enfant:      'أطفال',
    nav_nouveautes:  'الجديد',
    nav_mesures:     'المقاسات',
    nav_commande:    'طلبيتي',

    /* Hero */
    hero_eyebrow:    'دار الأزياء المغربية',
    hero_title:      'فن اللباس المغربي',
    hero_arabic:     'L\'Art du Vêtement Marocain',
    hero_cta1:       'اكتشف المجموعة',
    hero_cta2:       'اطلب الآن',

    /* Histoire */
    hist_label:      'قصتنا',
    hist_title:      'إرث من المعرفة والحرفية',
    hist_quote:      'كل غرزة هي وعد، وكل خيط يحكي قصة عمرها قرون.',
    hist_body:       'منذ تأسيسنا، تحافظ نزهة كونسيبت على تقاليد الأزياء الراقية المغربية. كل قطعة تُصنع يدوياً من قِبَل حرفيينا بأجود المواد: حرير فاس، وبروكار مراكش، وتطريز سلا.',

    /* Vision */
    vis_label:       'رؤيتنا',
    vis_title:       'التميز في خدمة التراث',
    pil1_title:      'الحرفية',
    pil1_text:       'كل قطعة مصنوعة يدوياً من قبل أساتذة حرفيينا، حُراس معرفة أجدادية.',
    pil2_title:      'الحصرية',
    pil2_text:       'مجموعات بطبعة محدودة، لنقدم لك قطعة فريدة لن تجدها في مكان آخر.',
    pil3_title:      'الإرث',
    pil3_text:       'نستلهم من الفن المغربي العريق لخلق ملابس تتجاوز الزمن.',

    /* Catégories */
    cat_label:       'المجموعات',
    cat_title:       'اكتشف عالمنا',
    cat_femme:       'المرأة',
    cat_femme_sub:   'قفطان · قندورة · جلابة',
    cat_enfant:      'الأطفال',
    cat_enfant_sub:  'قفطان · جلابة · أعياد',
    cat_new:         'الجديد',
    cat_new_sub:     'مجموعة خريف 2025',

    /* Nouveautés */
    new_label:       'الوافد الجديد',
    new_title:       'آخر الإبداعات',
    new_voir_tout:   'مشاهدة الكل',

    /* Atelier */
    atel_label:      'مرسمنا',
    atel_title:      'الحرفية في كامل تجلياتها',
    atel_count1:     '+15',
    atel_label1:     'سنة من الخبرة',
    atel_count2:     '+500',
    atel_label2:     'قطعة مُبدعة',
    atel_count3:     '12',
    atel_label3:     'حرفي متقن',

    /* Témoignages */
    temo_label:      'يثقن بنا',
    temo_title:      'كلمة زبائننا',

    /* Instagram */
    insta_label:     'إنستغرام',
    insta_title:     'مرسمنا في صور',
    insta_cta:       'تابعوا مرسمنا',

    /* Footer */
    footer_desc:     'دار أزياء مغربية، حارسة للمعرفة الأجدادية. كل قطعة هي عمل فني حي.',
    footer_col_nav:  'التنقل',
    footer_col_coll: 'المجموعات',
    footer_col_info: 'المعلومات',
    footer_nl_ph:    'بريدك الإلكتروني',
    footer_nl_btn:   'اشتراك',
    footer_copy:     '© 2025 نزهة كونسيبت. جميع الحقوق محفوظة.',
    footer_ar:       'خياطة تحكي تاريخًا',

    /* Page Femme */
    sidebar_all:     'الكل',
    sidebar_caftan:  'قفطان',
    sidebar_guend:   'قندورة',
    sidebar_djell:   'جلابة',
    sidebar_selham:  'سلهام',
    sidebar_access:  'الإكسسوارات',

    /* Produit */
    prod_couleur:    'اللون',
    prod_taille:     'المقاس',
    prod_perso:      'أريد تخصيص هذه القطعة',
    prod_broderie:   'التطريز',
    prod_fil:        'لون الخيط',
    prod_doublure:   'البطانة',
    prod_details:    'التفاصيل',
    prod_matieres:   'المواد',
    prod_entretien:  'العناية',
    prod_livraison:  'التوصيل',
    prod_wa:         'الطلب عبر واتساب',
    prod_ajouter:    'إضافة إلى طلبيتي',
    prod_similaires: 'قد يعجبك أيضاً',
    prod_style:      'تُرتدى هذه القطعة مع',

    /* WhatsApp messages */
    wa_inquiry: (items) => {
      const list = items.map((it, i) => `${i+1}. ${it.nom} — ${it.couleur} — ${it.taille}`).join('\n');
      return `السلام عليكم، أتمنى أن تكونوا بخير 🌹\nهل يمكنني الاستفسار عن هذه المنتجات من فضلكم :\n\n${list}`;
    },

    wa_product: (nom, couleur, taille, perso) =>
      `السلام عليكم، أتمنى أن تكونوا بخير 🌹\nهل يمكنني الاستفسار عن هذا المنتج من فضلكم :\n*${nom}*\n- اللون: ${couleur}\n- المقاس: ${taille}${perso ? `\n- التخصيص: ${perso}` : ''}`,

    wa_commande: (items, total) => {
      const lines = items.map((it, i) =>
        `${i+1}. ${it.nom} — ${it.couleur} — ${it.taille} — ${it.prix.toLocaleString('ar-MA')} درهم`
      ).join('\n');
      return `السلام عليكم، أتمنى أن تكونوا بخير 🌹\nهل يمكنني الاستفسار عن هذه المنتجات من فضلكم :\n\n${lines}\n\n*المجموع التقديري: ${total.toLocaleString('ar-MA')} درهم*`;
    },

    wa_mesures: (p, t, h) =>
      `مرحباً! إليك قياساتي:\n- الصدر: ${p} سم\n- الخصر: ${t} سم\n- الأرداف: ${h} سم\n\nأرغب في الطلب على المقاس. شكراً! 🌹`,

    wa_newsletter: (email) =>
      `مرحباً! أرغب في الاشتراك في نشرتكم الإخبارية.\nبريدي: ${email}\nشكراً! 🌹`,

    /* Mesures */
    mes_intro:       'كل قامة فريدة. إليك كيف نلتقطها.',
    mes_title:       'دليل المقاسات',
    mes_label:       'على المقاس',
    calc_title:      'ابحث عن مقاسك',
    calc_p:          'الصدر (سم)',
    calc_t:          'الخصر (سم)',
    calc_h:          'الأرداف (سم)',
    calc_result:     'مقاسك الموصى به',
    calc_wa:         'إرسال قياساتي عبر واتساب',

    /* Ma Commande */
    cart_title:      'طلبيتي',
    cart_empty:      'طلبيتك فارغة في الوقت الحالي.',
    cart_browse:     'تصفح المجموعات',
    cart_wa:         'إرسال طلبيتي عبر واتساب',
    cart_total:      'المجموع التقديري',
    cart_pieces:     'قطعة',

    /* Nouveautés page */
    nou_countdown:   'المجموعة القادمة',
    nou_notif:       'كن أول من يعلم',
    nou_title:       'الجديد',
    nou_label:       'أحدث الوافدات',
  }
};

/* Langue courante */
let currentLang = localStorage.getItem('nozha_lang') || 'fr';

/* Applique toutes les traductions du DOM */
function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('nozha_lang', lang);

  const t = translations[lang];
  if (!t) return;

  /* Éléments avec data-i18n */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] && typeof t[key] === 'string') {
      el.textContent = t[key];
    }
  });

  /* Placeholders */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key]) el.placeholder = t[key];
  });

  /* Direction RTL */
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else {
    document.documentElement.removeAttribute('dir');
    document.body.classList.remove('rtl');
  }

  /* Boutons langue actif */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/* Init au chargement */
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
});

/* Export */
window.NozhaI18n = { translations, applyTranslations, currentLang: () => currentLang };



