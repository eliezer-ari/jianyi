import { useEffect, useState } from 'react';

/**
 * Custom hook to handle reliable video playback
 * @param {React.RefObject} videoRef - Reference to the video element
 * @param {boolean} shouldPlay - Whether the video should play or not
 * @param {Object} options - Additional options
 * @returns {Object} Video playback state
 */
const useVideoPlayback = (videoRef, shouldPlay = true, options = {}) => {
  const { 
    muted = true, 
    autoplay = true, 
    loop = true,
    onPlay = () => {},
    onError = () => {}
  } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Handle video playback with retry mechanism
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    // Set video attributes
    video.muted = muted;
    video.loop = loop;
    video.autoplay = autoplay;
    
    let playAttempts = 0;
    const maxAttempts = 5;
    let attemptInterval;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      clearInterval(attemptInterval);
      onPlay();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleError = (e) => {
      setError(e);
      onError(e);
    };
    
    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    
    const attemptPlay = () => {
      if (!video || playAttempts >= maxAttempts) return;
      
      playAttempts++;
      console.log(`Attempting to play video: attempt ${playAttempts}`);
      
      // Use a Promise to handle playback
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch(error => {
            console.error(`Video play error (attempt ${playAttempts}):`, error);
            // Don't retry on user interaction errors
            if (error.name !== 'NotAllowedError') {
              // Exponential backoff for retry
              setTimeout(attemptPlay, 1000 * Math.min(playAttempts, 3));
            }
          });
      }
    };
    
    // Start playback attempts
    attemptPlay();
    
    // Set up interval to check if video is actually playing
    attemptInterval = setInterval(() => {
      if (video && !isPlaying && playAttempts < maxAttempts) {
        attemptPlay();
      } else {
        clearInterval(attemptInterval);
      }
    }, 2000);
    
    // Cleanup function
    return () => {
      clearInterval(attemptInterval);
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('error', handleError);
      }
    };
  }, [videoRef, shouldPlay, muted, loop, autoplay, onPlay, onError]);

  return { isPlaying, isLoaded, error };
};

export default useVideoPlayback; 