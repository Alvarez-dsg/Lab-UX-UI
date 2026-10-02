/* PyCon Colombia 2028 — interacciones de la interfaz */
(() => {
    /* ---------------- Traducciones (ES está en el HTML) ---------------- */
    const EN = {
        'skip': 'Skip to content', 'menu': 'Menu',
        'nav.about': 'About', 'nav.keynotes': 'Keynotes', 'nav.schedule': 'Schedule', 'nav.cfp': 'Talks',
        'nav.tickets': 'Tickets', 'nav.sponsors': 'Sponsors', 'nav.venue': 'Venue', 'nav.faq': 'FAQ',
        'cta.buy': 'Buy ticket', 'cta.tickets': 'Get your ticket', 'cta.cfp': 'Submit a talk',
        'hero.eyebrow': 'Eleventh edition · Amazon Edition',
        'hero.lead': 'Colombia\'s largest Python conference. Three days of talks, keynotes, workshops and community, growing together like the rainforest.',
        'hero.date': 'July 21 – 23, 2028',
        'cd.days': 'days', 'cd.hours': 'hours', 'cd.mins': 'min', 'cd.secs': 'sec', 'scroll': 'Explore the jungle',
        'about.kicker': 'About the conference', 'about.title': 'A community that grows like the rainforest',
        'about.p1': 'PyCon Colombia is a non-profit conference organized by volunteers from the Python community and other technology leaders in the country. Every year we bring together developers, data scientists, students, teachers and curious minds to learn, share and connect.',
        'about.p2': 'In 2028 we celebrate our eleventh edition inspired by the Amazon: a diverse, interconnected ecosystem full of life, just like our community.',
        'stats.people': '+ attendees', 'stats.talks': 'talks', 'stats.keynotes': 'international keynotes',
        'stats.workshops': '+ workshops', 'stats.days': 'days', 'stats.edition': 'th edition',
        'incl.title': 'Your ticket includes',
        'incl.talks.t': 'Talks', 'incl.talks.d': 'Full access to ~30 talks in Spanish and English.',
        'incl.keynotes.t': 'Keynotes', 'incl.keynotes.d': '5 keynotes by invited international speakers.',
        'incl.workshops.t': 'Workshops', 'incl.workshops.d': '15+ hands-on workshops on day one.',
        'incl.food.t': 'Meals', 'incl.food.d': 'Lunch, morning and afternoon snacks all 3 days.',
        'kn.kicker': 'Voices of the jungle', 'kn.lead': 'Five leading voices from the global Python ecosystem. We will reveal them very soon.',
        'kn.tba': 'To be announced', 'kn.role1': 'CPython core developer', 'kn.role2': 'Data science & AI',
        'kn.role3': 'PSF Fellow', 'kn.role4': 'Open science', 'kn.role5': 'Latin American community',
        'sch.kicker': 'Program', 'sch.title': 'Schedule',
        'sch.lead': 'Tentative schedule. The final program will be published once the call for proposals closes.',
        'sch.d1': 'Friday 21', 'sch.d1s': 'Workshops', 'sch.d2': 'Saturday 22', 'sch.d2s': 'Talks',
        'sch.d3': 'Sunday 23', 'sch.d3s': 'Talks & sprints',
        'ev.reg': 'Registration & welcome', 'ev.open': 'Opening + Keynote', 'ev.ws1': 'Workshops block A',
        'ev.ws1d': 'Python from scratch · Data science with pandas · Django', 'ev.lunch': 'Lunch',
        'ev.ws2': 'Workshops block B', 'ev.ws2d': 'FastAPI · MicroPython & hardware · ML with scikit-learn',
        'ev.snack': 'Snack break', 'ev.ws3': 'Workshops block C', 'ev.ws3d': 'Contributing to open source · Testing with pytest',
        'ev.talks': 'Talks in 3 rooms', 'ev.tracks': 'Web · Data & AI · Community', 'ev.lt': '5 minutes, any topic, lots of energy',
        'ev.social': 'Community party', 'ev.sprints': 'Contribute to open source projects with their maintainers',
        'ev.closing': 'Closing keynote', 'ev.photo': 'Group photo & farewell',
        'cfp.kicker': 'Call for proposals open', 'cfp.title': 'Share what you know',
        'cfp.p': 'We are looking for talks (30 min), workshops (2 h) and lightning talks about web, data, AI, education, science, hardware, community and everything Python makes possible. If you have never given a talk, our mentors will help you.',
        'cfp.btn': 'Submit proposal', 'cfp.mentor': 'I want a mentor',
        'dl.open': 'Call for proposals opens', 'dl.close': 'Proposals deadline', 'dl.notify': 'Speaker notification', 'dl.grants': 'Financial aid deadline',
        'tk.kicker': 'Join the pack', 'tk.title': 'Tickets',
        'tk.lead': 'Prices in Colombian pesos. All tickets include the 3 days, meals and welcome kit.',
        'tk.student': 'Student', 'tk.general': 'General', 'tk.corp': 'Corporate', 'tk.grant': 'Financial aid',
        'tk.all': 'Access to all 3 days', 'tk.food': 'Meals included', 'tk.studentReq': 'Valid student ID required',
        'tk.kit': 'Kit & official t-shirt', 'tk.invoice': 'Electronic invoice', 'tk.support': 'You support the community',
        'tk.popular': 'Most popular', 'tk.buy': 'Buy', 'tk.free': 'Free',
        'tk.grant1': 'For those who cannot afford it', 'tk.grant2': 'Travel & lodging support', 'tk.grant3': 'Priority for underrepresented groups',
        'tk.apply': 'Apply',
        'sp.kicker': 'The people who make PyCon CO possible', 'sp.title': 'Sponsors',
        'sp.t1': 'Jaguar · Diamond', 'sp.t2': 'Toucan · Gold', 'sp.t3': 'Butterfly · Silver', 'sp.t4': 'Community partners',
        'sp.slot': 'Your logo here', 'sp.cta': 'Does your company want to reach the largest Python community in the country?',
        'sp.btn': 'Download the prospectus',
        'vn.kicker': 'The venue',
        'vn.p': 'Carrera 49 #7 Sur-50, Medellín, Antioquia. A green campus with more than 500 plant species and urban wildlife: the perfect home for our Amazon edition.',
        'vn.metro': 'Metro: Aguacatala station (line A), 10 min walk', 'vn.air': 'José María Córdova airport (MDE) 50 min away',
        'vn.hotel': 'Special rates at partner hotels', 'vn.map': 'Get directions',
        'coc.title': 'Code of conduct',
        'coc.p': 'PyCon Colombia is a safe, diverse and inclusive space. Access and participation are subject to compliance with the Code of Conduct by everyone: attendees, speakers, sponsors and volunteers.',
        'coc.btn': 'Read the code',
        'vol.title': 'Volunteer', 'vol.p': 'PyCon CO exists thanks to dozens of volunteers. Help us with logistics, registration, social media, design or supporting speakers, and live the conference from the inside.',
        'vol.btn': 'I want to help',
        'faq.kicker': 'Questions?', 'faq.title': 'Frequently asked questions',
        'faq.q1': 'Do I need to know Python to attend?', 'faq.a1': 'Not at all! There are beginner workshops and talks for every level. All you need is curiosity.',
        'faq.q2': 'What language are the talks in?', 'faq.a2': 'Most are in Spanish. Some keynotes and talks will be in English, and the schedule will say so.',
        'faq.q3': 'Can I transfer or refund my ticket?', 'faq.a3': 'You can transfer it to someone else up to 7 days before the event by writing to us. Refunds apply up to 30 days before.',
        'faq.q4': 'Are the talks recorded?', 'faq.a4': 'Yes. Main room talks are published on our YouTube channel a few weeks after the event.',
        'faq.q5': 'Is the venue accessible?', 'faq.a5': 'Yes, the campus has ramps and elevators. If you need any particular support, write to us and we will arrange it.',
        'faq.q6': 'Is there childcare?', 'faq.a6': 'We are working on a childcare space. Let us know in your registration so we can count you in.',
        'nl.title': 'Don\'t miss a thing', 'nl.p': 'Get news about keynotes, schedule and tickets.', 'nl.btn': 'Subscribe',
        'nl.ok': 'Done! We will write to you soon 🌿', 'nl.err': 'Please enter a valid email.',
        'ft.about': 'Non-profit conference organized by the Python community of Colombia.',
        'ft.past': 'Past editions', 'ft.links': 'Links', 'ft.follow': 'Follow us', 'ft.made': 'Made with 🐍 and 🌿 by volunteers'
    };
    const ES_EXTRA = { 'nl.ok': '¡Listo! Pronto te escribiremos 🌿', 'nl.err': 'Escribe un email válido.' };

    const i18nEls = [...document.querySelectorAll('[data-i18n]')];
    i18nEls.forEach((el) => { el.dataset.es = el.innerHTML; });
    let lang = 'es';
    const t = (key) => (lang === 'en' ? EN[key] : ES_EXTRA[key]) || key;

    function setLang(next) {
        lang = next;
        document.documentElement.lang = next;
        i18nEls.forEach((el) => {
            const key = el.dataset.i18n;
            el.innerHTML = next === 'en' && EN[key] ? EN[key] : el.dataset.es;
        });
        document.querySelectorAll('.lang-toggle [data-lang]').forEach((s) => s.classList.toggle('is-active', s.dataset.lang === next));
        try { localStorage.setItem('pycon-lang', next); } catch (_) { /* almacenamiento no disponible */ }
    }
    document.querySelector('.lang-toggle').addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));
    try { if (localStorage.getItem('pycon-lang') === 'en') setLang('en'); } catch (_) { /* nada */ }

    /* ---------------- Menú móvil ---------------- */
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    const closeNav = () => { header.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
        const open = header.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

    /* ---------------- Cabecera compacta + volver arriba ---------------- */
    const toTop = document.querySelector('.to-top');
    const onScroll = () => {
        header.classList.toggle('is-scrolled', scrollY > 40);
        toTop.classList.toggle('is-visible', scrollY > innerHeight);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------------- Enlace activo según la sección visible ---------------- */
    const links = new Map([...nav.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => a.classList.remove('is-active'));
            links.get(entry.target.id)?.classList.add('is-active');
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

    /* ---------------- Aparición al hacer scroll + contadores ---------------- */
    const counters = document.querySelectorAll('[data-count]');
    const countUp = (el) => {
        const end = +el.dataset.count, start = performance.now(), dur = 1400;
        const step = (now) => {
            const k = Math.min(1, (now - start) / dur);
            el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count]').forEach(countUp);
            reveal.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) counters.forEach((c) => { c.textContent = c.dataset.count; });

    /* ---------------- Pestañas de la agenda (accesibles con teclado) ---------------- */
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const selectTab = (tab) => {
        tabs.forEach((tb) => {
            const on = tb === tab;
            tb.setAttribute('aria-selected', String(on));
            tb.tabIndex = on ? 0 : -1;
            document.getElementById(tb.getAttribute('aria-controls')).hidden = !on;
        });
        tab.focus();
    };
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => selectTab(tab));
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length]);
            if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
        });
    });

    /* ---------------- Cuenta regresiva ---------------- */
    const EVENT = new Date('2028-07-21T07:30:00-05:00').getTime();
    const pad = (n, l = 2) => String(n).padStart(l, '0');
    const cd = ['days', 'hours', 'mins', 'secs'].map((k) => document.getElementById('cd-' + k));
    const tick = () => {
        const diff = Math.max(0, EVENT - Date.now());
        const s = Math.floor(diff / 1000);
        const vals = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
        cd.forEach((el, i) => { el.textContent = i === 0 ? pad(vals[0], 3) : pad(vals[i]); });
    };
    tick();
    setInterval(tick, 1000);

    /* ---------------- FAQ: solo una abierta a la vez ---------------- */
    const faqs = document.querySelectorAll('.faq details');
    faqs.forEach((d) => d.addEventListener('toggle', () => {
        if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
    }));

    /* ---------------- Newsletter ---------------- */
    const form = document.querySelector('.newsletter');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const msg = form.querySelector('.newsletter__msg');
        const ok = input.checkValidity() && input.value.trim() !== '';
        msg.textContent = t(ok ? 'nl.ok' : 'nl.err');
        msg.classList.toggle('is-error', !ok);
        if (ok) form.reset();
    });
})();
