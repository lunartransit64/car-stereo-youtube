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
		displayText.textContent = "READING...";
				
		// Wait 1 second as a delay
		await wait(1000);
				
		// Update Display Text with Title
		try {
			// Fetch Title
			var response = await fetch("https://noembed.com/embed?url=https://youtube.com/watch?v=" + videoId);
			var data = await response.json();

			if (data.title) {
				displayText.textContent = data.title.toUpperCase();
			} else {
				displayText.textContent = "PLAYING";
			}
		} catch (err) {
			displayText.textContent = "PLAYING";
		}
	
		// Update Player Audio
		player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&enablejsapi=1"

	} else {
		displayText.textContent = "ERROR";
		idleScreen();
	}
}

// Stops the audio, but keeps it in memory
function stopAudio() {
	var player = document.getElementById('yt-player');
	var displayText = document.getElementById('display-text');
	
	player.src = "";

	displayText.textContent = "STOPPED";
}

// Stops the audio and clears it from memory
function clearAudio() {
	stopAudio();

	var urlInput = document.getElementById('yt-url');
	if (urlInput) {
		urlInput.value = "";
	}
	
	var displayText = document.getElementById('display-text');
	displayText.textContent = "CLEARED";

	idleScreen();
}

// Idle Screen
let idleTimer = null;
let idleInterval = null;

function idleScreen() {
	// Clear
	clearTimeout(idleTimer);
	clearInterval(idleInterval);

	var displayText = document.getElementById('display-text');
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

		displayText.textContent = formatTime();

		// Rotate every 3 secomds
		idleInterval = setInterval(() => {
			showTime = !showTime;
			displayText.textContent = showTime ? formatTime() : "ENTER URL";
		}, 3000);
	}, 1000);
}

window.addEventListener('DOMContentLoaded', idleScreen);
								   
			
	
	
	
	
