const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      const full = btn.getAttribute('data-full');
      const alt = btn.getAttribute('data-alt');
      mainImg.src = full;
      mainImg.alt = alt;
      thumbs.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });