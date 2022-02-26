import React, { useState, useEffect } from 'react';
import './css/search-result.css';
import play_button from '../images/play-button-4.png';
import singer from '../images/singer.png';
import { player_id } from './Player.jsx';
import { useNavigate  } from 'react-router-dom';
import { useWindowDimensions } from '../functions/custom-hook';
import { useLoading, Bars } from '@agney/react-loading';

const axios = require('axios');

const SearchResult = (props) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [top3Tracks, setTop3Tracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState({});
    const { height, width } = useWindowDimensions();

    const [maxObtainTrack, setMaxObtainTrack] = useState(0);
    const [maxObtainAlbum, setMaxObtainAlbum] = useState(0);
    const [maxObtainArtist, setMaxObtainArtist] = useState(0);
    const [maxObtainPlaylist, setMaxObtainPlaylist] = useState(0);

    const [arrTrackEightCard, setArrTrackEightCard] = useState([]);
    const [arrAlbumEightCard, setArrAlbumEightCard] = useState([]);
    const [arrArtistEightCard, setArrArtistEightCard] = useState([]);
    const [arrPlaylistEightCard, setArrPlaylistEightCard] = useState([]);

    const navigate = useNavigate();

    const { containerProps, indicatorEl } = useLoading({
        loading: isLoading,
        indicator: <Bars width="50" />
    });

    useEffect(() => {
        setSearch(props.search);
    })

    // GET search result
    useEffect(() => {
        const queryTrack = async () => {
            const response = await axios.get('https://api.spotify.com/v1/search',
            { 
                params: {q: search, type: 'album,track,artist,playlist', limit: 12},
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response);

            setTop3Tracks([]);
            setArrTrackEightCard([]);
            setArrAlbumEightCard([]);
            setArrArtistEightCard([]);
            setArrPlaylistEightCard([]);

            let track_list = await response.data.tracks.items;
            let album_list = await response.data.albums.items;
            let artist_list = await response.data.artists.items;
            let playlist_list = await response.data.playlists.items;

            // GET track info
            for (let i in track_list) {
                if (i < 3) {
                    let image_url = (track_list[i].album.images).length == 0 ? singer : track_list[i].album.images[0].url;
                    setTop3Tracks(prev => [...prev, {
                        'track': {
                            'name': track_list[i].name,
                            'id': track_list[i].id,
                            'track_number': track_list[i].track_number - 1,
                            'uri': track_list[i].uri
                        },
                        'image': image_url,
                        'album': {
                            'name': track_list[i].album.name,
                            'release_date': track_list[i].album.release_date,
                            'total_tracks': track_list[i].album.total_tracks,
                            'uri': track_list[i].album.uri
                        },
                        'artist': {
                            'name': track_list[i].artists[0].name,
                            'id': track_list[i].artists[0].id,
                            'uri': track_list[i].artists[0].uri,
                            'api': track_list[i].artists[0].href
                        }
                    }])
                } else {
                    let image_url = (track_list[i].album.images).length == 0 ? singer : track_list[i].album.images[0].url;
                    setMaxObtainTrack(parseInt(i) - 2)
                    setArrTrackEightCard(prev => [...prev, {
                        'track': {
                            'name': track_list[i].name,
                            'id': track_list[i].id,
                            'track_number': track_list[i].track_number - 1,
                            'uri': track_list[i].uri
                        },
                        'image': image_url,
                        'album': {
                            'name': track_list[i].album.name,
                            'release_date': track_list[i].album.release_date,
                            'total_tracks': track_list[i].album.total_tracks,
                            'uri': track_list[i].album.uri
                        },
                        'artist': {
                            'name': track_list[i].artists[0].name,
                            'id': track_list[i].artists[0].id,
                            'uri': track_list[i].artists[0].uri,
                            'api': track_list[i].artists[0].href
                        }
                    }]);
                }          
            }

            // GET album info
            for (let i in album_list) {
                let image_url = (album_list[i].images).length == 0 ? singer : album_list[i].images[0].url;
                setMaxObtainAlbum(parseInt(i) + 1);
                setArrAlbumEightCard(prev => [...prev, {
                    'artist': {
                        'name': album_list[i].artists[0].name,
                        'id': album_list[i].artists[0].id,
                        'uri': album_list[i].artists[0].uri
                    },
                    'image': image_url,
                    'album': {
                        'name': album_list[i].name,
                        'id': album_list[i].id,
                        'release_date': album_list[i].release_date,
                        'total_tracks': album_list[i].total_tracks,
                        'uri': album_list[i].uri
                    }
                }]);
            }

            // GET artist info
            for (let i in artist_list) {
                let image_url = (artist_list[i].images).length == 0 ? singer : artist_list[i].images[0].url;
                setMaxObtainArtist(parseInt(i) + 1);
                setArrArtistEightCard(prev => [...prev, {
                    'artist': {
                        'name': artist_list[i].name,
                        'id': artist_list[i].id,
                        'uri': artist_list[i].uri,
                        'popularity': artist_list[i].popularity
                    },
                    'image': image_url,
                    'genres': artist_list[i].genres,
                    'followers': artist_list[i].followers.total
                }]);
            }

            // GET playlist info
            for (let i in playlist_list) {
                let image_url = (playlist_list[i].images).length == 0 ? singer : playlist_list[i].images[0].url;
                setMaxObtainPlaylist(parseInt(i) + 1);
                setArrPlaylistEightCard(prev => [...prev, {
                    'playlist': {
                        'name': playlist_list[i].name,
                        'id': playlist_list[i].id,
                        'description': playlist_list[i].description,
                        'uri': playlist_list[i].uri,
                        'snapshot_id': playlist_list[i].snapshot_id,
                        'total_tracks': playlist_list[i].tracks.total
                    },
                    'image': image_url,
                    'owner': {
                        'name': playlist_list[i].owner.display_name,
                        'id': playlist_list[i].owner.id,
                        'uri': playlist_list[i].owner.uri,
                        'api': playlist_list[i].owner.href
                    }
                }]);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 2000)
        }


        const runningSteps = () => {
            return new Promise((resolve, reject) => {
                let run = queryTrack();
                if (run) {
                    resolve(console.log('Query Search Done!'));
                } else {
                    reject(console.log('Query search Failed!'))
                }
            })
        }

        if (search !== '') {
            let processes = runningSteps();
            processes.then('Succes to run').catch('Failed to then!');

        } else {
            console.log('Empty Query Field');
        }        
    }, [search])


    // PUT request
    useEffect(() => {
        const putRequest = async () => {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedTrack.uri,
                "offset": {
                    "position": selectedTrack.track_number
                },
                "position_ms": 0
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response);
        }

        if (selectedTrack !== {}) {
            putRequest();
        } else {
            console.log('Empty selected track.');
        }
        

    }, [selectedTrack])


    if (isLoading) {
        return (
            <div className='loading-container'>
                <section {...containerProps} className='loading'>
                    {indicatorEl} {/* renders only while loading */}
                </section>
            </div>
        )
    } else {
        if (width < 600) {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} />
                                                </div>
                                            </div>
                                            <div className='box-top-3__text'>
                                                <p className='box-top-3__song-name-result'>{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.slice(0, 2).length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.slice(0, 2).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result'>{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.slice(0, 2).length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.slice(0, 2).map(elem => 
                                (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artists</h5>
                                    {arrArtistEightCard.slice(0, 2).length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.slice(0, 2).map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.slice(0, 2).length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.slice(0, 2).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div> 
                    }
                </div>
            )
        } else if (width < 800) {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} className='top-3-image'/>
                                                </div>
                                            </div>
                                            <div className='box-top-3__text'>
                                                <p className='box-top-3__song-name-result'>{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.slice(0, 3).length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.slice(0, 3).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result'>{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.slice(0, 3).length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.slice(0, 3).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artists</h5>
                                    {arrArtistEightCard.slice(0, 3).length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.slice(0, 3).map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        : 
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.slice(0, 3).length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.slice(0, 3).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div> 
                    }
                </div>
            )
        } else if (width < 1100) {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className='box-top-3__song-name-result'>{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.slice(0, 4).length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.slice(0, 4).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result'>{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0 
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.slice(0, 4).length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.slice(0, 4).map(elem => 
                                (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artists</h5>
                                    {arrArtistEightCard.slice(0, 4).length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.slice(0, 4).map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.slice(0, 4).length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.slice(0, 4).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                </div>
            )
        } else if (width < 1300) {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className='box-top-3__song-name-result'>{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.slice(0, 5).length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.slice(0, 5).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result'>{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.slice(0, 5).length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.slice(0, 5).map(elem => 
                                (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        : 
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artists</h5>
                                    {arrArtistEightCard.slice(0, 5).length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.slice(0, 5).map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.slice(0, 5).length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.slice(0, 5).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div> 
                    }
                </div>
            )
        } else if (width < 1600) {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} />
                                                </div>
                                            </div>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div>
                                                <p className='box-top-3__song-name-result' onClick={() => {navigate(`track/${elem.track.id}`, {state: [JSON.stringify(elem) ,search]}); }} >{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.slice(0, 6).length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.slice(0, 6).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result' >{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0
                        ? ''
                        : 
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.slice(0, 6).length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.slice(0, 6).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        : 
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artist</h5>
                                    {arrArtistEightCard.slice(0, 6).length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.slice(0, 6).map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.slice(0, 6).length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.slice(0, 6).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div> 
                    }
                </div>
            )
        } else if (width < 1900) {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className='box-top-3__song-name-result'>{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.slice(0, 7).length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.slice(0, 7).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result'>{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.slice(0, 7).length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.slice(0, 7).map(elem => 
                                (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artists</h5>
                                    {arrArtistEightCard.slice(0, 7).length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.slice(0, 7).map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.slice(0, 7).length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.slice(0, 7).map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div> 
                    }
                </div>
            )
        } else {
            return (
                <div className='search-container__result'>
                    <div>
                        <h5 className='top-title__result'>Top 3 Songs</h5>
                        <ul className='result-top-3__result'>
                            {top3Tracks.map(elem => 
                                (   
                                    <li key={elem.track.id}>
                                        <div className='box-top-3__result'>
                                            <img src={play_button} className='box-top-3__play-button-result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            <div className='box-top-3__container-result'>
                                                <div className='box-top-3__image-result'>
                                                    <img src={elem.image} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className='box-top-3__song-name-result'>{elem.track.name}</p>
                                                <p className='box-top-3__artist-name-result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                            </div>
                                        </div>
                                    </li>    
                                )
                            )}
                        </ul>
                    </div>
                    {arrTrackEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Songs</h5>
                                {arrTrackEightCard.length < maxObtainTrack ? <p className='more__result' onClick={() => {navigate('/search/songs', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrTrackEightCard.map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.track.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-song-name__result'>{elem.track.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Albums</h5>
                                    {arrAlbumEightCard.length < maxObtainAlbum ? <p className='more__result' onClick={() => {navigate('/search/albums', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrAlbumEightCard.map(elem => 
                                (
                                        <div className='box-container__result' key={elem.album.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-album-name__result' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
                                                    <p className='box-artist-name__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrArtistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Artists</h5>
                                    {arrArtistEightCard.length < maxObtainArtist ? <p className='more__result' onClick={() => {navigate('/search/artists', {state: search}); }}>See More</p> : ''}
                            </div>
                                <ul className='box-images__result'>
                                    {arrArtistEightCard.map(elem => 
                                    (   
                                        <div className='box-container__result' key={elem.artist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-artist-name__main__result' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div>
                    }
                    {arrPlaylistEightCard.length === 0
                        ? ''
                        :
                        <div>
                            <div className='title-more__result'>
                                <h5 className='title__result'>Playlists</h5>
                                {arrPlaylistEightCard.length < maxObtainPlaylist ? <p className='more__result' onClick={() => {navigate('/search/playlists', {state: search}); }}>See More</p> : ''}
                            </div>
                            <ul className='box-images__result'>
                                {arrPlaylistEightCard.map(elem => 
                                    (
                                        <div className='box-container__result' key={elem.playlist.id}>
                                            <div className='box-image-container__result'>
                                                <img src={elem.image} className='box-image__album-picture__result' />
                                                <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                            </div>
                                            <div className='box-bottom__result'>
                                                <div className='box-bottom__left__result'>
                                                    <p className='box-playlist-name__result' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
                                                    <p className='box-owner-name__result'>By {elem.owner.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </ul>
                        </div> 
                    } 
                </div>
            )
        } 
    }
}

export default SearchResult;
