// CountUp component — animates number from 0 to target when it enters viewport
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const CountUp = ({ end, duration = 2000, prefix = '', suffix = '', decimals = 0, className = '' }) => {
  const [value, setValue] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    startRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setValue(easedProgress * end);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, end, duration]);

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default CountUp;
