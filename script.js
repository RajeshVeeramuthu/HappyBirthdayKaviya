/* ==========================================================
   FOR MY LOVE — interaction and motion
   Vanilla JavaScript only. Respects reduced-motion settings.
   ========================================================== */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const letterText =
    "On your birthday, I wish I could wrap up every beautiful feeling you bring into my life and give it to you as a gift. You make ordinary moments feel special, and your presence brings a kind of warmth I can never quite explain.\nI hope this year is gentle with your heart, generous with your dreams, and full of reasons to smile. I hope you always remember how deeply you are appreciated, how wonderfully you are you, and how deserving you are of every good thing.\nThank you for being part of my story. If I had to choose all over again, I'd still be so happy that our paths found each other. Today, tomorrow, and in all the little moments in between — I'm cheering for you. Happy birthday, my love. ♡";
  const typeTarget = document.getElementById("typewriter-copy");
  const typeCursor = document.getElementById("type-cursor");
  let typingStarted = false;

  // Mobile navigation
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }),
  );

  // Scroll reveals and typewriter only when the letter enters view.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("letter-card")) startTypewriter();
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  function startTypewriter() {
    if (typingStarted) return;
    typingStarted = true;
    if (reducedMotion) {
      typeTarget.textContent = letterText;
      typeCursor.hidden = true;
      return;
    }
    let index = 0;
    const type = () => {
      if (index >= letterText.length) {
        typeCursor.hidden = true;
        return;
      }
      // Preserve paragraph breaks in the string and type at a human pace.
      typeTarget.textContent += letterText[index++];
      setTimeout(
        type,
        letterText[index - 1] === "."
          ? 260
          : letterText[index - 1] === ","
            ? 150
            : 23,
      );
    };
    type();
  }

  // Open each memory photo in a larger preview.
  const lightbox = document.getElementById("lightbox");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCopy = document.getElementById("lightbox-copy");
  const lightboxArt = document.getElementById("lightbox-art");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  document.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("click", () => {
      lightboxTitle.textContent = card.dataset.title;
      lightboxCopy.textContent = card.dataset.copy;
      const source = card.querySelector(".memory-image");
      const image = source.querySelector(".memory-photo");
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxArt.classList.add("has-image");
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      document.getElementById("lightbox-close").focus();
    });
  });
  document
    .getElementById("lightbox-close")
    .addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Interactive flip cards; button semantics make these keyboard accessible.
  document.querySelectorAll(".reason-card").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
    card.setAttribute("aria-pressed", "false");
  });

  // Surprise modal
  const modal = document.getElementById("surprise-modal");
  const openModal = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 36);
    document.getElementById("modal-close").focus();
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.getElementById("surprise-button").focus();
  };
  document
    .getElementById("surprise-button")
    .addEventListener("click", openModal);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-done").addEventListener("click", closeModal);
  modal
    .querySelector("[data-close-modal]")
    .addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.classList.contains("open")) closeModal();
      if (lightbox.classList.contains("open")) closeLightbox();
    }
  });

  // Candle, confetti and fireworks
  const cakeStage = document.querySelector(".cake-stage");
  const blowButton = document.getElementById("blow-button");
  const wishMessage = document.getElementById("wish-message");
  let candleBlown = false;
  let relightTimer = null;
  const resetCandle = () => {
    cakeStage.classList.remove("blown");
    candleBlown = false;
    relightTimer = null;
    blowButton.innerHTML = 'Blow the candle <span aria-hidden="true">✦</span>';
    wishMessage.textContent = "Make your wish before you blow it out…";
  };
  blowButton.addEventListener("click", () => {
    if (candleBlown) {
      window.clearTimeout(relightTimer);
      resetCandle();
      return;
    }
    candleBlown = true;
    cakeStage.classList.add("blown");
    blowButton.innerHTML = 'Light it again <span aria-hidden="true">↻</span>';
    wishMessage.textContent =
      "Wish sent to the universe. May the sweetest things find you. ♡";
    const rect = cakeStage.getBoundingClientRect();
    burstConfetti(
      rect.left + rect.width / 2,
      rect.top + rect.height * 0.42,
      130,
    );
    launchFireworks(rect.left + rect.width / 2, rect.top + rect.height * 0.35);
    relightTimer = window.setTimeout(resetCandle, 5000);
  });

  // Canvas particles: one animation loop, device-pixel ratio capped for performance.
  const canvas = document.getElementById("effects-canvas");
  const ctx = canvas.getContext("2d");
  let width = 0,
    height = 0,
    particles = [],
    raf = null;
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas();

  function addParticles(x, y, count, type) {
    if (reducedMotion) return;
    const cap = 550;
    for (let i = 0; i < count && particles.length < cap; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed =
        type === "firework" ? 1.5 + Math.random() * 4.2 : 2 + Math.random() * 6;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === "confetti" ? 2 : 0),
        life: 50 + Math.random() * 55,
        maxLife: 105,
        size: 2 + Math.random() * 4,
        color: ["#ff4d8d", "#ffd700", "#c084fc", "#fff2f8", "#ff8ab8"][
          Math.floor(Math.random() * 5)
        ],
        type,
        rotation: Math.random() * 6,
        spin: (Math.random() - 0.5) * 0.2,
      });
    }
    if (!raf) raf = requestAnimationFrame(drawParticles);
  }
  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.type === "confetti" ? 0.055 : 0.018;
      p.vx *= 0.992;
      p.life--;
      p.rotation += p.spin;
      ctx.globalAlpha = Math.min(1, p.life / 25);
      ctx.fillStyle = p.color;
      if (p.type === "confetti") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
        ctx.restore();
      } else if (p.type === "heart") {
        ctx.font = `${p.size * 4}px serif`;
        ctx.fillText("♥", p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          p.size * Math.max(0, Math.min(1, p.life / 18)),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (particles.length) raf = requestAnimationFrame(drawParticles);
    else {
      cancelAnimationFrame(raf);
      raf = null;
      ctx.clearRect(0, 0, width, height);
    }
  }
  function burstConfetti(x, y, count) {
    addParticles(x, y, count, "confetti");
  }
  function burstHearts(x, y, count) {
    addParticles(x, y, count, "heart");
  }
  function launchFireworks(x, y) {
    addParticles(x, y, 80, "firework");
    setTimeout(() => addParticles(x - 95, y - 70, 65, "firework"), 240);
    setTimeout(() => addParticles(x + 105, y - 35, 65, "firework"), 480);
  }

  // Count both calendar time and the full elapsed duration from the first message.
  const loveStart = new Date(2025, 1, 22, 23, 27, 0);
  const loveTimeElements = {
    years: document.getElementById("love-years"),
    days: document.getElementById("love-days"),
    hours: document.getElementById("love-hours"),
    minutes: document.getElementById("love-minutes"),
    seconds: document.getElementById("love-seconds"),
    totalDays: document.getElementById("total-days"),
    totalHours: document.getElementById("total-hours"),
    totalMinutes: document.getElementById("total-minutes"),
    totalSeconds: document.getElementById("total-seconds"),
  };
  function updateLoveTime() {
    const now = new Date();
    const elapsedSeconds = Math.max(0, Math.floor((now - loveStart) / 1000));
    let years = now.getFullYear() - loveStart.getFullYear();
    const anniversary = new Date(
      now.getFullYear(),
      loveStart.getMonth(),
      loveStart.getDate(),
      loveStart.getHours(),
      loveStart.getMinutes(),
      loveStart.getSeconds(),
    );
    if (anniversary > now) years--;

    const calendarRemainder = Math.max(
      0,
      Math.floor((now - new Date(
        loveStart.getFullYear() + years,
        loveStart.getMonth(),
        loveStart.getDate(),
        loveStart.getHours(),
        loveStart.getMinutes(),
        loveStart.getSeconds(),
      )) / 1000),
    );
    const calendarDays = Math.floor(calendarRemainder / 86400);
    const calendarHours = Math.floor((calendarRemainder % 86400) / 3600);
    const calendarMinutes = Math.floor((calendarRemainder % 3600) / 60);
    const totalDays = Math.floor(elapsedSeconds / 86400);

    loveTimeElements.years.textContent = years;
    loveTimeElements.days.textContent = calendarDays;
    loveTimeElements.hours.textContent = calendarHours;
    loveTimeElements.minutes.textContent = calendarMinutes;
    loveTimeElements.seconds.textContent = elapsedSeconds % 60;
    loveTimeElements.totalDays.textContent = totalDays;
    loveTimeElements.totalHours.textContent = Math.floor(
      (elapsedSeconds % 86400) / 3600,
    );
    loveTimeElements.totalMinutes.textContent = Math.floor(
      (elapsedSeconds % 3600) / 60,
    );
    loveTimeElements.totalSeconds.textContent = elapsedSeconds % 60;
  }
  updateLoveTime();
  window.setInterval(updateLoveTime, 1000);

  // Gentle decorative falling petals. Reduced-motion users get a static scene.
  const petalLayer = document.getElementById("petal-layer");
  if (!reducedMotion) {
    const symbols = ["✧", "♡", "✿", "·"];
    for (let i = 0; i < 18; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = Math.random() * 100 + "%";
      petal.style.fontSize = 8 + Math.random() * 13 + "px";
      petal.style.animationDuration = 14 + Math.random() * 20 + "s";
      petal.style.animationDelay = -Math.random() * 25 + "s";
      petal.style.setProperty("--drift", Math.random() * 180 - 90 + "px");
      petalLayer.appendChild(petal);
    }
  }

  // Footer year.
  document.getElementById("year").textContent = new Date().getFullYear();
})();
