// Applies the saved theme before first paint to prevent a flash of the wrong theme.
try {
  if (localStorage.getItem('clarity-theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
