import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
import "./styles/Navbar.css";
import "./styles/VideoFix.css";

import BGImage from "./images/home/home.png"
import BGImageMobile from "./images/home/homemobile.png"
const VideoPlaceholder = "https://jianxyi.s3.us-east-1.amazonaws.com/Weathervanes.mp4"

const Home = () => {
	const videoUrl = VideoPlaceholder;
	const mobileVideoUrl = VideoPlaceholder;

	const videoRef = useRef(null);
	const hiddenVideoRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [videoReady, setVideoReady] = useState(false);
	const [showVideo, setShowVideo] = useState(false);

	// Check if it's mobile or desktop
	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 960px)");
		setIsMobile(mediaQuery.matches);

		const handleMediaChange = (e) => {
			setIsMobile(e.matches);
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

	// Set up hidden preload video
	useEffect(() => {
		setVideoReady(false);
		setShowVideo(false);
		
		const hiddenVideo = hiddenVideoRef.current;
		if (!hiddenVideo) return;
		
		const handleHiddenCanPlay = () => {
			console.log("Hidden video can play");
			setVideoReady(true);
			
			// After 1 second, show the main video
			setTimeout(() => {
				setShowVideo(true);
			}, 1000);
		};
		
		hiddenVideo.addEventListener('canplay', handleHiddenCanPlay);
		
		return () => {
			hiddenVideo.removeEventListener('canplay', handleHiddenCanPlay);
		};
	}, [isMobile]);

	// When main video becomes visible, play it
	useEffect(() => {
		if (showVideo && videoRef.current) {
			videoRef.current.play().catch(error => {
				console.error("Video playback failed:", error);
			});
		}
	}, [showVideo]);

	return (
		<div className="standard-container">
			{/* Hidden video for preloading */}
			<video
				ref={hiddenVideoRef}
				src={isMobile ? mobileVideoUrl : videoUrl}
				preload="auto"
				muted
				playsInline
				style={{ display: "none" }}
			/>
			
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
			{videoReady && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						zIndex: -5,
						opacity: showVideo ? 1 : 0,
						transition: "opacity 2s ease-in-out"
					}}
				>
					<video
						ref={videoRef}
						src={isMobile ? mobileVideoUrl : videoUrl}
						autoPlay
						loop
						muted
						playsInline
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover"
						}}
					/>
				</div>
			)}
			
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
