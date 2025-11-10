import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
import "./styles/Press.css";
import { Volume2, VolumeX } from "lucide-react";
import BGImage from "./images/press/press.jpg"
import BGImageMobile from "./images/press/pressmobile.jpg"
const Fire = "https://jianxyi.s3.us-east-1.amazonaws.com/Fire.mp4"

const Press = ({ setNextSection, data }) => {
	// Function to handle back to home navigation with animation
	const handleBackToHome = () => {
		setNextSection("Home"); // Set nextSection to "Home" to trigger the animation
	};

	console.log(data);

	const videoUrl = Fire;
	const mobileVideoUrl = Fire;

	const videoRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);

	// Check if it's mobile or desktop
	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 960px)");
		setIsMobile(mediaQuery.matches);

		const handleMediaChange = (e) => {
			setIsMobile(e.matches);
			console.log("Media change detected:", e.matches);
		};

		mediaQuery.addEventListener("change", handleMediaChange);
		
		// Check for small screens (< 768px)
		const smallScreenMediaQuery = window.matchMedia("(max-width: 768px)");
		setIsSmallScreen(smallScreenMediaQuery.matches);
		
		const handleSmallScreenChange = (e) => {
			setIsSmallScreen(e.matches);
		};
		
		smallScreenMediaQuery.addEventListener("change", handleSmallScreenChange);
		
		return () => {
			mediaQuery.removeEventListener("change", handleMediaChange);
			smallScreenMediaQuery.removeEventListener("change", handleSmallScreenChange);
		};
	}, []);

	// Attempt to play video when mounted or when isMobile changes
	useEffect(() => {
		const video = videoRef.current;
		if (video) {
			video.play().catch((error) => {
				console.error("Video playback failed:", error);
			});
		}
		// Reset fade-in when src changes
		setVideoLoaded(false);
	}, [isMobile]);

	const handleCanPlay = () => {
		setVideoLoaded(true);
	};

	// Add a loading check for data and data.fields and data.fields.pressLinks
	if (!data || !data.fields || !data.fields.pressLinks) {
		return <p>Loading press articles...</p>; // Or return null, or a loading spinner
	}

	return (
		<>
			<div className="standard-container">
				{/* Background image (always visible) - responsive image based on screen size */}
				<div 
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						backgroundImage: `url(${isSmallScreen ? BGImageMobile : BGImage})`,
						backgroundPosition: "center",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						zIndex: -10
					}}
				/>
				
				{/* Visible video that fades in */}
				<video
					ref={videoRef}
					src={isMobile ? mobileVideoUrl : videoUrl}
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					onCanPlay={handleCanPlay}
					poster={isSmallScreen ? BGImageMobile : BGImage} // Use poster matching the background
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						objectFit: "cover",
						zIndex: -5,
						opacity: videoLoaded ? 1 : 0, // Fade in when ready
						transition: `opacity ${isMobile ? '700ms' : '700ms'} ease-in-out` // Slower transition on mobile
					}}
				/>
				
				{/* Dark overlay */}
				<div className="dark-overlay" style={{ zIndex: -1 }}></div>
			</div>
			
			<div className="press-container">
				<h1>Press</h1>
				<div className="press-items">
					{data.fields.pressLinks.map((link, index) => (
						
							<a key={index} href={link.fields.pressLink} target="_blank" rel="noopener noreferrer" className="press-item">
							<h3>{link.fields.pressTitle}</h3>
							<p>{link.fields.pressAuthor}</p>
						</a>
						
				
				
					))}
				</div>
			</div>
		</>
	);
};

export default Press;
