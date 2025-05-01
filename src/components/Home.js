import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
import "./styles/Navbar.css";
import "./styles/VideoFix.css";

import BGImage from "./images/weathervanes/compressed/W2.jpg"
import BGImageMobile from "./images/weathervanes/compressed/W2mobile.jpeg"
const VideoPlaceholder = "https://jianxyi.s3.us-east-1.amazonaws.com/Weathervanes.mp4"

const Home = () => {
	const videoUrl = VideoPlaceholder;
	const mobileVideoUrl = VideoPlaceholder;

	const videoRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);

	// Check if it's mobile or desktop and set --vh unit
	useEffect(() => {
		const setVh = () => {
			if (typeof window !== 'undefined') {
				const vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', `${vh}px`);
			}
		};

		setVh();
		const timeoutId = setTimeout(setVh, 100);

		const mediaQuery = window.matchMedia("(max-width: 960px)");
		setIsMobile(mediaQuery.matches);

		const handleMediaChange = (e) => {
			setIsMobile(e.matches);
			setVh(); // Recalculate on media query change
		};

		mediaQuery.addEventListener("change", handleMediaChange);

		const smallScreenMediaQuery = window.matchMedia("(max-width: 768px)");
		setIsSmallScreen(smallScreenMediaQuery.matches);

		const handleSmallScreenChange = (e) => {
			setIsSmallScreen(e.matches);
			setVh(); // Recalculate on media query change
		};

		smallScreenMediaQuery.addEventListener("change", handleSmallScreenChange);

		window.addEventListener('resize', setVh);
		window.addEventListener('orientationchange', setVh);

		return () => {
			clearTimeout(timeoutId);
			mediaQuery.removeEventListener("change", handleMediaChange);
			smallScreenMediaQuery.removeEventListener("change", handleSmallScreenChange);
			window.removeEventListener('resize', setVh);
			window.removeEventListener('orientationchange', setVh);
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

	return (
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

			{/* Visible video that covers the background with fade-in effect */}
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
					transition: "opacity 700ms ease-in-out"
				}}
			/>

			{/* Dark overlay */}
			<div 
				className="dark-overlay" 
				style={{ zIndex: -1 }}
			/>

			{/* Content container */}
			<div className="content-container">
				{/* Page content would go here */}
			</div>
		</div>
	);
};

export default Home;
