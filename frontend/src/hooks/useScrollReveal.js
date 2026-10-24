import React from 'react';
import { useLocation } from 'react-router-dom';

// Progressive enhancement: content is always visible without JS or animation support.
export default function useScrollReveal() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    const main = document.getElementById('main-content');
    if (!main || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet();
    const animations = new Set();
    const selector = '.exp-heading, .exp-card, .exp-story-visual, .exp-story-copy, .exp-transfer-card, .exp-guide, .exp-city-benefits > article, .journal-card, .journal-feature, .exp-detail-block, .exp-detail-gallery img, .exp-gallery-grid figure';
    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (motion.matches || target.closest('[aria-hidden="true"]')) continue;
        const index = Array.from(target.parentElement.children).indexOf(target);
        const animation = target.animate([
          { opacity: .35, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 500, delay: Math.min(index % 4, 3) * 45, easing: 'cubic-bezier(.2,.65,.3,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .08 });
    function scan() {
      main.querySelectorAll(selector).forEach(node => {
        if (seen.has(node)) return;
        seen.add(node);
        observer.observe(node);
      });
    }
    const onPreferenceChange = () => {
      if (motion.matches) {
        animations.forEach(animation => animation.cancel());
        animations.clear();
      }
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(main, { childList: true, subtree: true });
    motion.addEventListener('change', onPreferenceChange);
    return () => {
      observer.disconnect(); mutations.disconnect();
      motion.removeEventListener('change', onPreferenceChange);
      animations.forEach(animation => animation.cancel());
    };
  }, [pathname]);
}
