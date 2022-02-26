import React, { useState, useEffect } from 'react';
import './css/search.css';
import play_button from '../images/play-button-4.png';
import play_button_3 from '../images/play-button-3.png';
import { player_id } from './Player.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios');

const Search = (props) => {
    const [query, setSearchText] = useState('');
    const [search, setSearch] = useState('');
    const [rData, setRData] = useState('');
    const [top3Tracks, setTop3Tracks] = useState([]);
    const [arrTrackResponse, setArrTrackResponse] = useState([]);
    const [arrAlbumResponse, setArrAlbumResponse] = useState([]);
    const [arrArtistResponse, setArrArtistResponse] = useState([]);
    const [arrPlaylistResponse, setArrPlaylistResponse] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState({});

    const [rawNewReleases, setRawNewReleases] = useState('');
    const [newRelease, setNewRelease] = useState([]);

    const handleChange = e => {
        setSearchText(e.target.value);
    }

    const submitSearch = e => {
        e.preventDefault();
        setSearch(query);
    }


    useEffect(() => {
        console.log(`Current query text: ${query}`);
        console.log(`Search text: ${search}`);
    }, [query, search])


    useEffect(() => {
        const queryTrack = async () => {
            const response = await axios.get('https://api.spotify.com/v1/search',
            { 
                params: {q: search, type: 'album,track,artist,playlist', limit: 10},
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response);

            setRData(response.data);
            setTop3Tracks([]);
            setArrTrackResponse([]);
            setArrAlbumResponse([]);
            setArrArtistResponse([]);
            setArrPlaylistResponse([]);

            let track_list = response.data.tracks.items;
            let album_list = response.data.albums.items;
            let artist_list = response.data.artists.items;
            let playlist_list = response.data.playlists.items;

            for (let i in track_list) {
                if (i < 3) {
                    setTop3Tracks(prev => [...prev, {
                        'imgUrl': track_list[i].album.images[1].url, 
                        'songName': track_list[i].name, 
                        'artistName': track_list[i].artists[0].name,
                        'trackUri': track_list[i].uri,
                        'trackNumber': track_list[i].track_number - 1,
                        'album': {
                            'albumName': track_list[i].album.name,
                            'albumReleaseDate': track_list[i].album.release_date,
                            'albumTotalTracks': track_list[i].album.total_tracks,
                            'albumUri': track_list[i].album.uri
                        }
                    }])
                } else {
                    setArrTrackResponse(prev => [...prev, {
                        'imgUrl': track_list[i].album.images[1].url, 
                        'songName': track_list[i].name, 
                        'artistName': track_list[i].artists[0].name,
                        'trackUri': track_list[i].uri,
                        'trackNumber': track_list[i].track_number - 1,
                        'album': {
                            'albumName': track_list[i].album.name,
                            'albumReleaseDate': track_list[i].album.release_date,
                            'albumTotalTracks': track_list[i].album.total_tracks,
                            'albumUri': track_list[i].album.uri
                        }
                    }])
                }                
            }

            for (let i in album_list) {
                setArrAlbumResponse(prev => [...prev, {
                    'artist': {
                        'name': album_list[i].artists[0].name,
                        'uri': album_list[i].artists[0].uri
                    },
                    'image': album_list[i].images[1].url,
                    'album': {
                        'name': album_list[i].name,
                        'release_date': album_list[i].release_date,
                        'total_tracks': album_list[i].total_tracks,
                        'uri': album_list[i].uri
                    }
                }])
            }

            for (let i in artist_list) {
                if ((artist_list[i].images).length === 0) {
                    continue
                }
                setArrArtistResponse(prev => [...prev, {
                    'artist': {
                        'name': artist_list[i].name,
                        'uri': artist_list[i].uri,
                        'popularity': artist_list[i].popularity
                    },
                    'image': artist_list[i].images[0].url,
                    'genres': artist_list[i].genres
                }])
            }

            for (let i in playlist_list) {
                setArrPlaylistResponse(prev => [...prev, {
                    'playlist': {
                        'name': playlist_list[i].name,
                        'description': playlist_list[i].description,
                        'uri': playlist_list[i].uri,
                        'snapshot_id': playlist_list[i].snapshot_id
                    },
                    'image': playlist_list[i].images[0].url,
                    'owner': {
                        'name': playlist_list[i].owner.display_name,
                        'id': playlist_list[i].owner.id,
                        'uri': playlist_list[i].owner.uri
                    }
                }])
            }
        }

        if (search !== '') {
            queryTrack();
        } else {
            console.log('Empty Query Field');
        }        
    }, [search])

    // useEffect(() => {
    //     console.log(arrArtistResponse);
    //     // console.log(arrArtistResponse[0].image);
    // }, [arrArtistResponse])

    useEffect(() => {
        const getNewRelease = async () => {
            const response = await axios.get('https://api.spotify.com/v1/browse/new-releases',
            {
                params: {limit: 20},
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            setRawNewReleases(response.data);
            // setNewRelease([]);

            let releases = response.data.albums.items;
            for (let i in releases) {
                setNewRelease(prev => [...prev, {
                    'album': {
                        'name': releases[i].name,
                        'total_tracks': releases[i].total_tracks,
                        'release_date': releases[i].release_date,
                        'uri': releases[i].uri
                    },
                    'artist': {
                        'name': releases[i].artists[0].name,
                        'uri': releases[i].artists[0].uri
                    },
                    'image': releases[i].images[0].url
                }])
            }

        }
        getNewRelease();
    }, [])

    // useEffect(() => {
    //     console.log(rawNewReleases);
    // }, [rawNewReleases])


    useEffect(() => {
        const putRequest = async () => {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedTrack.album_uri,
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

        if (selectedTrack !== '') {
            putRequest();
        } else {
            console.log('Empty selected track.');
        }
        

    }, [selectedTrack])


    useEffect(() => {
        if (rData === '') {
            console.log('No Response Data');
            return
        }

        console.log(rData)
    }, [rData])


    if (search === '') {
        return (
            <div>
                <div className='search-container'>
                    <div className='search-bar'>
                        <form onSubmit={submitSearch} action="">
                            <FontAwesomeIcon icon={faSearch} color='black' className='fa' />
                            <input type="search" name="q" onChange={handleChange} required></input>
                        </form>
                    </div>
                </div>
                <div>
                    <h5 className='new-release-title'>New Releases</h5>
                    <ul className='new-release-images'>
                        {newRelease.map(elem => 
                            (
                                <div className='box-container'>
                                    <li className='box-image'>
                                        <img src={elem.image} />
                                    </li>
                                    <div className='box-bottom'>
                                        <div className='box-bottom__left'>
                                            <p className='box-song-name'>{elem.album.name.length > 20 ? elem.album.name.substring(0, 19) + '...' : elem.album.name}</p>
                                            <p className='box-artist-name'>{elem.artist.name}</p>
                                        </div>
                                        <div className='box-bottom__right'>
                                            <img src={play_button} className='box-play-button' onClick={() => setSelectedTrack({'album_uri': elem.album.uri, 'track_number': elem.trackNumber}) } />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
            </div>
            
        )
    } else {
        return (
            <div className='search-container'>
                <div className='search-bar'>
                    <form onSubmit={submitSearch} action="">
                        <FontAwesomeIcon icon={faSearch} color='black' className='fa' />
                        <input type="search" name="q" onChange={handleChange} required></input>
                    </form>
                </div>
                <div>
                    <h5 className='top-title'>Top 3 Songs</h5>
                    <ul className='result-top-3'>
                        {top3Tracks.map(elem => 
                            (   
                                <div className='box-top-3'>
                                    <img src={play_button_3} className='box-top-3__play-button' />
                                    <div className='box-top-3__image'>
                                        <img src={elem.imgUrl} />
                                    </div>
                                    
                                    <div>
                                        <p className='box-top-3__song-name'>{elem.songName}</p>
                                        <p className='box-top-3__artist-name'>{elem.artistName}</p>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
                <div>
                    <h5 className='title'>Songs</h5>
                    <ul className='result-box-images'>
                        {arrTrackResponse.map(elem => 
                            (
                                <div className='box-container'>
                                    <li className='box-image'>
                                        <img src={elem.imgUrl} />
                                    </li>
                                    <div className='box-bottom'>
                                        <div className='box-bottom__left'>
                                            <p className='box-song-name'>{elem.songName.length > 20 ? elem.songName.substring(0, 19) + '...' : elem.songName}</p>
                                            <p className='box-artist-name'>{elem.artistName}</p>
                                        </div>
                                        <div className='box-bottom__right'>
                                            <img src={play_button} className='box-play-button' onClick={() => setSelectedTrack({'album_uri': elem.album.albumUri, 'track_number': elem.trackNumber}) } />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
                <div>
                    <h5 className='title'>Albums</h5>
                    <ul className='result-box-images'>
                        {arrAlbumResponse.map(elem => 
                            (
                                <div className='box-container'>
                                    <li className='box-image'>
                                        <img src={elem.image} />
                                    </li>
                                    <div className='box-bottom'>
                                        <div className='box-bottom__left'>
                                            <p className='box-song-name'>{elem.album.name.length > 20 ? elem.album.name.substring(0, 19) + '...' : elem.album.name}</p>
                                            <p className='box-artist-name'>{elem.artist.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
                <div>
                    <h5 className='title'>Artists</h5>
                    <ul className='result-box-images'>
                        {arrArtistResponse.map(elem => 
                            (
                                <div className='box-container'>
                                    <li className='box-image'>
                                        <img src={elem.image} />
                                    </li>
                                    <div className='box-bottom'>
                                        <div className='box-bottom__left'>
                                            <p className='box-song-name'>{elem.artist.name.length > 20 ? elem.artist.name.substring(0, 19) + '...' : elem.artist.name}</p>
                                            
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
                <div>
                    <h5 className='title'>Playlists</h5>
                    <ul className='result-box-images'>
                        {arrPlaylistResponse.map(elem => 
                            (
                                <div className='box-container'>
                                    <li className='box-image'>
                                        <img src={elem.image} />
                                    </li>
                                    <div className='box-bottom'>
                                        <div className='box-bottom__left'>
                                            <p className='box-song-name'>{elem.playlist.name.length > 20 ? elem.playlist.name.substring(0, 19) + '...' : elem.playlist.name}</p>
                                            <p className='box-artist-name'>By {elem.owner.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Search