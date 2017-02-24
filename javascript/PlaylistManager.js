/*******************
    PLAYLIST MANAGEMENT
********************/

const PlaylistManager = {};

PlaylistManager.tracks = [];

PlaylistManager.currentSong = 0;

PlaylistManager.addTrack = (track = reqParam()) => {
    PlaylistManager.tracks.push(track);
//	PlaylistManager.saveData(PlaylistManager.tracks = "")
}; // PlaylistManager.addTrack

PlaylistManager.removeById = (id) => {
    for (let i = 0; i < PlaylistManager.tracks.length; i++) {
        const track = PlaylistManager.tracks[i];
        if (track.id === id) {
            PlaylistManager.tracks.splice(i, 1);
            break;
        }
    }
}

PlaylistManager.getNextSong = () => {
    PlaylistManager.currentSong++;
    const {tracks, currentSong} = PlaylistManager;

    const len = tracks.length;
    if (currentSong === len) {
        PlaylistManager.currentSong = 0;
    }

    return tracks[PlaylistManager.currentSong].id;
}

//PlaylistManager.saveData = function( data ) {
//	localStorage.setItem('data', JSON.stringify( data ) );
//	console.log(data)
//}
//
//PlaylistManager.loadData = function( data ) {
//	localStorage.getItem('data', JSON.parse( data ) );
//	console.log(data)
//}
//
//window.onload = () => {
//  console.log('happy me on page load');
//	localStorage.getItem('data', JSON.parse( data ) );
//  ;
//};