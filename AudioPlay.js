const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let playback = false;
let audioTitle = null;

async function togglePlayPause() {
	// 1. Get Link
	var url = document.getElementById('yt-url').value;
	var player = document.getElementById('yt-player');

	if (playback) {
		player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
		playback = false;
		setDisplayText("PAUSED");
		return;
	}
	
	if (player.src && player.src.includes("youtube.com/embed/")) {
		player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
		playback = true;
		clearTimeout(idleTimer);
		clearTimeout(idleInterval);
		setDisplayText(audioTitle);
		return;
	}

	// 2. Get Video ID if loading new video
	var videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
			
	if (videoId) {
		// Update videoId
		videoId = videoId.split('&')[0];
		// Update Display Text
		setDisplayText("READING...");
		await wait(1000);
				
		// Update Display Text with Title
		try {
			// Fetch Title
			var response = await fetch("https://noembed.com/embed?url=https://youtube.com/watch?v=" + videoId);
			var data = await response.json();

			if (data.title) {
				setDisplayText(data.title);
				audioTitle = data.title
			} else {
				setDisplayText("PLAYING");
				audioTitle = "PLAYING";
			}
		} catch (err) {
			setDisplayText("ERROR NO TITLE");
			audioTitle = "ERROR NO TITLE";
		}
	
		// Update Player Audio
		player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&enablejsapi=1";
		playback = true;

	} else {
		setDisplayText("ERROR");
		idleScreen();
	}
}

// Stops the audio, but keeps it in memory
function stopAudio() {
	var player = document.getElementById('yt-player');
	
	player.src = "";
	playback = false;
	setDisplayText("STOPPED");
}

// Stops the audio and clears it from memory
function clearAudio() {
	stopAudio();

	var urlInput = document.getElementById('yt-url');
	if (urlInput) {
		urlInput.value = "";
	}

	playback = false;
	setDisplayText("EJECTED");
	idleScreen();
}

// Idle Screen
let idleTimer = null;
let idleInterval = null;

function idleScreen() {
	// Clear
	clearTimeout(idleTimer);
	clearInterval(idleInterval);

	var screenStep = 0;

	idleTimer = setTimeout(() => {
		// Format Current Time
		const formatTime = () => {
			const now = new Date();
			let hours = now.getHours() % 12 || 12;
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
			return `${hours}:${minutes}${ampm}`;
		};
		
		// Format Current Date
		const formatDate = () => {
			const now = new Date();
			const day = now.getDate();
			const month = now.toLocaleString('en-us', { month: 'short' }).toUpperCase();
			return `${day} ${month}`;
		};

		// Update Display with correct text
		const updateDisplay = () => {
			if (screenStep === 0) {
				setDisplayText(formatTime(), true);
			} else if (screenStep === 1) {
				setDisplayText(formatDate(), true);
			} else {
				setDisplayText("ENTER URL", true);
			}
		}

		// Initial Load
		updateDisplay();
		
		// Rotate every 2 secomds
		idleInterval = setInterval(() => {
			screenStep = (screenStep + 1) % 3;
			updateDisplay()
		}, 2000);
	}, 1000);
}

window.addEventListener('DOMContentLoaded', idleScreen);

// Scrolling and Setting Text
let marqueeInterval = null;
let marqueeTimer = null;

function setDisplayText(text, isIdle = false) {
	clearInterval(marqueeInterval);
	clearTimeout(marqueeTimer);
	
	if (!isIdle) {
		clearTimeout(idleTimer);
		clearInterval(idleInterval);
	}

	var displayText = document.getElementById('display-text');
	text = text.toUpperCase();

	// 1. If under 14 characters, no scrolling
	if (text.length <= 14) {
		displayText.textContent = text;
		return;
	}

	// 15+ characters scrolling
	let index = 0;
	displayText.textContent = text.substring(0, 14);

	const startScrolling = () => {
		marqueeInterval = setInterval(() => {
			index++;

			if (index > text.length - 14) {
				clearInterval(marqueeInterval);

				setTimeout(() => {
					index = 0;
					displayText.textContent = text.substring(0, 14);
					setTimeout(startScrolling, 2000); // Loop again
				}, 1000);
				
				return;
			}
			displayText.textContent = text.substring(index, index + 14);
		}, 300);
	};

	marqueeTimer = setTimeout(startScrolling, 2000);
}
	
	
								   
			
	
	
	
	
