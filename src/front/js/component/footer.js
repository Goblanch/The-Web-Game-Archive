import React, { Component } from "react";
import "/workspaces/The-Web-Game-Archive/src/front/styles/index.css";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center footer-background">
		<div className="container">
			<p className="text-white"> Copyright @ The Game Web Archive 2025</p>
		</div>
		<div>
			<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
				<i className="fab fa-instagram fa-2x"></i>
			</a>
			<a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
				<i className="fab fa-youtube fa-2x"></i>
			</a>
			<a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
				<i className="fab fa-x fa-2x"></i>
			</a>
			<a href="https://store.steampowered.com" target="_blank" rel="noopener noreferrer" className="text-white me-4">
				<i className="fab fa-steam fa-2x"></i>
			</a>

		</div>
	</footer>
);
