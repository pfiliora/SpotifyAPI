function reqParam() {
    throw new Error('This is a required param!');
}

(function() {

	const validateSearch = (value) => {
        return new Promise((resolve, reject) => {
            if (value.trim() === "") {
                reject('Input a value');
            }
            resolve(value);
        });
    };

    const addTrackToHTML = (track) => {
        const {name, preview_url, id, album, artists} = track;
        const imageUrl = album.images[1].url;
		const artistName = artists[0].name;

        const div = document.createElement('div');
        div.classList.add('ui', 'card');
        div.innerHTML = getCardMarkup(name, preview_url, id, album, imageUrl, artistName, false);
        results.appendChild(div);
		
		const addToPlaylistBtn = div.querySelector('.js-add-playlist')

        addToPlaylistBtn.addEventListener('click',() => {
            PlaylistManager.addTrack(track);
            const currentIndex = PlaylistManager.tracks.length - 1;
 
			
            const playlistTrack = document.createElement('div');
            playlistTrack.classList.add('item', 'playlist-track', 'trackid-' + id);
            playlistTrack.innerHTML = `				
				<div class="ui tiny image">
				  <img src="${imageUrl}">
				</div>
				<div>
					<a href="#" class="playlist-close js-playlist-close" data-tooltip="Remove from playlist." data-position="top right" data-inverted="">
						<i class="icon remove"></i>	
					</a>
					<div class="middle aligned content playlist-content">
				  		&nbsp${name} - ${artistName}
					</div>
					<audio controls style="width: 175px;">
						<source src="${preview_url}">
					</audio>
				</div>
            `;

            playlist.appendChild(playlistTrack);

            const audio = playlistTrack.querySelector('audio');

            audio.addEventListener('play', () => {
                PlaylistManager.currentSong = currentIndex;
            });

            audio.addEventListener('ended', () => {
                console.log('done!');
                const nextTrackId = PlaylistManager.getNextSong();

                setTimeout(() => {
                    document.querySelector(`.trackid-${nextTrackId} audio`).play();
                }, 50); 
            });

           const closeBtn = playlistTrack.querySelector('.js-playlist-close');
           closeBtn.addEventListener('click', () => {
                if (PlaylistManager.currentSong === currentIndex) {
                    const nextTrackId = PlaylistManager.getNextSong();

                    setTimeout(() => {
                        document.querySelector(`.trackid-${nextTrackId} audio`).play();
                    }, 500);
                }
                PlaylistManager.removeById(id);

                playlist.removeChild(playlistTrack);
           });
        });

		const audio = new Audio(preview_url);
		const uiPlayButton = div.querySelector('.playButton');
		uiPlayButton.classList.add('video', 'play', 'outline', 'icon', 'playButton', 'huge');
		uiPlayButton.addEventListener('click', ()=>{
			if(audio.paused === true){
				audio.play();
				uiPlayButton.classList.remove('play');
				uiPlayButton.classList.add('pause', 'circle');
			}else{
				audio.pause();
				uiPlayButton.classList.remove('pause', 'circle');
				uiPlayButton.classList.add('play');
			}
		});
    };

    const button = document.querySelector('.js-search');
    const input = document.querySelector('.js-input');
    const results = document.querySelector('.js-searchresult');
    const playlist = document.querySelector('.js-playlist');
	
    const getCardMarkup = (name, preview_url, id, album, imageUrl, artistName) => {			
        let html = `
				<div class="image">
					<img src="${imageUrl}">
					<i class="video play outline icon playButton huge"></i></div>
				</div>
				<div class="content">
					<a class="header">${name} - ${artistName}</a><div class="meta">
					<span class="date">${album.name}</span>
				</div>
				</div>
				<div class="extra content">
					<a>
						<i class="add icon js-add-playlist">Add to playlist</i>
					</a>
				`;
       return html;
    };
	
	const showSearched = (query) => {	
		const searchTitle = document.querySelector('.js-searchTitle')
		searchTitle.innerHTML = 'Search Results for ' + query + '...'
    };
									   
    const runSearchQuery = () => {
        const {value} = input;

        validateSearch(value)
            .then((query) => {
                console.log('about to search for: ', query);

                input.value = '';
                input.setAttribute('disabled', 'disabled');
                button.setAttribute('disabled', 'disabled');

				showSearched(query);
                return SpotifyAPI.search(query);
            })
            .then((data) => {
                input.removeAttribute('disabled');
                button.removeAttribute('disabled');
                results.innerHTML = "";				
				
                const tracks = data.tracks.items;
                for(const track of tracks) {
                    addTrackToHTML(track);
                }

            })
            .catch((e) => {
                alert(e);
            });
    }

    /***

        APP INITIATER

    ***/

    button.addEventListener('click', (e) => runSearchQuery());
    input.addEventListener('keydown', (e) => {
        const {keyCode, which} = e;
        if (keyCode === 13 || which === 13) {
           runSearchQuery();
        }
    });

})();