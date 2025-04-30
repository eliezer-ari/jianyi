import React from "react";
import "./styles/Films.css";

const Films = ({ setNextSection }) => {
	const handleBackToHome = () => {
		setNextSection("Home");
	};

	return (
		<>
			<div className="standard-container">
				<div className="back-arrow-container">
					<button
						style={{ transform: "rotate(270deg) translateX(-8px)" }}
						className="arrow-button"
						onClick={handleBackToHome}
					>
						&#x2303;
					</button>
				</div>
				
				<div className="films-content">
					<h1 className="films-title">Films</h1>
					
					<div className="films-grid">
						<div className="film-item">
							<div className="film-video">
								<iframe 
									src="https://player.vimeo.com/video/1071095870?badge=0&amp" 
									frameBorder="0" 
									allow="autoplay; fullscreen; picture-in-picture" 
									allowFullScreen
									title="Cloud States"
								></iframe>
							</div>
							<div className="film-details">
								<h3>Cloud States (2024)</h3>
								<p>Camera Operator</p>
								<p>Cloud States is a multi-disciplinary performance art work mapping queer migrant belonging.</p>
							</div>
						</div>
						
						<div className="film-item">
							<div className="film-video">
								<iframe 
									src="https://player.vimeo.com/video/1028308992?h=ca71f5af0a" 
									frameBorder="0" 
									allow="autoplay; fullscreen; picture-in-picture" 
									allowFullScreen
									title="Project Two"
								></iframe>
							</div>
							<div className="film-details">
								<h3>Project Two (2023)</h3>
								<p>Director</p>
								<p>A short experimental film exploring themes of identity and belonging.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Films; 