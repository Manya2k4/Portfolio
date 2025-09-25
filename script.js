document.addEventListener("DOMContentLoaded", () => {
    
  // ✨ CREATIVE: Cursor Follow Light Effect
  const cursorLight = document.querySelector('.cursor-light');
  document.addEventListener('mousemove', e => {
    cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  // ✨ IMPROVEMENT: Animate elements on scroll
  const sections = document.querySelectorAll("section");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Animate skills only when section is visible
        if (entry.target.id === 'skills') {
          animateAllSkills();
        }
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(sec => revealObserver.observe(sec));
  
  // --- Dot nav active state ---
  const dots = document.querySelectorAll(".dot-nav button");
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove("active"));
        const btn = document.querySelector(`.dot-nav button[data-target="${entry.target.id}"]`);
        if (btn) btn.classList.add("active");
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(sec => dotObserver.observe(sec));

  dots.forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.target).scrollIntoView();
    });
  });

  // --- Skills circles ---
  const skills = document.querySelectorAll(".skill");
  let skillsAnimated = false; // Flag to prevent re-animation

  function animateAllSkills() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    skills.forEach(skill => {
        const value = parseInt(skill.dataset.value, 10);
        const name = skill.dataset.name;
        const canvas = document.createElement("canvas");
        
        // ✨ IMPROVEMENT: Adjust canvas size based on parent to be more responsive
        const skillSize = skill.offsetWidth; // Get computed width
        canvas.width = skillSize; canvas.height = skillSize;
        skill.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const centerX = skillSize / 2;
        const centerY = skillSize / 2;
        const radius = (skillSize / 2) - 8; // Adjust radius for line width

        let progress = 0;
        function draw() {
            ctx.clearRect(0, 0, skillSize, skillSize);
            
            // Background circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 8;
            ctx.stroke();

            // Progress arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI / 2, (Math.PI * 2) * (progress / 100) - Math.PI / 2);
            const grad = ctx.createLinearGradient(0, 0, skillSize, skillSize);
            grad.addColorStop(0, "#38bdf8"); // Using root variables
            grad.addColorStop(1, "#34d399");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 8;
            ctx.lineCap = "round";
            ctx.stroke();

            // ✨ IMPROVEMENT: Better text positioning and styling
            ctx.fillStyle = "#fff";
            ctx.font = "700 1.2rem Inter"; // Larger font for percentage
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(progress)}%`, centerX, centerY);
        }

        function animate() {
            if (progress < value) {
                progress += 1;
                draw();
                requestAnimationFrame(animate);
            } else {
                draw(); // ensure final state is drawn
            }
        }
        animate();

        const label = document.createElement("div");
        label.className = "skill-label";
        label.textContent = name;
        skill.appendChild(label);
    });
  }

  // --- Project Modal ---
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('modalTitle').textContent = card.dataset.title;
      document.getElementById('modalDesc').textContent = card.dataset.desc;
      
      const githubLink = document.getElementById('modalGithub');
      const liveLink = document.getElementById('modalLive');

      // Check and set GitHub link
      if (card.dataset.github && card.dataset.github !== '#') {
        githubLink.href = card.dataset.github;
        githubLink.classList.remove('hidden');
      } else {
        githubLink.classList.add('hidden');
      }

      // Check and set Live Demo link
      if (card.dataset.live && card.dataset.live !== '#') {
        liveLink.href = card.dataset.live;
        liveLink.classList.remove('hidden');
      } else {
        liveLink.classList.add('hidden');
      }

      modal.classList.add('active');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ✨ IMPROVEMENT: Copy email with feedback
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText').textContent;
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
      }, 2000);
    });
  });

});