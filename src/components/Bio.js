import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
// import "./styles/PastProjects.css";
import "./styles/Navbar.css";
import "./styles/Bio.css";
import Contact from "./Contact";

import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
// Remove unused imports
import BGImage from "./images/bio/bio.jpg" // You'll need to add this image
import BGImageMobile from "./images/bio/biomobile.jpg" // You'll need to add this image
const Magic = "https://jianxyi.s3.us-east-1.amazonaws.com/MagicTheatre.mp4"


const options = {
	renderMark: {
	  [MARKS.BOLD]: (text) => <span className="font-bold">{text}</span>,
	  [MARKS.ITALIC]: (text) => <span className="italic">{text}</span>,
	},
	renderNode: {
	  [BLOCKS.PARAGRAPH]: (node, children) => (
		<p className="mb-4 text-lg font-pp-light">{children}</p>
	  ),
	  [BLOCKS.HEADING_2]: (node, children) => (
		<h2 className="text-3xl font-clash-regular mb-4 mt-8">{children}</h2>
	  ),
	  [BLOCKS.HEADING_3]: (node, children) => (
		<h3 className="text-2xl font-clash-regular mb-3 mt-6">{children}</h3>
	  ),
	  [BLOCKS.UL_LIST]: (node, children) => (
		<ul className="list-disc ml-6 mb-4 font-pp-light">{children}</ul>
	  ),
	  [BLOCKS.OL_LIST]: (node, children) => (
		<ol className="list-decimal ml-6 mb-4 font-pp-light">{children}</ol>
	  ),
	  [BLOCKS.LIST_ITEM]: (node, children) => (
		<li className="mb-2">{children}</li>
	  ),
	  [BLOCKS.QUOTE]: (node, children) => (
		<blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 font-pp-light">{children}</blockquote>
	  ),
	  'embedded-asset-block': (node) => (
		<div className="my-8">
		  <img 
			className="w-full" 
			src={`https:${node.data.target.fields.file.url}`}
			alt={node.data.target.fields.description || ''}
		  />
		</div>
	  ),
	  [INLINES.HYPERLINK]: (node, children) => (
		<a 
		  href={node.data.uri}
		  className="text-blue-600 hover:underline font-pp-light"
		  target="_blank"
		  rel="noopener noreferrer"
		>
		  {children}
		</a>
	  ),
	}
  }

const Bio = ({ setNextSection, data }) => {
	const videoUrl = Magic;
	const mobileVideoUrl = Magic;

	// console.log("Data prop in Bio:", data); // For debugging
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
	
	const handleBackToHome = () => {
		setNextSection("Home");
	};

	// Handle "View Reel" button click to open the desktop video in a new tab
	const handleViewReelClick = () => {
		window.open(videoUrl, "_blank", "noopener,noreferrer");
	};

	// Conditional rendering: if data or data.fields is not available, show loading or return null
	if (!data || !data.fields) {
		return <p>Loading bio...</p>; // Or return null, or a more sophisticated loading spinner
	}

	// Now it's safe to access data.fields
	const { bioHeader, bioContent } = data.fields; // Assuming these fields exist

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
				<div 
					className="dark-overlay" 
					style={{ zIndex: -1 }}
				/>
			</div>
			<div className="bio-container">
				<div className="bio-content">
					<div className="bio-text">
						<h3>{bioHeader}</h3>
						{bioContent && documentToReactComponents(bioContent, options)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Bio;
