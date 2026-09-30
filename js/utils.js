// CleanSetu Utility Functions

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '4.5rem';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
      }
    });
  }
});

// Toast notification helper
window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '1rem 1.5rem';
  toast.style.borderRadius = '0.5rem';
  toast.style.color = 'white';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  toast.style.zIndex = '9999';
  toast.style.transition = 'all 0.3s ease';
  
  if (type === 'success') toast.style.backgroundColor = 'var(--primary)';
  else if (type === 'error') toast.style.backgroundColor = '#EF4444';
  else if (type === 'info') toast.style.backgroundColor = 'var(--secondary)';
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Global Watermark
document.addEventListener('DOMContentLoaded', () => {
  const watermark = document.createElement('div');
  watermark.textContent = 'Made by Starks';
  Object.assign(watermark.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    zIndex: '100000',
    pointerEvents: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontFamily: '"Inter", sans-serif',
    letterSpacing: '0.5px'
  });
  document.body.appendChild(watermark);
});
