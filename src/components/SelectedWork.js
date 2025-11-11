import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
// import "./styles/PastProjects.css";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

// Import the project type components
import VideoPhotoProject from "./ProjectTypes/VideoPhotoProject";
import PhotoOnlyProject from "./ProjectTypes/PhotoOnlyProject";

const Fire = "https://jianxyi.s3.us-east-1.amazonaws.com/Fire.mp4";

const SelectedWork = ({ setNextSection, projects = [] }) => {
	const videoUrl = Fire;
	const mobileVideoUrl = Fire;

	const desktopVideoRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

	// Check if there's a selected project ID in sessionStorage
	useEffect(() => {
		const selectedProjectId = sessionStorage.getItem('selectedProjectId');
		
		if (selectedProjectId) {
			try {
				// Parse the project ID as an integer
				const projectId = parseInt(selectedProjectId, 10);
				
				// Find the project with matching ID
				const foundIndex = projects.findIndex(p => p.id === projectId);
				
				if (foundIndex !== -1) {
					setSelectedProjectIndex(foundIndex);
				}
			} catch (error) {
				console.error("Error processing selectedProjectId:", error);
			} finally {
				// Clear the sessionStorage item after attempting to retrieve it
				sessionStorage.removeItem('selectedProjectId');
			}
		}
	}, []);

	// Check if it's mobile or desktop
	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 768px)");
		setIsMobile(mediaQuery.matches);

		const handleMediaChange = (e) => {
			setIsMobile(e.matches);
		};

		mediaQuery.addEventListener("change", handleMediaChange);
		return () => mediaQuery.removeEventListener("change", handleMediaChange);
	}, []);

	// Handle video loading
	const handleVideoLoaded = () => {
		setVideoLoaded(true);
	};

	// Attempt to play video when mounted or when `isMobile` changes
	useEffect(() => {
		const video = desktopVideoRef.current;
		if (video) {
			video.play().catch((error) => {
				console.error("Video playback failed:", error);
			});
		}
	}, [isMobile]);

	// Function to handle back to home navigation
	const handleBackToHome = () => {
		setNextSection("Home");
	};

	// Function to open a specific project
	const openProject = (projectId) => {
		const idx = projects.findIndex(p => p.id === projectId);
		setSelectedProjectIndex(idx);
	};

	const closeProject = () => {
		setSelectedProjectIndex(null);
	};

	// Only show the background video when no project is selected
	const showBackgroundVideo = selectedProjectIndex === null;
	const selectedProject = selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;

	const handlePrevProject = (e) => {
		e.stopPropagation();
		setSelectedProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
	};
	const handleNextProject = (e) => {
		e.stopPropagation();
		setSelectedProjectIndex((prev) => (prev + 1) % projects.length);
	};

	// Early return if projects aren't loaded - show just the background to prevent layout issues
	if (projects.length === 0) {
		return (
			<>
				<div id="tracking-container" className="standard-container">
					<div className="back-arrow-container">
						<button
							style={{ transform: "rotate(270deg) translateX(-8px)" }}
							className="arrow-button"
							onClick={handleBackToHome}
						>
							&#x2303;
						</button>
					</div>
					<video
						ref={desktopVideoRef}
						src={isMobile ? mobileVideoUrl : videoUrl}
						autoPlay
						loop
						muted
						playsInline
						preload="auto"
						className={isMobile ? "video-background-mobile" : "video-background"}
					/>
				</div>
				<div className="standard-container">
					{/* Empty - just background video while projects load */}
				</div>
			</>
		);
	}

	return (
		<>
			<div id="tracking-container" className="standard-container">
				<div className="back-arrow-container">
					<button
						style={{ transform: "rotate(270deg) translateX(-8px)" }}
						className="arrow-button"
						onClick={handleBackToHome}
					>
						&#x2303;
					</button>
				</div>

				<video
					ref={desktopVideoRef}
					src={isMobile ? mobileVideoUrl : videoUrl}
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					className={isMobile ? "video-background-mobile" : "video-background"}
				/>
			</div>
			<div className="dark-overlay-2" style={{ 
				display: selectedProject && selectedProject.darkOverlay ? 'flex' : 'none' 
			}}></div>
			<div className="standard-container">
		
				
				<div className="projects-grid">
					{projects.map((project) => (
						<div
							key={project.id}
							className="project-card"
							onClick={() => openProject(project.id)}
						>
							{project.mainPhoto ? (
								<OptimizedImage 
									src={isMobile ? project.mainMobilePhoto : project.mainPhoto} 
									alt={project.title}
									className="project-card-image"
								/>
							) : (
								<div className="project-card-image-placeholder">
									{project.title}
								</div>
							)}
							<div className="project-card-content">
								<h3 className="project-card-title">{project.title}</h3>
								<p className="project-card-year-role">
									{project.year} | {project.role}
									{project.inProgress && <span className="in-progress-tag">In Progress</span>}
								</p>
								<p className="project-card-description">{project.description}</p>
							</div>
						</div>
					))}
				</div>

				{selectedProject && (
					<div className="project-modal-container">
				

						{/* Arrow navigation container */}
						<div className="project-arrow-nav" style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: "1rem" }}>
							<button onClick={handlePrevProject} className="arrow-nav-btn" aria-label="Previous Project">
								<ArrowLeft size={32} />
							</button>
							<button onClick={handleNextProject} className="arrow-nav-btn" aria-label="Next Project">
								<ArrowRight size={32} />
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default SelectedWork;
