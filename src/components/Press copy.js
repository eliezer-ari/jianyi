import React, { useState, useEffect, useRef } from "react";
import "./styles/Standard.css";
import "./styles/Press.css";
import { Volume2, VolumeX } from "lucide-react";

import BGImage from "./images/press/press.jpg"
import BGImageMobile from "./images/press/pressmobile.jpg"
const Fire = "https://jianxyi.s3.us-east-1.amazonaws.com/Fire.mp4"

const Press = ({ setNextSection }) => {
	// Function to handle back to home navigation with animation
	const handleBackToHome = () => {
		setNextSection("Home"); // Set nextSection to "Home" to trigger the animation
	};

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
				<h1>Selected Press</h1>
				<div className="press-items">
					{/* Edinburgh Fringe Features */}
					<a href="https://www.theskinny.co.uk/festivals/edinburgh-fringe/theatre/soul-connections" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Soul Connections - Jian Yi on Weathervanes</h3>
						<p>- Feature by Isabella Thompson, The Skinny</p>
					</a>

					<a href="https://everything-theatre.co.uk/2023/08/review-weathervanes-edfringe/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Review: Weathervanes, EdFringe</h3>
						<p>- By Marianna Meloni, Everything Theatre</p>
					</a>

					<a href="https://totaltheatre.org.uk/our-bodies-our-selves-ed-fringe-2023/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Our Bodies, Our Selves – Ed Fringe 2023 Review</h3>
						<p>- By Dorothy Max Prior, Total Theatre</p>
					</a>

					<a href="https://www.thetimes.com/culture/theatre-dance/article/unmissable-circus-physical-theatre-and-dance-acts-at-edinburgh-festival-fz66r2sbq?region=global" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>13 spectacular circus, physical theatre and dance acts at Edinburgh Festival</h3>
						<p>- By Ashley Davies, The Times</p>
					</a>

					<a href="https://www.edfringe.com/about-us/news-and-blog/2023-made-in-scotland-showcase-programme-revealed/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>2023 Made in Scotland Showcase programme revealed</h3>
						<p>- Ed Fringe</p>
					</a>

					<a href="https://www.scotsman.com/whats-on/arts-and-entertainment/edinburgh-festival-fringe-dancing-and-club-culture-takes-centre-stage-in-summerhall-programme-4130212?r=663" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Edinburgh Festival Fringe: Dancing and club culture takes centre stage</h3>
						<p>- By Brian Ferguson, The Scotsman</p>
					</a>

					<a href="https://theqr.co.uk/2023/05/04/summerhall-festival-programme-2023-a-celebration-of-diversity-and-cultural-exchange/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Summerhall Festival Programme 2023: A celebration of diversity</h3>
						<p>- By WJ Quinn, The Quinntessential Review</p>
					</a>

					{/* start here */}

					<a href="https://www.thestage.co.uk/news/recipients-of-annual-eclipse-award-revealed" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Recipients of annual Eclipse Award revealed</h3>
						<p>- By Gemma Nettle, The Stage</p>
					</a>

					<a href="https://theatreweekly.com/eclipse-theatre-and-summerhall-announce-six-eclipse-award-winners-performing-at-edinburgh-festival-fringe/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Eclipse Theatre and Summerhall Announce Six Eclipse Award Winners</h3>
						<p>- Theatre Weekly</p>
					</a>

					<a href="https://open.spotify.com/episode/3N6m4yLL3EarHq6jbu6zUq?si=e_u5zfIxSpeEy8cN7dm5yQ&nd=1&dlsi=541da4a2c1ee4598" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Jian Yi - On The Road to Fringe</h3>
						<p>- Podcast with Rebecca Donati, Theatre Scotland</p>
					</a>

					<a href="https://fringereview.co.uk/fringefestivals/edinburgh-fringe-2/general/2023/jo-tomalins-list-of-performance-art-and-installation-at-edinburgh-fringe-2023/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Jo Tomalin's List of Performance Art and Installation at Edinburgh Fringe 2023</h3>
						<p>- By Jo Tomalin, FringeReview</p>
					</a>

					<a href="https://todolist.london/50-unmissable-shows-at-edinburgh-fringe-2023" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>50 Unmissable Shows at Edinburgh Fringe 2023</h3>
						<p>- To Do List London</p>
					</a>

					<a href="https://theatreweekly.com/16-emerging-theatre-companies-to-see-at-edinburgh-fringe-2023/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>16 Emerging Theatre Companies to See at Edinburgh Fringe 2023</h3>
						<p>- By Greg Stewart, Theatre Weekly</p>
					</a>

					{/* Journey to the East Features */}
					<a href="https://www.thenational.scot/news/23794951.journey-east-festival-coming-glasgow/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Journey to the East Festival coming to Glasgow</h3>
						<p>- Feature by Donald C Stewart, The National</p>
					</a>

					<a href="https://soundcloud.com/clydebuiltradio/journey-to-the-east-invites-u" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Journey to the East - Clyde Built Radio</h3>
						<p>- Radio Segment with Gareth K Vile, Clyde Built Radio</p>
					</a>

					<a href="https://www.glasgowtimes.co.uk/lifestyle/lifestyle/23785693.journey-east-festival-returning-glasgow/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Journey To The East festival returning to Glasgow</h3>
						<p>- By Morgan Carmichael, Glasgow Times</p>
					</a>

					<a href="https://www.heraldscotland.com/life_style/arts_ents/23814930.cultural-journeys-touch-heart-stir-imagination/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Cultural journeys to touch the heart and stir the imagination</h3>
						<p>- By Teddy Jamieson, The Herald</p>
					</a>

					<a href="https://www.theskinny.co.uk/things-to-do/scotland/whats-on-scotland-22-29-sep-spit-it-out-festival-more" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>What's On Scotland 22-29 Sep: Spit It Out Festival & more</h3>
						<p>- By Anahit Behrooz, The Skinny</p>
					</a>

					<a href="https://www.theskinny.co.uk/festivals/uk-festivals/jian-yi-on-journey-to-the-east" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Collective Rituals: Jian Yi on new performance festival Journey to the East</h3>
						<p>- Feature by Katie Goh, The Skinny</p>
					</a>

					<a href="https://soundcloud.com/clydebuiltradio/journey-to-the-east-festival" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Journey to the East - Festival Preview</h3>
						<p>- Radio Segment with Arusa Qureshi, Clyde Built Radio</p>
					</a>

					<a href="https://www.thenational.scot/news/19466984.journey-east-asian-artists-heart-new-scottish-festival/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Journey to the East: Asian artists at heart of new Scottish festival</h3>
						<p>- By Nan Spowart, The National</p>
					</a>

					<a href="https://thetempohouse.wordpress.com/2021/08/31/review-journey-to-the-east-festival/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Review: Journey To The East Festival</h3>
						<p>- By Lorna Irvine, The Tempo House</p>
					</a>

					<a href="https://artmag.co.uk/take-a-journey-to-your-inner-east/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Take a Journey to the Inner 'East'</h3>
						<p>- By David White, ArtMag</p>
					</a>

					<a href="https://ocula.com/magazine/art-news/journey-to-the-east-performance-art-festival/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Journey to the East Performance Art Festival Arrives in Glasgow This Summer</h3>
						<p>- By Sam Gaskin, Ocula</p>
					</a>

					<a href="https://www.a-n.co.uk/news/now-showing-this-months-must-see-exhibitions-3/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Now Showing: This month's must see exhibitions</h3>
						<p>- By Jack Hutchinson, a-n</p>
					</a>

					{/* Other Features */}
					<a href="https://www.bbc.co.uk/programmes/m000zb6d" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>BBC Scotland: Edinburgh Unlocked</h3>
						<p>- Episode 3 Broadcast, BBC</p>
					</a>

					<a href="https://www.scotsman.com/whats-on/arts-and-entertainment/festival-diary-how-did-east-lothian-become-the-new-festival-hotspot-3329021" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Festival Diary: How did East Lothian become the new festival hotspot?</h3>
						<p>- By Brian Ferguson, The Scotsman</p>
					</a>

					<a href="https://thetempohouse.wordpress.com/2019/11/10/jian-yi-talks-magic-theatre/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Jian Yi talks Magic Theatre</h3>
						<p>- By Gareth K Vile, The Tempo House</p>
					</a>

					<a href="https://exeuntmagazine.com/reviews/review-magic-theatre-cca-glasgow/" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Review: Magic Theatre – [scenes from the unconscious] at CCA, Glasgow</h3>
						<p>- By Andrew Edwards, Exeunt Magazine</p>
					</a>

					<a href="https://www.huffpost.com/entry/displacement-and-longing-jian-yi-exhibits-his-unique_b_5a255d00e4b0545e64bf9527" target="_blank" rel="noopener noreferrer" className="press-item">
						<h3>Displacement and Longing - Jian Yi exhibits his unique vision for 'In Time/ Out of Place'</h3>
						<p>- By Audra Lambert, Huffington Post</p>
					</a>
				</div>
			</div>
		</>
	);
};

export default Press;
