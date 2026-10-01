const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function playAudio() {
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
	}
}

function stopAudio() {
	var player = document.getElementById('yt-player');
	var displayText = document.getElementById('yt-player');

	player.src = "";

	displayText.textContent = "STOPPED";
}
