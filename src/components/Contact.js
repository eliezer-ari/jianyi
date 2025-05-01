import React, { useRef, useEffect, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import "./styles/Contact.css";
import "./styles/Standard.css";
import BGImage from "./images/contact/contact.jpg"
import BGImageMobile from "./images/contact/contactmobile.png" // Update with mobile version if available
const Untitled = "https://jianxyi.s3.us-east-1.amazonaws.com/Untitled.mp4"

export default function Contact() {
	const [state, handleSubmit] = useForm("mqaqeyaz");
	const [isMobile, setIsMobile] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const videoRef = useRef(null);
	const videoUrl = Untitled;
	const mobileVideoUrl = Untitled;

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

	// Form content based on submission state
	const renderFormContent = () => {
		if (state.succeeded) {
			return (
				<div className="form-success-container">
					<p className="thank-you-message">Thanks for reaching out!</p>
				</div>
			);
		}

		return (
			<form onSubmit={handleSubmit}>
				<div className="email-section">
					<input
						id="name"
						type="text"
						name="name"
						placeholder="Your Name"
					/>
				</div>
				<div className="email-section">
					<input
						id="email"
						type="email"
						name="email"
						placeholder="Your Email Address"
					/>
				</div>
				<div className="message-section">
					<textarea id="message" name="message" placeholder="Message" />
				</div>
				<ValidationError
					prefix="Message"
					field="message"
					errors={state.errors}
				/>
				<button type="submit" disabled={state.submitting}>
					Submit
				</button>
			</form>
		);
	};

	return (
		<>
		<div className="standard-container">
			{/* Background image (always visible) */}
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
		<div className="contact-container">
			<div className="contact-content">
				<h1>Contact Us</h1>
				<div className="contact-form-container">
					{renderFormContent()}
				</div>
				<div className="copyright">
				<p>© Jian X Yi  <span className="copyright-dash">–</span> {new Date().getFullYear()}</p>
				</div>				
			</div>
		</div>
		</>
	);
}
