/* ==========================================================
   Happy Bells — Animations, Video Player & Lightbox Engine
   Generates background drifting sakura petals, manages flower bloom SVG
   path dynamics, swinging bell physics, Instagram feed interactions,
   and testimonial video player / image lightbox controls.
   ========================================================== */

(function () {
  'use strict';

  // --- 1. DRIFTING SAKURA PETALS CANVAS ENGINE ---
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 28;
  const petals = [];

  // Sakura Petal Particle Class
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 10 + 8; // Petal size
      this.speedY = Math.random() * 0.8 + 0.4; // Downward fall speed
      this.speedX = Math.random() * 0.5 - 0.25; // Gentle horizontal breeze
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      // Soft blush pink to rose gold gradient hues
      this.color = Math.random() > 0.5 ? '#F6C9CC' : '#D8A895';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.6 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw elegant organic petal shape using cubic bezier curves
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  // Populate Petals Array
  for (let i = 0; i < petalsCount; i++) {
    petals.push(new Petal());
  }

  // Animation Frame Loop for Petals
  function animatePetals() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((petal) => {
      petal.update();
      petal.draw();
    });
    requestAnimationFrame(animatePetals);
  }

  animatePetals();

  // --- 2. INTERACTIVE SWINGING BELLS PHYSICS IMPULSE ---
  document.addEventListener('DOMContentLoaded', () => {
    const bellItems = document.querySelectorAll('.dangling-bell-item');
    bellItems.forEach((bell) => {
      bell.addEventListener('mouseenter', () => {
        // Add temporary extra swing wobble impulse
        bell.style.animationPlayState = 'paused';
        bell.style.transform = 'rotate(18deg) scale(1.15)';
        bell.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(() => {
          bell.style.transform = 'rotate(-14deg) scale(0.95)';
          setTimeout(() => {
            bell.style.transform = '';
            bell.style.transition = '';
            bell.style.animationPlayState = 'running';
          }, 250);
        }, 200);
      });
    });

    // --- 3. INSTAGRAM LIKE BUTTON INTERACTION & MIRROR BLEND SCROLL TRIGGER ---
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isLiked = btn.classList.toggle('liked');
        const countSpan = btn.querySelector('.like-count');
        if (countSpan) {
          let count = parseInt(countSpan.textContent.replace(/,/g, ''), 10) || 120;
          count = isLiked ? count + 1 : count - 1;
          countSpan.textContent = count.toLocaleString();
        }
      });
    });

    // Mirror Blend Scroll Sweep Observer
    const mirrorElements = document.querySelectorAll('.mirror-blend');
    const mirrorObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 });

    mirrorElements.forEach((el) => mirrorObserver.observe(el));

    // --- 4. ADVANCED VIDEO PLAYER ENGINE WITH PLAY, PAUSE, REPLAY & PROGRESS BAR ---
    const videoViewports = document.querySelectorAll('.video-viewport');

    videoViewports.forEach((wrapper) => {
      const vid = wrapper.querySelector('video');
      const iconPlay = wrapper.querySelector('.icon-play');
      const iconReplay = wrapper.querySelector('.icon-replay');
      const playPauseBtn = wrapper.querySelector('.vid-play-pause-btn');
      const replayBtn = wrapper.querySelector('.vid-replay-btn');
      const muteBtn = wrapper.querySelector('.vid-mute-btn');
      const progressBar = wrapper.querySelector('.vid-progress-bar');
      const btnIconPlay = wrapper.querySelector('.btn-icon-play');
      const btnIconPause = wrapper.querySelector('.btn-icon-pause');
      const btnIconMute = wrapper.querySelector('.btn-icon-mute');
      const btnIconUnmute = wrapper.querySelector('.btn-icon-unmute');

      if (!vid) return;

      // Toggle Play / Pause
      function togglePlay(e) {
        if (e) e.stopPropagation();
        if (vid.paused || vid.ended) {
          if (vid.ended) vid.currentTime = 0;
          vid.play();
          wrapper.classList.add('playing');
          wrapper.classList.remove('paused', 'ended');
          if (btnIconPlay) btnIconPlay.style.display = 'none';
          if (btnIconPause) btnIconPause.style.display = 'inline-block';
        } else {
          vid.pause();
          wrapper.classList.remove('playing');
          wrapper.classList.add('paused');
          if (btnIconPlay) btnIconPlay.style.display = 'inline-block';
          if (btnIconPause) btnIconPause.style.display = 'none';
        }
      }

      // Restart / Replay Video
      function replayVideo(e) {
        if (e) e.stopPropagation();
        vid.currentTime = 0;
        vid.play();
        wrapper.classList.add('playing');
        wrapper.classList.remove('paused', 'ended');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconReplay) iconReplay.style.display = 'none';
        if (btnIconPlay) btnIconPlay.style.display = 'none';
        if (btnIconPause) btnIconPause.style.display = 'inline-block';
      }

      // Viewport Click Event
      wrapper.addEventListener('click', (e) => {
        if (e.target.closest('.video-control-bar')) return;
        togglePlay(e);
      });

      if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
      if (replayBtn) replayBtn.addEventListener('click', replayVideo);

      // Sound Mute / Unmute Toggle
      if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          vid.muted = !vid.muted;
          if (vid.muted) {
            if (btnIconMute) btnIconMute.style.display = 'inline-block';
            if (btnIconUnmute) btnIconUnmute.style.display = 'none';
          } else {
            if (btnIconMute) btnIconMute.style.display = 'none';
            if (btnIconUnmute) btnIconUnmute.style.display = 'inline-block';
          }
        });
      }

      // Live Progress Scrubber Update
      vid.addEventListener('timeupdate', () => {
        if (progressBar && vid.duration) {
          const pct = (vid.currentTime / vid.duration) * 100;
          progressBar.style.width = `${pct}%`;
        }
      });

      // Video Reaches End -> Show Replay Icon 🔄
      vid.addEventListener('ended', () => {
        wrapper.classList.remove('playing', 'paused');
        wrapper.classList.add('ended');
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconReplay) iconReplay.style.display = 'block';
        if (btnIconPlay) btnIconPlay.style.display = 'inline-block';
        if (btnIconPause) btnIconPause.style.display = 'none';
      });
    });

    // --- 5. LIGHTBOX MODAL FOR REVIEW SCREENSHOTS ---
    const lightboxModal = document.getElementById('image-lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-target-img');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (lightboxModal && lightboxImg) {
      lightboxTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const imgSrc = trigger.getAttribute('data-img');
          if (imgSrc) {
            lightboxImg.src = imgSrc;
            lightboxModal.classList.add('active');
          }
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
          lightboxModal.classList.remove('active');
        });
      }

      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          lightboxModal.classList.remove('active');
        }
      });
    }
  });
})();
