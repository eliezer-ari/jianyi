import React, { useState, useEffect, useRef } from "react";
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
import { transformProjectsData } from "../data/projects.js";
import { ArrowLeft, ArrowRight } from 'lucide-react';

import InstaLogo from "./images/instagram-new.png";
import VimeoLogo from "./images/vimeo-icon-lg.png";
import { getBio, getPress, getProjects } from "../contentful.js";

export default function Hero() {
	const [projectsData, setProjectsData] = useState(null);
	const [projects, setProjects] = useState([]);
	const [bioData, setBioData] = useState(null);
	const [pressData, setPressData] = useState(null);
	const [activeSection, setActiveSection] = useState("Home");
	const [visibleSection, setVisibleSection] = useState("Home");
	const [selectedProject, setSelectedProject] = useState(null);
	const [contentOpacity, setContentOpacity] = useState(1);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// NEW: Pending state
	const [pendingSection, setPendingSection] = useState(null);
	const [pendingProject, setPendingProject] = useState(null);

	const contentWrapperRef = useRef(null);

	// Fetch bio data in useEffect
	useEffect(() => {
		const fetchBioData = async () => {
			try {
				const bioResult = await getBio();
				setBioData(bioResult);
				// console.log(bio.fields); // If you need to log, do it here with bioResult
			} catch (error) {
				console.error("Failed to fetch bio:", error);
				// Handle error state if necessary
			}
		};

		const fetchPressData = async () => {
			try {
				const pressResult = await getPress();
				setPressData(pressResult);
				// console.log(bio.fields); // If you need to log, do it here with bioResult
			} catch (error) {
				console.error("Failed to fetch press:", error);
				// Handle error state if necessary
			}
		};

		const fetchProjectsData = async () => {
			try {
				const projectsResult = await getProjects();
				setProjectsData(projectsResult);
				
				// Transform the projects data into the format expected by components
				const transformedProjects = transformProjectsData(projectsResult);
				setProjects(transformedProjects);
				console.log('Transformed projects:', transformedProjects);
			} catch (error) {
				console.error("Failed to fetch projects:", error);
				// Set empty array on error to prevent crashes
				setProjects([]);
			}
		};

		fetchProjectsData();
		fetchPressData();
		fetchBioData();
	}, []); // Empty dependency array ensures this runs once on mount

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
		// Avoid processing if already transitioning or no actual change
		if (isTransitioning || (activeSection === section && (!projectId || selectedProject?.id === projectId))) {
			return;
		}

		// Track that we're starting a transition
		setIsTransitioning(true);
		
		// 1. Start fade-out (extend duration for reliability)
		setContentOpacity(0);
		
		// 2. After fade-out completes, update content and scroll
		setTimeout(() => {
			// Force scroll to absolute top using multiple approaches for cross-browser reliability
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
			window.scrollTo(0, 0);
			
			// Only after ensuring we're at the top, update the content
			let newSection = section;
			let newProject = null;
			
			if (projectId) {
				const project = projects.find(p => p.id === parseInt(projectId, 10));
				if (project) {
					newProject = project;
					newSection = "Project";
					window.location.hash = `project/${createSlug(project.title)}`;
				} else {
					newSection = "SelectedWork";
					window.location.hash = newSection;
				}
			} else {
				window.location.hash = section;
			}
			
			// Now update states that control rendering
			setVisibleSection(newSection);
			setActiveSection(newSection);
			setSelectedProject(newProject);
			
			// Update session storage
			sessionStorage.setItem("lastActiveSection", newSection);
			if (projectId) {
				sessionStorage.setItem("selectedProjectId", projectId);
			} else {
				sessionStorage.removeItem("selectedProjectId");
			}
			
			// 3. Ensure we're still at the top after content change
			setTimeout(() => {
				// Double-check scroll position
				document.documentElement.scrollTop = 0;
				document.body.scrollTop = 0;
				window.scrollTo(0, 0);
				
				// 4. Only now start the fade-in
				setContentOpacity(1);
				setIsTransitioning(false);
			}, 100); // Small buffer for DOM updates
			
		}, 900); // Extend fade-out time from 700ms to 900ms for visual smoothness
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
		let needsProjects = false;
		
		// Check if hash contains a project slug
		if (hash.startsWith("project/")) {
			needsProjects = true;
			if (projects.length > 0) {
				const slug = hash.replace("project/", "");
				const project = findProjectBySlug(slug);
				
				if (project) {
					initialSection = "Project";
					projectId = project.id;
				} else {
					// Project not found in hash, default to Home
					initialSection = "Home";
					window.location.hash = "";
				}
			} else {
				// Projects not loaded yet, wait for them
				initialSection = "Home";
			}
		} else if (hash) {
			// Only use hash if it's a valid section that doesn't need projects
			const validSections = ["Home", "Bio", "Press", "Contact"];
			if (validSections.includes(hash)) {
				initialSection = hash;
			} else if (hash === "SelectedWork") {
				needsProjects = true;
				if (projects.length > 0) {
					initialSection = hash;
				} else {
					initialSection = "Home";
				}
			}
		} else {
			// No hash - check session storage, but be smart about it
			const lastSection = sessionStorage.getItem("lastActiveSection");
			
			// Only restore SelectedWork/Project if projects are loaded
			if (lastSection === "SelectedWork" || lastSection === "Project") {
				needsProjects = true;
				if (projects.length > 0) {
					initialSection = lastSection;
					projectId = sessionStorage.getItem("selectedProjectId");
				} else {
					// Projects not loaded, default to Home and clear stale sessionStorage
					initialSection = "Home";
					sessionStorage.removeItem("lastActiveSection");
					sessionStorage.removeItem("selectedProjectId");
				}
			} else if (lastSection && ["Home", "Bio", "Press", "Contact"].includes(lastSection)) {
				// Safe to restore these sections without projects
				initialSection = lastSection;
			}
		}
		
		// If we need projects but they're not loaded, wait
		if (needsProjects && projects.length === 0) {
			return; // This effect will re-run when projects load
		}
		
		// Load the section with project if available
		if (projectId && (initialSection === "Project" || initialSection === "SelectedWork")) {
			const project = projects.find(p => p.id === parseInt(projectId, 10));
			if (project) {
				handleSectionChange(initialSection, projectId);
			} else {
				// Project not found, default to Home
				setActiveSection("Home");
				setVisibleSection("Home");
				sessionStorage.removeItem("selectedProjectId");
				sessionStorage.setItem("lastActiveSection", "Home");
			}
		} else {
			// Set section without project
			setActiveSection(initialSection);
			setVisibleSection(initialSection);
		}
	}, [projects.length]); // Re-run when projects load

	// Handle hash-based navigation after projects load (for project/ URLs)
	// This handles the case where user visits with a project hash but projects weren't loaded yet
	useEffect(() => {
		if (projects.length === 0) return;
		
		const hash = window.location.hash.replace("#", "");
		if (hash.startsWith("project/")) {
			const slug = hash.replace("project/", "");
			const project = findProjectBySlug(slug);
			// Only navigate if we're currently on Home (meaning first useEffect couldn't handle it)
			if (project && visibleSection === "Home") {
				handleSectionChange("Project", project.id);
			}
		}
	}, [projects.length, visibleSection]); // Run when projects load or section changes

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
		// During transition, show the *old* content until fade-out is done
		const sectionToShow = isTransitioning && pendingSection !== null ? visibleSection : visibleSection;
		const projectToShow = isTransitioning && pendingProject !== null ? selectedProject : selectedProject;

		if (sectionToShow === "Project" && projectToShow) {
			return projectToShow.type === "video-photo"
				? <VideoPhotoProject project={projectToShow} />
				: <PhotoOnlyProject project={projectToShow} />;
		}
		switch (sectionToShow) {
			case "SelectedWork":
				return <SelectedWork setNextSection={handleSectionChange} projects={projects} />;
			case "Bio":
				return <Bio data={bioData} setNextSection={handleSectionChange} />;
			case "Press":
				return <Press data={pressData} setNextSection={handleSectionChange} />;
			case "Contact":
				return <Contact setNextSection={handleSectionChange} />;
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
							projects={projects}
						/>
					</div>
					
					{/* Content with dynamic opacity */}
					<div 
						ref={contentWrapperRef} 
						className="content-wrapper" 
						style={{ opacity: contentOpacity, transition: 'opacity 0.9s ease' }}
					>
						{renderSection()}
						{visibleSection === "Project" && selectedProject && (
							<div className="arrow-nav-container">
								<div className="arrow-nav-container-inner">
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
