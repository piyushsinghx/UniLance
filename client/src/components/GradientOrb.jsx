// Animated gradient orb background elements
const GradientOrb = ({ size = 400, color = '#6366F1', top, left, right, bottom, delay = 0, className = '' }) => {
  const style = {
    width: size,
    height: size,
    background: color,
    top,
    left,
    right,
    bottom,
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.12,
    pointerEvents: 'none',
    zIndex: 0,
    animationDelay: `${delay}s`,
  };

  const animClass = color === '#22D3EE' ? 'orb-accent' : color === '#8B5CF6' ? 'orb-violet' : 'orb-primary';

  return <div style={style} className={`${animClass} ${className}`} />;
};

export default GradientOrb;
