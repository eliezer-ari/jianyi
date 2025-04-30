import React, { useState, useEffect } from "react";
import "../styles/ProjectTypes.css";
import "../styles/PhotoOnly.css";


const PhotoOnlyProject = ({ project }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hasPhotos = Array.isArray(project.photoUrls) && project.photoUrls.length > 0;

  // Check for mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Preload images
  useEffect(() => {
    if (!hasPhotos) return;
    
    const preloadImages = async () => {
      const imagePromises = project.photoUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        // Still set as loaded even if some fail, to prevent infinite loading state
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [hasPhotos, project.photoUrls]);

  // Autoplay effect for main carousel - only start after images are loaded
  useEffect(() => {
    if (!hasPhotos || project.photoUrls.length < 2 || !imagesLoaded) return;
    
    const interval = setInterval(() => {
      // Move to next image
      setCurrentPhotoIndex(prev => (prev + 1) % project.photoUrls.length);
    }, 8000); // Doubled from 4000ms to 8000ms
    
    return () => clearInterval(interval);
  }, [hasPhotos, project.photoUrls, imagesLoaded]);

  // Modal navigation
  const openModal = (index) => {
    setModalPhotoIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextModalPhoto = () => {
    setModalPhotoIndex((prevIndex) => (prevIndex + 1) % project.photoUrls.length);
  };

  const prevModalPhoto = () => {
    setModalPhotoIndex((prevIndex) => (prevIndex - 1 + project.photoUrls.length) % project.photoUrls.length);
  };

  // Determine the position class based on the project's objectPosition property
  const getPositionClass = () => {
    return project.objectPosition === 'right-center' ? 'right-center' : '';
  };

  return (
    <>
      {/* Main photo as background, with overlay */}
      {(project.mainPhoto || (hasPhotos && project.photoUrls[0])) && (
        <div className="standard-container">
          <img
            src={project.mainPhoto || project.photoUrls[0]}
            alt={`${project.title || "Project"} background`}
            className={`video-background ${getPositionClass()}`}
          />
          <div className="dark-overlay-2"></div>
        </div>
      )}

      <div className="project-container">
        <div className="project-content">
          <div className="photo-content-2">
            {hasPhotos && imagesLoaded ? (
              <div 
                className="photo-display-2" 
                onClick={() => openModal(currentPhotoIndex)} 
                style={{
                  position: 'relative',
                  width: isMobile ? '90%' : '70%',
                  aspectRatio: '2500/1667',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto'
                }}
              >
                {project.photoUrls.map((url, index) => (
                  <div 
                    key={index}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      opacity: index === currentPhotoIndex ? 1 : 0,
                      transition: 'opacity 3s ease-in-out', // Doubled from 1.5s to 3s
                      zIndex: 1
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="photo-display" style={{ 
                position: 'relative', 
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div>Loading...</div>
              </div>
            )}
          </div>

          {project.description && (
            <div className="project-description-spc">
              <p>{project.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#000", padding: "10px 10px 0 10px", display: "flex", flexDirection: "column", alignItems: "center"
            }}
          >
            <img
              src={project.photoUrls[modalPhotoIndex]}
              alt={`${project.title || "Project"} - Modal Photo ${modalPhotoIndex + 1}`}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0 10px 0"}}>
              <button style={{width: "100px"}} onClick={prevModalPhoto} className="nav-button">Previous</button>
              <span style={{ color: "#fff", width: "70px", textAlign: "center" }}>{modalPhotoIndex + 1} / {project.photoUrls.length}</span>
              <button style={{width: "100px"}} onClick={nextModalPhoto} className="nav-button">Next</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoOnlyProject; 