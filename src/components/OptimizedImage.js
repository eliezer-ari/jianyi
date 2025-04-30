import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`image-container ${className}`} style={{ position: 'relative' }}>
      {isLoading && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f0f0f0',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoading(false)}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: 'auto',
          aspectRatio: '16/9',
          objectFit: 'cover',
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;