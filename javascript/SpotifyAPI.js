/*******************
    DATA TASKS
********************/

const SpotifyAPI = {};

SpotifyAPI.urlBase = 'https://api.spotify.com';
SpotifyAPI.version = 1;
SpotifyAPI.getUrlBase = () => {
    const {urlBase, version} = SpotifyAPI;
    return urlBase + '/v' + version + '/';

}; // getUrlBase

SpotifyAPI.getUrlString = (endpoint) => {
    return SpotifyAPI.getUrlBase() + endpoint + '/?';
}; // getUrlString

SpotifyAPI.search = (q = reqParam(), type = 'track') => {
    return new Promise((resolve, reject) => {
        const url = SpotifyAPI.getUrlString('search') + 'q=' + q + '&type=' + type;
        
        const http = new XMLHttpRequest();
        http.open('GET', url);

        http.onload = () => {
            const data = JSON.parse(http.responseText);
            resolve(data);
//			console.log(data);
        };

        http.send();
    });
}; // SpotifyAPI.search

