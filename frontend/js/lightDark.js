function toggleMode() {
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');
    body.classList.toggle('dark-mode');
  
    if (body.classList.contains('dark-mode')) {
      modeIcon.textContent = '🌙';
    } else {
      modeIcon.textContent = '☀️';
    }
  }