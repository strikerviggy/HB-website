/* ==========================================================
   Happy Bells — Motion, Gyroscope & Floating Heart Trail Engine
   Implements mouse lerp parallax, mobile Gyroscope tilt / touch
   horizontal panning, and soft floating mouse heart trail particles.
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

  // Gyroscope Mobile Orientation Pan Target
  let gyroPanX = null;
  let isMobileDevice = false;

  // Floating Heart Particle System
  let lastHeartTime = 0;
  const heartEmojis = ['💖', '💕', '✨', '🌸', '💖'];

  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  });

  // Desktop Mouse Movement + Soft Floating Heart Generator
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const now = Date.now();
    if (now - lastHeartTime > 55) { // Spawn heart particle every ~55ms while moving
      lastHeartTime = now;
      createCursorHeart(e.clientX, e.clientY);
    }
  });

  // Touch Movement Heart Trail on Mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const now = Date.now();
      if (now - lastHeartTime > 70) {
        lastHeartTime = now;
        createCursorHeart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }
  }, { passive: true });

  function createCursorHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'cursor-heart-particle';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    // Slight random position & angle offset for natural floating drift
    const offsetX = (Math.random() - 0.5) * 22;
    const offsetY = (Math.random() - 0.5) * 12;
    const randomScale = Math.random() * 0.45 + 0.65;
    const randomRot = (Math.random() - 0.5) * 45;

    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y + offsetY}px`;
    heart.style.transform = `scale(${randomScale}) rotate(${randomRot}deg)`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 850);
  }

  // Mobile Gyroscope Device Orientation Event Listener
  function handleOrientation(e) {
    if (e.gamma !== null && e.gamma !== undefined) {
      isMobileDevice = true;
      const clampedGamma = Math.max(-25, Math.min(25, e.gamma));
      const normGamma = (clampedGamma + 25) / 50;
      gyroPanX = normGamma * -18;
    }
  }

  // Register Gyroscope Event
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      window.addEventListener('touchstart', () => {
        DeviceOrientationEvent.requestPermission()
          .then(res => {
            if (res === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
          })
          .catch(() => {});
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }

  // Mobile Touch Horizontal Swipe Pan Fallback
  document.addEventListener('DOMContentLoaded', () => {
    const photoFrameWrapper = document.querySelector('.photo-frame-wrapper');
    let touchStartX = 0;
    let currentTouchPan = -9;

    if (photoFrameWrapper) {
      photoFrameWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      photoFrameWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const deltaX = e.touches[0].clientX - touchStartX;
          currentTouchPan = Math.max(-18, Math.min(0, currentTouchPan + (deltaX * 0.08)));
          touchStartX = e.touches[0].clientX;
          gyroPanX = currentTouchPan;
        }
      }, { passive: true });
    }
  });

  // Parallax Animation Loop
  function renderParallax() {
    pos.x += (mouse.x - pos.x) * lerpFactor;
    pos.y += (mouse.y - pos.y) * lerpFactor;

    const offsetX = (pos.x / windowWidth) - 0.5;
    const offsetY = (pos.y / windowHeight) - 0.5;

    // 1. Shift Ambient Blobs gently
    const blobs = document.querySelectorAll('.ambient-blob');
    blobs.forEach((blob, index) => {
      const depth = (index + 1) * 20;
      const moveX = offsetX * depth;
      const moveY = offsetY * depth;
      blob.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    // 2. Dangling Bells subtle shift
    const danglingBells = document.querySelector('.dangling-bells-container');
    if (danglingBells) {
      const bellX = offsetX * -14;
      const bellY = offsetY * -6;
      danglingBells.style.transform = `translate3d(calc(-50% + ${bellX}px), ${bellY}px, 0)`;
    }

    // 3. Hero Photo Card subtle 3D tilt & shift
    const heroCard = document.querySelector('.photo-frame-card');
    if (heroCard) {
      const tiltX = offsetY * -8;
      const tiltY = offsetX * 8;
      const transX = offsetX * 10;
      const transY = offsetY * 10;
      heroCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${transX}px, ${transY}px, 0)`;
    }

    // 4. Parallax Glass Cards on hover/mousemove
    const glassCards = document.querySelectorAll('.parallax-card');
    glassCards.forEach((card) => {
      const cardX = offsetX * 8;
      const cardY = offsetY * 8;
      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0)`;
    });

    // 5. Left-Right Horizontal Pan for Wide Cover Photo
    const coverPhoto = document.querySelector('.cover-photo');
    if (coverPhoto) {
      let finalPanX;
      if (gyroPanX !== null) {
        finalPanX = gyroPanX;
      } else {
        finalPanX = (offsetX + 0.5) * -18;
      }
      coverPhoto.style.transform = `translateX(${finalPanX}%) scale(1.02)`;
    }

    requestAnimationFrame(renderParallax);
  }

  // Kickoff animation loop on load
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(renderParallax);
  });
})();
