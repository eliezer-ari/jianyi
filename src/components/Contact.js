import React, { useRef, useEffect, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import "./styles/Contact.css";
import "./styles/Standard.css";
const Untitled = "https://jianxyi.s3.us-east-1.amazonaws.com/Untitled.mp4"

export default function Contact() {
	const [state, handleSubmit] = useForm("mqaqeyaz");
	const desktopVideoRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);
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
		return () => mediaQuery.removeEventListener("change", handleMediaChange);
	}, []);

	// Attempt to play video when mounted or when `isMobile` changes
	useEffect(() => {
		const video = desktopVideoRef.current;
		if (video) {
			console.log("Attempting to play video directly on mount/change.");

			video
				.play()
				.then(() => {
					console.log("Video playback successful.");
				})
				.catch((error) => {
					console.error("Video playback failed:", error);
				});
		}
	}, [isMobile]);

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
						placeholder="Name"
					/>
				</div>
				<div className="email-section">
					<input
						id="email"
						type="email"
						name="email"
						placeholder="Email Address"
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
				<video
					ref={desktopVideoRef}
					src={isMobile ? mobileVideoUrl : videoUrl}
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					className={isMobile ? "video-background-mobile" : "video-background"}
				/>
				{/* <button className="view-reel-button" onClick={handleViewReelClick}>
					View Reel
				</button> */}
			</div>
		<div className="contact-container">
			<div className="contact-content">
				<h1>Contact me</h1>
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
