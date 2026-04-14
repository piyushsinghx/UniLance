const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:shadow-primary/30',
    secondary: 'bg-bg-card hover:bg-bg-hover text-text-primary border border-border',
    accent: 'bg-accent hover:bg-accent-hover text-bg-primary shadow-lg shadow-accent/20',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
    danger: 'bg-error/10 text-error hover:bg-error/20 border border-error/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-3.5 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-semibold transition-all duration-200
        focus-ring disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
