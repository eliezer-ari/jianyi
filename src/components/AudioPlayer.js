// AudioPlayer.js
import React from "react";

const AudioPlayer = () => {
	return (
		<div
			style={{
				position: "relative",
				paddingTop: "56.25%" /* Aspect ratio 16:9 */,
			}}
		>
			<iframe
				title="SoundCloud Player"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "90vw",
					height: "100%",
					borderRadius: "8px",
				}}
				scrolling="no"
				frameBorder="no"
				// allow="autoplay"
				src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1902859727&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
			></iframe>
			<div
				style={{
					fontSize: "10px",
					color: "#403e20",
					lineBreak: "anywhere",
					wordBreak: "normal",
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
					fontFamily:
						"Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif",
					fontWeight: 100,
					textAlign: "center",
					marginTop: "5px",
				}}
			>
				<a
					href="https://soundcloud.com/ashiira"
					title="ASHIRA"
					target="_blank"
					rel="noopener noreferrer"
					style={{ color: "#cccccc", textDecoration: "none" }}
				>
					ASHIRA
				</a>{" "}
				·{" "}
				<a
					href="https://soundcloud.com/ashiira/sets/ashira"
					title="ASHIRA"
					target="_blank"
					rel="noopener noreferrer"
					style={{ color: "#cccccc", textDecoration: "none" }}
				>
					ASHIRA
				</a>
			</div>
		</div>
	);
};

export default AudioPlayer;
