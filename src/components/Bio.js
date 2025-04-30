import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
// import "./styles/PastProjects.css";
import "./styles/Navbar.css";
import "./styles/Bio.css";
import Contact from "./Contact";
// Remove unused imports
import BGImage from "./images/bio/bio.jpg" // You'll need to add this image
import BGImageMobile from "./images/bio/biomobile.jpg" // You'll need to add this image
const Magic = "https://jianxyi.s3.us-east-1.amazonaws.com/MagicTheatre.mp4"

const Bio = ({ setNextSection }) => {
	const videoUrl = Magic;
	const mobileVideoUrl = Magic;

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
			
			// Pause the video when component unmounts
			if (hiddenVideo) {
				hiddenVideo.pause();
				hiddenVideo.currentTime = 0;
			}
			
			// Also pause main video on unmount
			if (videoRef.current) {
				videoRef.current.pause();
				videoRef.current.currentTime = 0;
			}
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
	
	const handleBackToHome = () => {
		setNextSection("Home");
	};

	// Handle "View Reel" button click to open the desktop video in a new tab
	const handleViewReelClick = () => {
		window.open(videoUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<>
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
			</div>
			<div className="bio-container">
				<div className="bio-content">
					<div className="bio-text">
						<h3>Bio – Jian X Yi</h3>
						<p>
						Through Jian Yi's multidisciplinary work of performance art/contemporary dance, video art/photography, new genres, installation art and social sculpture – they seek to explore the experiential trauma of marginalised persons within our society, such as neurodiverse and queer people of colour, and how we reflect on the broader human condition. Their practice is rooted in an ongoing enquiry into the ambiguities of emotional experience, and touches upon borderline states – considering Otherness, neurodivergence and alternative states of consciousness/being – in line with their continuing research focus on queer mental health. Questions around social normalcy and the figure of the 'social outsider' – often takes precedence in their work, estranging everyday realities through intensified mental and emotional states. Their projects are a multi-sensory exploration of unconscious dream states – seeking collective experiences of contemporary queer ritual.</p>
						<p>Jian Yi's work has been performed/exhibited internationally in locations such as New Museum, The Kitchen NYC, ACMI Melbourne, Buddies in Bad Times Toronto, Contact Manchester, CPT London, DanceLive Aberdeen, Summerhall, Dance Base Edinburgh, Tramway and Centre for Contemporary Arts Glasgow. They have received funding awards and have been selected for international artist residencies including with Cove Park, Tramway, Unlimited, Dance4, Dance Base, Made in Scotland at the Edinburgh Festival Fringe/Summerhall, Take Me Somewhere Festival/Work Room Glasgow, Creative Scotland, NTS, Live Art Development Agency London, Movement Research NYC, Brooklyn Arts Council, Theatertreffen Berlin, People's History Museum Manchester and Seventh Gallery Melbourne, among others. In 2023, they curated/produced the highly-anticipated second edition of Journey to the East Festival (<a href="https://www.jttefest.com" target="_blank" rel="noopener noreferrer">www.jttefest.com</a>) – featuring performing artists including Matt Mullican, Sung Im Her, River Lin and Keioui Keijaun Thomas.</p>									</div>
				</div>
			</div>
		</>
	);
};

export default Bio;
