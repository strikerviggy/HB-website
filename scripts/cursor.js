/* ==========================================================
   Happy Bells — Cursor Parallax Engine
   Implements smooth linear interpolation (lerp) parallax motion
   reacting to mouse movements across glass panels and hero layers.
   ========================================================== */

(function () {
  'use strict';

  // Target coordinates vs Current interpolated coordinates
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Interpolation factor (0.05 = soft, smooth easing)
  const lerpFactor = 0.05;

  // Track window dimensions
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  });

  // Capture cursor position normalized around screen center (-1 to 1)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Animation Loop
  function renderParallax() {
    // Lerp algorithm: current = current + (target - current) * factor
    pos.x += (mouse.x - pos.x) * lerpFactor;
    pos.y += (mouse.y - pos.y) * lerpFactor;

    // Center offsets (-0.5 to 0.5)
    const offsetX = (pos.x / windowWidth) - 0.5;
    const offsetY = (pos.y / windowHeight) - 0.5;

    // 1. Shift Ambient Blobs gently
    const blobs = document.querySelectorAll('.ambient-blob');
    blobs.forEach((blob, index) => {
      const depth = (index + 1) * 25;
      const moveX = offsetX * depth;
      const moveY = offsetY * depth;
      blob.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    // 2. Dangling Bells subtle shift
    const danglingBells = document.querySelector('.dangling-bells-container');
    if (danglingBells) {
      const bellX = offsetX * -18;
      const bellY = offsetY * -8;
      danglingBells.style.transform = `translate3d(calc(-50% + ${bellX}px), ${bellY}px, 0)`;
    }

    // 3. Hero Photo Card subtle 3D tilt & shift
    const heroCard = document.querySelector('.photo-tear-card');
    if (heroCard) {
      const tiltX = offsetY * -12; // tilt around X axis
      const tiltY = offsetX * 12;  // tilt around Y axis
      const transX = offsetX * 15;
      const transY = offsetY * 15;
      heroCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${transX}px, ${transY}px, 0)`;
    }

    // 4. Parallax Glass Cards on hover/mousemove
    const glassCards = document.querySelectorAll('.parallax-card');
    glassCards.forEach((card) => {
      const cardX = offsetX * 10;
      const cardY = offsetY * 10;
      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0)`;
    });

    // 5. Left-Right Horizontal Pan for Wide Cover Photo (reveals both client photo frames)
    const coverPhoto = document.querySelector('.cover-photo');
    if (coverPhoto) {
      const panX = (offsetX + 0.5) * -16.5;
      coverPhoto.style.transform = `translateX(${panX}%) scale(1.02)`;
    }

    requestAnimationFrame(renderParallax);
  }

  // Kickoff animation loop on load
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(renderParallax);
  });
})();
