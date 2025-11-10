import React, { useEffect, useState } from "react";
import "../styles/ProjectTypes.css";
import "../styles/Standard.css";
import "../styles/VideoFix.css";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import ReactDOM from "react-dom";

const VideoPhotoProject = ({ project }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const hasPhotos = Array.isArray(project.photoUrls) && project.photoUrls.length > 0;
  const hasVideos = Array.isArray(project.videoUrls) && project.videoUrls.length > 0;

  // Check if it's mobile or desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 960px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
      console.log("Media change detected:", e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const openModal = (index) => {
    console.log("Opening modal at index:", index);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => {
      const newIndex = prev === 0 ? project.photoUrls.length - 1 : prev - 1;
      console.log("Previous photo index:", newIndex);
      return newIndex;
    });
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => {
      const newIndex = prev === project.photoUrls.length - 1 ? 0 : prev + 1;
      console.log("Next photo index:", newIndex);
      return newIndex;
    });
  };
  
  // Determine the position class based on the project's objectPosition property
  const getPositionClass = () => {
    return project.objectPosition === 'right-center' ? 'right-center' : '';
  };

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <>
      {/* Main photo as background, with overlay */}
      {(project.mainPhoto || (hasPhotos && project.photoUrls[0])) && (
        <div className="standard-container">
          <img
            src={project.mainPhoto || project.photoUrls[0]}
            alt={`${project.title || "Project"} background`}
            className={`${isMobile ? "video-background-mobile" : "video-background"} ${getPositionClass()}`}
          />
         	<div className="dark-overlay-2" style={{ 
				display: project.darkOverlay ? 'flex' : 'none' 
			}}></div>
        </div>
      )}
      
      <div className="project-container" >
        {/* <div className="project-header">
          <h2>{project.title}</h2>
        </div> */}
        
   
        
        <div className="project-content">
          {hasVideos && (
            <div className="videos-container">
              {project.videoUrls.map((videoUrl, index) => (
                <div className="video-item" key={`video-${index}`}>
                  <div className="video-player">
                    <iframe
                      src={videoUrl}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={`${project.title || "Project"} - Video ${index + 1}`}
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SoundCloud audio embed */}
          {project.audioUrl && (
            <div className="videos-container" style={{ margin: "24px 0" }}>
              <div className="video-item">
              <iframe
                width="100%"
                height="366"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={project.audioUrl}
                title={`${project.title || "Project"} - Audio`}
                style={{ borderRadius: 8, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
              ></iframe>
              </div>
            </div>
          )}

<div className="photos-container" style={{ display: hasPhotos ? 'flex' : 'none' }}>
            {hasPhotos ? (
              project.photoUrls.map((photoUrl, index) => (
                <div className="photo-item" key={`photo-${index}`} style={{ position: "relative" }}>
                  <img
                    src={photoUrl}
                    alt={`${project.title || "Project"} - Photo ${index + 1}`}
                    style={{ cursor: "pointer", width: "100%" }}
                    onClick={() => openModal(index)}
                  />
                  {/* <div style={{
                    position: "absolute",
                    bottom: "0",
                    left: "calc(100% + 10px)",
                    color: "white",
                    padding: "0",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "bold"
                  }}>
                    {"["}{index + 1}{"]"}
                  </div> */}
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div> 
        </div>
        {(project.description || project.endText1) && (
          <>
            {project.description && (
              <div className="project-description">
                <div style={{ whiteSpace: 'pre-line' }}>{project.description}</div>
              </div>
            )}
            {project.endText1 && (
              <>
                <div className="divider-line"></div>
                <div className="project-end-text">
                  <div style={{ whiteSpace: 'pre-line' }}>{project.endText1}</div>
                </div>
              </>
            )}
          </>
        )}
      </div>

   



      {/* Modal */}
      {isModalOpen && hasPhotos &&
        ReactDOM.createPortal(
          <div
            className="photo-modal-overlay"
            onClick={closeModal}
            style={{
              zIndex: 9000,
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: '100vh',
              width: '100vw'
            }}
          >
            <div
              className="photo-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#000",
                padding: "10px 10px 0 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxHeight: '100vh',
                maxWidth: '100vw'
              }}
            >
              <img
                src={project.photoUrls[currentPhotoIndex]}
                alt={`${project.title || "Project"} - Photo ${currentPhotoIndex + 1}`}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain"
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0 10px 0"}}>
                <button style={{width: "100px"}}  onClick={showPrev} className="nav-button">Previous</button>
                <span style={{ color: "#fff", textAlign: "center" }}>{currentPhotoIndex + 1} / {project.photoUrls.length}</span>
                <button style={{width: "100px"}} onClick={showNext} className="nav-button">Next</button>
              </div>
              
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
};

export default VideoPhotoProject; 