/* =============================================
   COMO NOVO – Higienização Profissional
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR: sombra ao rolar ───────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // ─── HAMBURGER MENU (mobile) ───────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Fechar menu ao clicar em link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  // ─── INTERSECTION OBSERVER: animação dos cards de serviço ─────────────────
  const servicoCards = document.querySelectorAll('.servico-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  servicoCards.forEach(card => observer.observe(card));

  // ─── SLIDER DE DEPOIMENTOS ─────────────────────────────────────────────────
  const track    = document.getElementById('depoTrack');
  const dotsWrap = document.getElementById('depoDots');
  const btnBack  = document.getElementById('depoBack');
  const btnNext  = document.getElementById('depoNext');

  const cards  = track.querySelectorAll('.depo-card');
  let current  = 0;
  let autoTimer;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'depo-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.depo-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  btnBack.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  });

  startAuto();

  // ─── FORMULÁRIO → WHATSAPP ────────────────────────────────────────────────
  const form    = document.getElementById('contatoForm');
  const success = document.getElementById('formSuccess');

  // Máscara de telefone (formato português: +351 9XX XXX XXX)
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '');
      if (v.length > 9) v = v.slice(0, 9);
      v = v.replace(/^(\d{2})(\d{3})(\d{0,4})$/, '$1 $2 $3').trim();
      telInput.value = v;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome     = document.getElementById('nome').value.trim();
    const tel      = document.getElementById('telefone').value.trim();
    const servico  = document.getElementById('servico').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    // Validação
    if (!nome || !tel) {
      [document.getElementById('nome'), document.getElementById('telefone')].forEach(el => {
        if (!el.value.trim()) {
          el.style.borderColor = '#e53935';
          el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    // ── Construir mensagem para o WhatsApp ───────────────────────────────────
    const servicoTexto = servico || 'higienização profissional';

    let texto = `Olá! 👋\n\nO meu nome é *${nome}* e tenho interesse em realizar uma *${servicoTexto}*.\n`;

    if (mensagem) {
      texto += `\n📝 *Mensagem:*\n${mensagem}\n`;
    }

    texto += `\n📞 *Contacto:* ${tel}`;

    // ── Número do WhatsApp (só dígitos, com indicativo do país) ─────────────
    // Substitui pelo número real da empresa
    const NUMERO_WA = '351910281651';

    const url = `https://wa.me/${NUMERO_WA}?text=${encodeURIComponent(texto)}`;

    // Feedback visual antes de abrir
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'A abrir WhatsApp...';
    btn.disabled = true;

    setTimeout(() => {
      window.open(url, '_blank');
      form.reset();
      btn.textContent = 'Enviar Solicitação ✦';
      btn.disabled = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 800);
  });

  // ─── SMOOTH ANCHOR + OFFSET NAVBAR ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── ACTIVE NAV LINK ao rolar ──────────────────────────────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let active = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) active = sec.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${active}` ? 'var(--verde)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

});