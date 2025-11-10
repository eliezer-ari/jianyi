import React, { useRef, useEffect } from 'react';
import './styles/SelectedWorkModal.css';

const SelectedWorkModal = ({ isOpen, onClose, setActiveSection, projects = [] }) => {
  const overlayRef = useRef(null);
  
  if (!isOpen) return null;

  // Function to apply fade-out animation and then call onClose callback
  const closeWithAnimation = () => {
    if (overlayRef.current) {
      overlayRef.current.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    closeWithAnimation();
  };

  const handleProjectClick = (projectId) => {
    console.log("Project clicked in modal with ID:", projectId);
    
    // Pass the project ID to the setActiveSection function
    setActiveSection("SelectedWork", projectId);
    closeWithAnimation();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      closeWithAnimation();
    }
  };

  return (
    <div 
      ref={overlayRef}
      className="work-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="work-modal-links-container" onClick={closeWithAnimation}>
        <ul className="work-modal-links">
          {projects.map(project => (
            <li key={project.id} onClick={(e) => {
              e.stopPropagation();
              handleProjectClick(project.id);
            }}>
              <button 
                className="work-modal-link" 
                onClick={() => handleProjectClick(project.id)}
              >
                {project.title.split('\n').map((text, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {text}
                  </React.Fragment>
                ))}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectedWorkModal;