import React from "react";
import "./styles/Navbar.css";

const NavbarMobile = ({ setActiveSection, activeSection }) => {
	const handleLinkClick = (section) => {
		console.log("Button clicked for section:", section);

		setActiveSection(section);
	};

	return (
		<nav className="navbar-lower">
			<div className="onerem-bar"></div>

			<div className="navbarmobilecontainer">
				{/* <div className="logospacer">
					<div className="logocontainer">
						<img src={Logo} alt="RDS Logo" className="navbarlogo" />
					</div>
				</div> */}
				<ul className="navmenu">
					<li className="navitem">
						<button
							className="navlinks"
							onClick={() => handleLinkClick("Lighting")}
						>
							Lighting
						</button>
					</li>
					<li className="navitem">
						<button
							className="navlinks"
							onClick={() => handleLinkClick("Cinematography")}
						>
							Cinematography
						</button>
					</li>
					<li className="navitem">
						<button className="navlinks" onClick={() => handleLinkClick("VFX")}>
							VFX
						</button>
					</li>
					<li className="navitem">
						<button
							className="navlinks"
							onClick={() => handleLinkClick("Graphics")}
						>
							Graphics
						</button>
					</li>
					<li className="navitem">
						<button
							className="navlinks"
							onClick={() => handleLinkClick("WebDesign")}
						>
							Web Design
						</button>
					</li>
					<li className="navitem">
						<button
							className="navlinks"
							onClick={() => handleLinkClick("Music")}
						>
							Music
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default NavbarMobile;
