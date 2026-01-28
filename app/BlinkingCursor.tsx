'use client';

import { useEffect, useState } from 'react';

export default function BlinkingCursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 530); // Blink every 530ms

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block w-3 h-8 bg-green-400 ml-3 transition-opacity duration-100 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        verticalAlign: 'baseline',
        transform: 'translateY(0.1em)',
        boxShadow: visible ? '0 0 15px rgba(0, 255, 65, 1), 0 0 30px rgba(0, 255, 65, 1), 0 0 45px rgba(0, 255, 65, 0.9), 0 0 60px rgba(0, 255, 65, 0.7), 0 0 80px rgba(0, 255, 65, 0.5)' : 'none'
      }}
    />
  );
}