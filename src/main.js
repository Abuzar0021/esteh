import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;
const isMobile = window.matchMedia("(max-width: 720px)").matches;

/* ------------------------------------------------------------ smooth scroll */
let lenis = null;
if (!prefersReducedMotion) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------ loader + hero intro */
const loader = document.getElementById("loader");
const heroWord = document.getElementById("heroWord");

function playHeroIntro() {
  const chars = heroWord.querySelectorAll(".split-char");
  if (prefersReducedMotion) {
    gsap.set(chars, { clearProps: "all" });
    gsap.set(".reveal-up", { opacity: 1, y: 0 });
    return;
  }
  gsap.to(chars, {
    y: "0%",
    duration: 1,
    ease: "power4.out",
    stagger: 0.045,
    delay: 0.15,
  });
  gsap.to(".hero .reveal-up", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.1,
    delay: 0.5,
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) loader.classList.add("is-hidden");
    playHeroIntro();
  }, prefersReducedMotion ? 0 : 500);
});

/* ------------------------------------------------------------ scroll reveals */
const revealEls = Array.from(document.querySelectorAll(".reveal-up")).filter(
  (el) => !el.closest(".hero"),
);
revealEls.forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true,
    },
  });
});

const storyMedia = document.querySelector(".story__media");
if (storyMedia) {
  gsap.fromTo(
    storyMedia,
    { opacity: 0, scale: 0.92 },
    {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: storyMedia, start: "top 85%", once: true },
    },
  );
}

/* ------------------------------------------------------------ menu card stagger-in */
const menuCards = gsap.utils.toArray(".menu-card");
if (menuCards.length) {
  gsap.set(menuCards, { autoAlpha: 0, y: 60, rotateX: 8 });
  ScrollTrigger.create({
    trigger: "#menuGrid",
    start: "top 82%",
    once: true,
    onEnter: () =>
      gsap.to(menuCards, {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }),
  });
}

/* ------------------------------------------------------------ hero parallax */
if (!prefersReducedMotion) {
  gsap.to("#heroImg", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* ------------------------------------------------------------ marquee loop */
const marqueeTrack = document.getElementById("marqueeTrack");
if (marqueeTrack && !prefersReducedMotion) {
  marqueeTrack.insertAdjacentHTML("beforeend", marqueeTrack.innerHTML);
  gsap.to(marqueeTrack, {
    xPercent: -50,
    duration: 22,
    ease: "none",
    repeat: -1,
  });
}

/* ------------------------------------------------------------ count-up milestones */
const milestoneEls = document.querySelectorAll(".milestone__num");
milestoneEls.forEach((el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    once: true,
    onEnter: () => {
      const counter = { val: el.textContent === el.dataset.count ? 0 : 0 };
      gsap.to(counter, {
        val: target,
        duration: prefersReducedMotion ? 0 : 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.val) + suffix;
        },
      });
    },
  });
});

/* ------------------------------------------------------------ film scroll section */
const filmVideo = document.getElementById("filmVideo");
const filmSection = document.getElementById("film");
if (filmVideo) {
  filmVideo.addEventListener("error", () => filmSection.classList.add("film--fallback"));
}
if (filmVideo && filmSection && !prefersReducedMotion) {
  ScrollTrigger.create({
    trigger: filmSection,
    start: "top 70%",
    end: "bottom 20%",
    onEnter: () => filmVideo.play().catch(() => {}),
    onEnterBack: () => filmVideo.play().catch(() => {}),
    onLeave: () => filmVideo.pause(),
    onLeaveBack: () => filmVideo.pause(),
  });
}

/* ------------------------------------------------------------ nav + mobile menu */
const navBurger = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");
if (navBurger && mobileMenu) {
  navBurger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    navBurger.setAttribute("aria-expanded", String(isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      navBurger.setAttribute("aria-expanded", "false");
    }),
  );
}

/* ------------------------------------------------------------ custom cursor */
const cursor = document.getElementById("cursor");
if (cursor && isFinePointer && !isMobile) {
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...pos };

  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("a, button, [data-tilt]").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });
} else if (cursor) {
  cursor.remove();
}

/* ------------------------------------------------------------ tilt-on-hover menu cards */
if (isFinePointer && !isMobile) {
  menuCards.forEach((card) => {
    const inner = card.querySelector(".menu-card__inner");
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: px * 14,
        rotateX: -py * 14,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });
      gsap.to(inner, { z: 30, duration: 0.4 });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
    });
  });
}

/* ------------------------------------------------------------ magnetic button */
const magneticBtn = document.getElementById("magneticBtn");
if (magneticBtn && isFinePointer && !isMobile) {
  const radius = 90;
  magneticBtn.addEventListener("mousemove", (e) => {
    const rect = magneticBtn.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(relX, relY);
    if (dist < radius) {
      gsap.to(magneticBtn, { x: relX * 0.35, y: relY * 0.35, duration: 0.3, ease: "power2.out" });
    }
  });
  magneticBtn.addEventListener("mouseleave", () => {
    gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" });
  });
}

/* ------------------------------------------------------------ resize housekeeping */
window.addEventListener("resize", () => ScrollTrigger.refresh());
