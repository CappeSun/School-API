const audioDiv = document.getElementById('audioDiv');
const selectApi = document.getElementById('selectApi');
const fetchGenreBtn = document.getElementById('fetchGenre');
const fetchSoundBtn = document.getElementById('fetchSound');
const genreDisplay = document.getElementById('genreDisplay');

let genres = false;		//Make sure genre is generated before fetchSound() is called

async function fetchGenre(){		//Triggered by the genre button, fills 'genres' with an array of genres
	let response = await fetch(selectApi.value);
	let jsonData = await response.json();

	genreDisplay.textContent = jsonData;		//Prepares data for sound searching
	genres = jsonData.split(" ");
};

async function fetchSound(url){		//Triggered by the funky button, creates audio elements for every sound found
	let response = await fetch(url);
	let jsonData = await response.json();

	if (jsonData.count == 0) return;		//If no results are found, exit the function

	response = await fetch(`https://freesound.org/apiv2/sounds/${jsonData.results[0].id}/?fields=previews&token=95MH6hu4s3bs52oXAegU8YczKAjzSluoDQFsHOUf`);		//Get the audio of the first result
	jsonData = await response.json();

	let audio = document.createElement('audio');
	audio.src = jsonData.previews['preview-hq-ogg'];		//Set audio source to .ogg hosted at freesound
	audioDiv.appendChild(audio);
	audio.play();
	audio.addEventListener('ended', () => audio.play());		//Keep audio looping
};

function aniBtnClick(btnEl){		//Animate button click
	btnEl.classList.remove('btnClick');
	btnEl.classList.add('btnClick');
	setTimeout(() =>{
		btnEl.classList.remove('btnClick');
	},100);
}

fetchGenreBtn.addEventListener('click', () =>{
	aniBtnClick(fetchGenreBtn);
	fetchGenre();
});

fetchSoundBtn.addEventListener('click', () =>{
	aniBtnClick(fetchSoundBtn);
	if (genres){
		audioDiv.textContent = '';		//Remove previous audio elements

		genres.forEach((currentValue) =>{
			fetchSound(`https://freesound.org/apiv2/search/text/?query=${currentValue}&token=95MH6hu4s3bs52oXAegU8YczKAjzSluoDQFsHOUf`);
		});

		genres = false;		//Reset genres to prevent spamming freesound
	}
});