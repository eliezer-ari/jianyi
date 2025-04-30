import React, { useState, useEffect } from "react";
import "./styles/Hero.css";
import Navbar from "./Navbar.js";
import NavbarMobile from "./NavbarMobile.js";
import Bio from "./Bio.js";
import Press from "./Press.js";
import SelectedWork from "./SelectedWork.js";
import Home from "./Home.js";
import Contact from "./Contact.js";
import VideoPhotoProject from "./ProjectTypes/VideoPhotoProject.js";
import PhotoOnlyProject from "./ProjectTypes/PhotoOnlyProject.js";
import projects from "../data/projects.js";
import { ArrowLeft, ArrowRight } from 'lucide-react';

import InstaLogo from "./images/instagram-new.png";
import VimeoLogo from "./images/vimeo-icon-lg.png";

export default function Hero() {
	const [activeSection, setActiveSection] = useState("Home");
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [visibleSection, setVisibleSection] = useState("Home");
	const [contentOpacity, setContentOpacity] = useState(1);
	const [selectedProject, setSelectedProject] = useState(null);

	// Helper function to convert title to URL-friendly slug
	const createSlug = (title) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
			.trim();
	};

	// Helper function to find project by slug
	const findProjectBySlug = (slug) => {
		return projects.find(p => createSlug(p.title) === slug);
	};

	const handleSectionChange = (section, projectId = null) => {
		if (section !== activeSection || projectId) {
			console.log(`Starting transition from ${activeSection} to ${section}${projectId ? ` with project ID ${projectId}` : ''}`);

			setIsTransitioning(true);
			// Fade out only the content
			setContentOpacity(0);

			// Wait for fade out to complete
			setTimeout(() => {
				// If a project ID is provided, find and set the selected project
				if (projectId) {
					const project = projects.find(p => p.id === parseInt(projectId, 10));
					if (project) {
						setSelectedProject(project);
						// Set the actual section to "Project"
						section = "Project";
						
						// Update URL with project slug
						window.location.hash = `project/${createSlug(project.title)}`;
					}
				} else {
					// Clear selected project if just changing to a regular section
					setSelectedProject(null);
					// Update URL with section name
					window.location.hash = section;
				}
				
				// Update section after fade out
				setVisibleSection(section);
				setActiveSection(section);
				
				// Scroll to top
				window.scrollTo({ top: 0, left: 0, behavior: "instant" });
				
				// Then fade content back in
				setContentOpacity(1);
				setIsTransitioning(false);
				
				sessionStorage.setItem("lastActiveSection", section);
				
				// If project ID is provided, also save it
				if (projectId) {
					sessionStorage.setItem("selectedProjectId", projectId);
				} else {
					sessionStorage.removeItem("selectedProjectId");
				}
			}, 500); // Match the transition duration
		} else {
			console.log(`Section '${section}' is already active. No action needed.`);
		}
	};

	// Function to set the next section, used by back button in components
	const setNextSection = (section, projectId = null) => {
		handleSectionChange(section, projectId);
	};


	// Set initial section based on sessionStorage or hash in URL
	useEffect(() => {
		const hash = window.location.hash.replace("#", "");
		let initialSection = "Home";
		let projectId = null;
		
		// Check if hash contains a project slug
		if (hash.startsWith("project/")) {
			const slug = hash.replace("project/", "");
			const project = findProjectBySlug(slug);
			
			if (project) {
				initialSection = "Project";
				projectId = project.id;
			}
		} else if (hash) {
			initialSection = hash;
		} else {
			// Fall back to session storage if no hash
			initialSection = sessionStorage.getItem("lastActiveSection") || "Home";
			projectId = sessionStorage.getItem("selectedProjectId") || null;
		}
		
		// Load the section with project if available
		if (projectId && (initialSection === "Project" || initialSection === "SelectedWork")) {
			handleSectionChange(initialSection, projectId);
		} else {
			// Set section without project
			setActiveSection(initialSection);
			setVisibleSection(initialSection);
		}
	}, []);

	// Set the actual viewport height on mobile devices
	function setVhProperty() {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	}

	// Initial setting and on resize
	setVhProperty();
	window.addEventListener("resize", setVhProperty);

	// Update the existing navigation buttons
	const handlePrevProject = () => {
		if (!selectedProject) return;
		const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
		const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
		const prevProject = projects[prevIndex];
		
		setSelectedProject(prevProject);
		sessionStorage.setItem("selectedProjectId", prevProject.id);
		window.location.hash = `project/${createSlug(prevProject.title)}`;
	};
	
	const handleNextProject = () => {
		if (!selectedProject) return;
		const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
		const nextIndex = (currentIndex + 1) % projects.length;
		const nextProject = projects[nextIndex];
		
		setSelectedProject(nextProject);
		sessionStorage.setItem("selectedProjectId", nextProject.id);
		window.location.hash = `project/${createSlug(nextProject.title)}`;
	};

	const renderSection = () => {
		// First check if we're showing a specific project
		if (activeSection === "Project" && selectedProject) {
			// Render the appropriate project component based on type
			return selectedProject.type === "video-photo" 
				? <VideoPhotoProject project={selectedProject} />
				: <PhotoOnlyProject project={selectedProject} />;
		}
		
		// Otherwise show the normal sections
		switch (activeSection) {
			case "SelectedWork":
				return <SelectedWork setNextSection={setNextSection} />;
			case "Bio":
				return <Bio setNextSection={setNextSection} />;
			case "Press":
				return <Press setNextSection={setNextSection} />;
			case "Contact":
				return <Contact setNextSection={setNextSection} />;
			default:
				return <Home />;
		}
	};

	// Add to your component useEffect
	useEffect(() => {
		// Simply ensure the body can scroll naturally
		document.body.style.overflow = 'auto';
		
		// Clean up any scroll listeners that might be interfering
		return () => {
			// Clean up if needed
		};
	}, []);

	return (
		<div id="hero" className="herocontainer">
			<div id="page-container" className="page-container">
				<div className="section-container">
					{/* Navbar with fixed opacity */}
					<div className="navreplacement" style={{ opacity: 1 }}>
						<Navbar
							setActiveSection={handleSectionChange}
							activeSection={activeSection}
						/>
					</div>
					
					{/* Content with dynamic opacity */}
					<div className="content-wrapper" style={{ opacity: contentOpacity, transition: 'opacity 0.5s ease' }}>
						{renderSection(activeSection)}
						{activeSection === "Project" && selectedProject && (
							<div className="arrow-nav-container">
								<button
									onClick={() => {
										const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
										const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
										handleSectionChange("Project", projects[prevIndex].id);
									}}
									className="arrow-nav-btn"
									aria-label="Previous Project"
								>
									<ArrowLeft size={24} />
								</button>
								<div className="project-header">
									<h2>{selectedProject?.title}</h2>
								</div>

								<button
									onClick={() => {
										const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
										const nextIndex = (currentIndex + 1) % projects.length;
										handleSectionChange("Project", projects[nextIndex].id);
									}}
									className="arrow-nav-btn"
									aria-label="Next Project"
								>
									<ArrowRight size={24} />
								</button>
							</div>
						)}
						<div className="footer-container">
							<div className="footer-content">
								<a href="https://www.instagram.com/jianx_yi/?hl=en" target="_blank" rel="noopener noreferrer">
									<img src={InstaLogo} alt="Instagram" className="footer-logo-insta" />
								</a>
								<a href="https://vimeo.com/user6603959" target="_blank" rel="noopener noreferrer">
									<img src={VimeoLogo} alt="Vimeo" className="footer-logo-vimeo" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Add this after everything */}
			<div className="black-extension" style={{ top: '100vh' }}></div>
		</div>
	);
}
