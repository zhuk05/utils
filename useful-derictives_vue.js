app.directive('lazy-bg', lazyBackground);
app.directive('focus', {
    mounted(el) {
        el.focus();
    }
});


//lazy-bg.js
export default {
  mounted(el, binding) {
      function loadImage() {
          const imageUrl = binding.value;
          const img = new Image();
          img.onload = () => {
              el.style.backgroundImage = `url(${imageUrl})`;
              el.classList.add('loaded');
          };
          img.src = imageUrl;
      }

      function handleIntersect(entries, observer) {
          entries.forEach((entry) => {
              if (entry.isIntersecting) {
                  loadImage();
                  observer.unobserve(el);
              }
          });
      }

      const observer = new IntersectionObserver(handleIntersect);
      observer.observe(el);
  }
};
