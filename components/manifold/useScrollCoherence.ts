import { useEffect } from 'react';
import { useCoherence } from './CoherenceContext';

const visibleRatio = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height <= 0 || rect.bottom <= 0 || rect.top >= viewportHeight) return 0;
  const visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return Math.max(0, Math.min(1, visible / Math.min(rect.height, viewportHeight)));
};

const isVisible = (element: Element | null) => (element ? visibleRatio(element) > 0.08 : false);

export const useScrollCoherence = () => {
  const { setTargetCoherence } = useCoherence();

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll('section'));
      const hero = sections[0] ?? null;
      const platform = document.getElementById('cobound-platform');
      const access = document.getElementById('access-section');
      const products = document.querySelector('[data-products-section="true"]');

      if (isVisible(products)) {
        setTargetCoherence(0.3);
        return;
      }

      if (access) {
        const accessRect = access.getBoundingClientRect();
        if (accessRect.top < window.innerHeight * 0.65) {
          setTargetCoherence(0.7);
          return;
        }
      }

      if (platform) {
        const platformRect = platform.getBoundingClientRect();
        if (platformRect.top < window.innerHeight && platformRect.bottom > 0) {
          const accessTop = access ? access.offsetTop : platform.offsetTop + platform.offsetHeight;
          const start = platform.offsetTop;
          const end = Math.max(start + 1, accessTop - window.innerHeight * 0.5);
          const progress = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));
          setTargetCoherence(0.1 + progress * 0.45);
          return;
        }
      }

      const visibleSections = sections
        .map((section, index) => ({ section, index, ratio: visibleRatio(section) }))
        .sort((a, b) => b.ratio - a.ratio);
      const mostVisible = visibleSections[0];

      if (mostVisible?.section === hero) {
        setTargetCoherence(0.05);
        return;
      }

      if (mostVisible && platform && mostVisible.section.compareDocumentPosition(platform) & Node.DOCUMENT_POSITION_FOLLOWING) {
        setTargetCoherence(0.95);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [setTargetCoherence]);
};
