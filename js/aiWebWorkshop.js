
function track(name, params){
  if (typeof gtag === 'function') gtag('event', name, params || {});
}

function toggleFaq(btn){
  const item = btn.closest('.faq-item');
  item.classList.toggle('open');
  if (item.classList.contains('open')) {
    const index = Array.from(document.querySelectorAll('.faq-item')).indexOf(item) + 1;
    track('workshop_faq_open', { question: index });
  }
}

// 報名按鈕：頁面上方與下方各一顆，position 用來分辨是哪一顆帶來報名
document.querySelectorAll('.cta-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => track('workshop_signup_click', { position: i === 0 ? 'top' : 'bottom' }));
});
