import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border-2 border-current hover:bg-white/10 text-current',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
      {...props}
    />
  );
}
