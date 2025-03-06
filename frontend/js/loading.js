window.addEventListener('load', () => {
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500); // Fade-out duration
    }, 4000); // 4 seconds delay
  });