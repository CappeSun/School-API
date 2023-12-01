const audioDiv = document.getElementById('audioDiv');
const selectApi = document.getElementById('selectApi');
const fetchGenreBtn = document.getElementById('fetchGenre');
const fetchSoundBtn = document.getElementById('fetchSound');
const genreDisplay = document.getElementById('genreDisplay');

let genres = false;		//Make sure genre is generated before fetchSound() is called

async function fetchGenre(){		//Triggered by the genre button, fills 'genres' with an array of genres
	let response = await fetch(selectApi.value);
	let jsonData = await response.json();

	genreDisplay.textContent = jsonData;
	genres = jsonData.split(" ");
};

async function fetchSound(url){		//Triggered by the sound button, creates audio elements for every sound found
	let response = await fetch(url);
	let jsonData = await response.json();

	if (jsonData.count == 0) return;

	response = await fetch(`https://freesound.org/apiv2/sounds/${jsonData.results[0].id}/?fields=previews&token=95MH6hu4s3bs52oXAegU8YczKAjzSluoDQFsHOUf`);		//Get the audio of the first result
	jsonData = await response.json();

	let audio = document.createElement('audio');
	audio.src = jsonData.previews['preview-hq-ogg'];
	audioDiv.appendChild(audio);
	audio.play();
	audio.addEventListener('ended', () => audio.play());
};

function btnClick(btnEl){
	btnEl.classList.remove('btnClick');
	btnEl.classList.add('btnClick');
	setTimeout(() =>{
		btnEl.classList.remove('btnClick');
	},100);
}

fetchGenreBtn.addEventListener('click', () =>{
	btnClick(fetchGenreBtn);
	fetchGenre();
});

fetchSoundBtn.addEventListener('click', () =>{
	btnClick(fetchSoundBtn);
	audioDiv.textContent = '';
	if (genres){
		genres.forEach((currentValue) =>{
			fetchSound(`https://freesound.org/apiv2/search/text/?query=${currentValue}&token=95MH6hu4s3bs52oXAegU8YczKAjzSluoDQFsHOUf`);
		});
	}
});