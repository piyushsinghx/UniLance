// TypeWriter component — cycles through phrases with animated cursor
import { useState, useEffect, useRef } from 'react';

const TypeWriter = ({ phrases = [], speed = 70, deleteSpeed = 40, pause = 2000, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const current = phrases[phraseIdx] || '';

    const tick = () => {
      if (!isDeleting) {
        if (displayText.length < current.length) {
          setDisplayText(current.slice(0, displayText.length + 1));
          timerRef.current = setTimeout(tick, speed);
        } else {
          timerRef.current = setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(current.slice(0, displayText.length - 1));
          timerRef.current = setTimeout(tick, deleteSpeed);
        } else {
          setIsDeleting(false);
          setPhraseIdx(i => (i + 1) % phrases.length);
        }
      }
    };

    timerRef.current = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timerRef.current);
  }, [displayText, phraseIdx, isDeleting, phrases, speed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink ml-0.5 text-[var(--color-primary)]">|</span>
    </span>
  );
};

export default TypeWriter;
