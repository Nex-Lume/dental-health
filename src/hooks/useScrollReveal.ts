import { useEffect, useRef } from 'react';

/**
 * Attach this ref to a container element.
 * Any child with className "reveal" will animate in when it enters the viewport.
 */
export function useScrollReveal() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observedElements = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add('visible');
            observer.unobserve(el);
            observedElements.delete(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    const observeNewElements = () => {
      const elements = container.querySelectorAll<HTMLElement>('.reveal');
      elements.forEach((el) => {
        if (!el.classList.contains('visible') && !observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      });
    };

    // Observe initial elements
    observeNewElements();

    // Setup MutationObserver to watch for newly added children
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return containerRef;
}
