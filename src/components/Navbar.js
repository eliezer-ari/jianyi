import React, { useState, useEffect, useRef } from "react";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import "./styles/Navbar.css";
import SelectedWorkModal from "./SelectedWorkModal";
import Logo from "./images/jianlogo.png";

const Navbar = ({ setActiveSection, activeSection, projects = [] }) => {
	const [activeLink, setActiveLink] = useState(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSelectedWorkModalOpen, setIsSelectedWorkModalOpen] = useState(false);
	const [isModalClosing, setIsModalClosing] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			setIsScrolled(scrollPosition > 0);
		};

		window.addEventListener('scroll', handleScroll);
		
		// Clean up the event listener
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// Update activeLink when activeSection changes
	useEffect(() => {
		setActiveLink(activeSection);
	}, [activeSection]);

	useEffect(() => {
		const menu = menuRef.current;
		if (isMenuOpen && menu) {
			disableBodyScroll(menu);
		} else if (menu) {
			enableBodyScroll(menu);
		}
		return () => {
			clearAllBodyScrollLocks();
		};
	}, [isMenuOpen]);

	const handleLinkClick = (section) => {
		if (section === "SelectedWork") {
			setIsSelectedWorkModalOpen(true);
		} else {
			setActiveSection(section);
		}
		setIsMenuOpen(false); // Close mobile menu after clicking a link
	};

	const handleCloseModal = () => {
		setIsSelectedWorkModalOpen(false);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Handler for clicks within the mobile menu container
	const handleMobileMenuClick = (event) => {
		// Check if the clicked element has the 'mobile-navlinks' class
		// If it DOES NOT, close the menu.
		if (!event.target.classList.contains('mobile-navlinks')) {
			setIsMenuOpen(false);
		}
		// If it DOES have the class, the link's own onClick (handleLinkClick) 
		// will handle the navigation and closing the menu, so we do nothing here.
	};

	return (
		<>
			<nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
				<div className="logospacer">
					<div className="logocontainer">
						<button
							className={`navlinkspecial ${
								activeLink === "Home" ? "active" : ""
							}`}
							onClick={() => handleLinkClick("Home")}
						>
							<img className={`navbarlogo ${activeLink === "Home" ? "active" : ""}`} src={Logo} alt="Jian X Yi Logo" />
						</button>
					</div>
				</div>
				<div className="navbarcontainer">
					<ul className="navmenu">
						<li className="navitem">
							<button
								className={`navlinks ${
									activeLink === "Bio" ? "active" : ""
								}`}
								onClick={() => handleLinkClick("Bio")}
							>
								Bio
							</button>
						</li>
						<li className="navitem">
							<button
								className={`navlinks ${
									["SelectedWork", "Project", "Films", "Photography", "Installations"].includes(activeLink) ? "active" : ""
								}`}
								onClick={() => handleLinkClick("SelectedWork")}
							>
								Selected Work
							</button>
						</li>
						<li className="navitem">
							<button
								className={`navlinks ${
									activeLink === "Press" ? "active" : ""
								}`}
								onClick={() => handleLinkClick("Press")}
							>
								Press
							</button>
						</li>
						<li className="navitem">
							<button
								style={{
									marginRight: "-0.5rem"
								}}
								className={`navlinks ${
									activeLink === "Contact" ? "active" : ""
								}`}
								onClick={() => handleLinkClick("Contact")}
							>
								Contact
							</button>
						</li>
					</ul>
					
					{/* Hamburger menu button */}
					<button className="hamburger-button" onClick={toggleMenu}>
						<div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>
					
					{/* Mobile menu - Add onClick handler */}
					<div
						ref={menuRef}
						className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
						onClick={handleMobileMenuClick}
					>
						<ul className="mobile-navmenu">
							<li className="mobile-navitem">
								<button
									className={`mobile-navlinks ${
										activeLink === "Bio" ? "active" : ""
									}`}
									onClick={() => handleLinkClick("Bio")} 
								>
									Bio
								</button>
							</li>
							<li className="mobile-navitem">
								<button
									className={`mobile-navlinks ${
										["SelectedWork", "Project", "Films", "Photography", "Installations"].includes(activeLink) ? "active" : ""
									}`}
									onClick={() => handleLinkClick("SelectedWork")}
								>
									Selected Work
								</button>
							</li>
							<li className="mobile-navitem">
								<button
									className={`mobile-navlinks ${
										activeLink === "Press" ? "active" : ""
									}`}
									onClick={() => handleLinkClick("Press")}
								>
									Press
								</button>
							</li>
							<li className="mobile-navitem">
								<button
									className={`mobile-navlinks ${
										activeLink === "Contact" ? "active" : ""
									}`}
									onClick={() => handleLinkClick("Contact")}
								>
									Contact
								</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			
			<SelectedWorkModal 
				isOpen={isSelectedWorkModalOpen} 
				onClose={handleCloseModal}
				setActiveSection={setActiveSection}
				projects={projects}
			/>
		</>
	);
};

export default Navbar;
