const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function playAudio() {
	// 0. Clear Values
	clearTimeout(idleTimer);
	clearInterval(idleInterval);
	
	// 1. Get Link
	var url = document.getElementById('yt-url').value;
	var displayText = document.getElementById('display-text');
	var player = document.getElementById('yt-player');

	// 2. Get Video ID
	var videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
			
	if (videoId) {
		// Update Display Text
		setDisplayText("READING...");
				
		// Wait 1 second as a delay
		await wait(1000);
				
		// Update Display Text with Title
		try {
			// Fetch Title
			var response = await fetch("https://noembed.com/embed?url=https://youtube.com/watch?v=" + videoId);
			var data = await response.json();

			if (data.title) {
				setDisplayText(data.title);
			} else {
				setDisplayText("PLAYING");
			}
		} catch (err) {
			setDisplayText("ERROR NO TITLE");
		}
	
		// Update Player Audio
		player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&enablejsapi=1";

	} else {
		setDisplayText("ERROR");
		idleScreen();
	}
}

// Stops the audio, but keeps it in memory
function stopAudio() {
	var player = document.getElementById('yt-player');
	
	player.src = "";
	setDisplayText("STOPPED");
}

// Stops the audio and clears it from memory
function clearAudio() {
	stopAudio();

	var urlInput = document.getElementById('yt-url');
	if (urlInput) {
		urlInput.value = "";
	}

	setDisplayText("CLEARED");
	idleScreen();
}

// Idle Screen
let idleTimer = null;
let idleInterval = null;

function idleScreen() {
	// Clear
	clearTimeout(idleTimer);
	clearInterval(idleInterval);

	var showTime = true;

	idleTimer = setTimeout(() => {
		// Format Current Time
		const formatTime = () => {
			const now = new Date();
			let hours = now.getHours() % 12 || 12;
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
			const day = now.getDate();
			const month = now.toLocaleString('en-us', { month: 'short' }).toUpperCase();
			return `${hours}:${minutes}${ampm} - ${day} ${month}`;
		};

		setDisplayText(formatTime());

		// Rotate every 3 secomds
		idleInterval = setInterval(() => {
			showTime = !showTime;
			setDisplayText(showTime ? formatTime() : "ENTER URL");
		}, 3000);
	}, 1000);
}

window.addEventListener('DOMContentLoaded', idleScreen);

// Scrolling and Setting Text
let marqueeInterval = null;

function setDisplayText(text) {
	clearInterval(marqueeInterval);
	clearTimeout(idleTimer);
	clearInterval(idleInterval);

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
					startScrolling(); // Loop again
				}, 1000);
				
				return;
			}
			displayText.textContent = text.substring(index, index + 14);
		}, 300);
	};
}
	
	
								   
			
	
	
	
	
