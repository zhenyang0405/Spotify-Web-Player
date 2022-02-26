import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import singer from '../images/singer.png';
import play_button from '../images/play-button-4.png';
import left_arrow from '../images/icons8-back-arrow-50.png';
import { player_id } from './Player';
import '../components/css/search-more.css';

const axios = require('axios');

const SearchMore = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {type} = useParams();

    const [selectedTrack, setSelectedTrack] = useState({});
    const [arrItems, setArrItems] = useState([]);

    const searchTerm = location.state;
    // console.log(searchTerm);

    const handleGoBack = () => {
        navigate('/search', {state: searchTerm});
    }
    
    useEffect(() => {
        let query_type = ''; 
        if (type == 'songs') {
            query_type = 'track';
        } else if (type == 'albums') {
            query_type = 'album';
        } else if (type == 'playlists') {
            query_type = 'playlist';
        } else if (type == 'artists') {
            query_type = 'artist';
        }

        const queryInfo = async () => {
            const response = await axios.get('https://api.spotify.com/v1/search',
            { 
                params: {q: searchTerm, type: query_type, limit: 50},
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response);

            // if (query_type == 'track') {
            //     let info = await response.data.tracks.items;                
            // } else if (query_type == 'album') {
            //     let info = await response.data.albums.items;
            // } else if (query_type == 'playlist') {
            //     let info = await response.data.playlists.items;
            // } else if (query_type == 'artist') {
            //     let info = await response.data.artists.items;
            // }

            setArrItems([]);

            // let info = [];
            switch (query_type) {
                case 'track':
                    let track_info = await response.data.tracks.items;
                    for (let i in track_info) {
                        let image_url = (track_info[i].album.images).length == 0 ? singer : track_info[i].album.images[0].url;
                        setArrItems(prev => [...prev, {
                            'track': {
                                'name': track_info[i].name,
                                'id': track_info[i].id,
                                'track_number': track_info[i].track_number - 1,
                                'uri': track_info[i].uri
                            },
                            'image': image_url,
                            'album': {
                                'name': track_info[i].album.name,
                                'release_date': track_info[i].album.release_date,
                                'total_tracks': track_info[i].album.total_tracks,
                                'uri': track_info[i].album.uri
                            },
                            'artist': {
                                'name': track_info[i].artists[0].name,
                                'id': track_info[i].artists[0].id,
                                'uri': track_info[i].artists[0].uri,
                                'api': track_info[i].artists[0].href
                            }
                        }]);
                    }
                    break;
                case 'album':
                    let album_info = await response.data.albums.items;
                    for (let i in album_info) {
                        let image_url = (album_info[i].images).length == 0 ? singer : album_info[i].images[0].url;
                        setArrItems(prev => [...prev, {
                            'artist': {
                                'name': album_info[i].artists[0].name,
                                'id': album_info[i].artists[0].id,
                                'uri': album_info[i].artists[0].uri,
                            },
                            'image': image_url,
                            'album': {
                                'name': album_info[i].name,
                                'id': album_info[i].id,
                                'release_date': album_info[i].release_date,
                                'total_tracks': album_info[i].total_tracks,
                                'uri': album_info[i].uri
                            }
                        }]);
                    }
                    break;
                case 'playlist':
                    let playlist_info = await response.data.playlists.items;
                    for (let i in playlist_info) {
                        let image_url = (playlist_info[i].images).length == 0 ? singer : playlist_info[i].images[0].url;
                        setArrItems(prev => [...prev, {
                            'playlist': {
                                'name': playlist_info[i].name,
                                'id': playlist_info[i].id,
                                'description': playlist_info[i].description,
                                'uri': playlist_info[i].uri,
                                'snapshot_id': playlist_info[i].snapshot_id,
                                'total_tracks': playlist_info[i].tracks.total
                            },
                            'image': image_url,
                            'owner': {
                                'name': playlist_info[i].owner.display_name,
                                'id': playlist_info[i].owner.id,
                                'uri': playlist_info[i].owner.uri,
                                'api': playlist_info[i].owner.href
                            }
                        }]);
                    }
                    break;
                case 'artist':
                    let artist_info = await response.data.artists.items;
                    for (let i in artist_info) {
                        let image_url = (artist_info[i].images).length == 0 ? singer : artist_info[i].images[0].url;
                        setArrItems(prev => [...prev, {
                            'artist': {
                                'name': artist_info[i].name,
                                'id': artist_info[i].id,
                                'uri': artist_info[i].uri,
                                'popularity': artist_info[i].popularity
                            },
                            'image': image_url,
                            'genres': artist_info[i].genres,
                            'followers': artist_info[i].followers.total
                        }]);
                    }
                    break;
                default:
                    console.log('Error on query_type');
            }
        }
        queryInfo();
    }, [])

    // POST 
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

    if (type == 'songs') {
        return (
            <div className='search-container__result'>
                <div>
                    <div className='title__more-page__container'>
                        <span onClick={handleGoBack}><img src={left_arrow} className='go-back__more-page'/></span>
                        <h5 className='title__more-page'>More {type} similar to {searchTerm}</h5>
                    </div>
                    <ul className='see-more-box-images__result'>    
                        {arrItems.map(elem => 
                            (
                                <div className='box-container__more-page'>
                                    <div className='box-image-container__more-page'>
                                        <img src={elem.image} className='box-image__album-picture__result' />
                                        <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                    </div>
                                    <div className='box-bottom__result'>
                                        <div className='box-bottom__left__result'>
                                            <p className='box-song-name__result' >{elem.track.name}</p>
                                            <p className='box-artist-name__result' onClick={() => {navigate(`/search/artist/${elem.artist.id}`, {state: [searchTerm]}); }} >{elem.artist.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
            </div>
        )
    } else if (type == 'albums') {
        return (
            <div className='search-container__result'>
                <div>
                    <div className='title__more-page__container'>
                        <span onClick={handleGoBack}><img src={left_arrow} className='go-back__more-page'/></span>
                        <h5 className='title__more-page'>More {type} for {searchTerm}</h5>
                    </div>
                    <ul className='see-more-box-images__result'>
                        {arrItems.map(elem => 
                            (
                                <div className='box-container__more-page'>
                                     <div className='box-image-container__more-page'>
                                        <img src={elem.image} className='box-image__album-picture__result' />
                                        <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                    </div>
                                    <div className='box-bottom__result'>
                                        <div className='box-bottom__left__result'>
                                            <p className='box-album-name__result' onClick={() => {navigate(`/search/album/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                            <p className='box-artist-name__result' onClick={() => {navigate(`/search/artist/${elem.artist.id}`, {state: [searchTerm]}); }} >{elem.artist.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
            </div>
        )
    } else if (type == 'artists') {
        return (
            <div className='search-container__result'>
                <div>
                    <div className='title__more-page__container'>
                        <span onClick={handleGoBack}><img src={left_arrow} className='go-back__more-page'/></span>
                        <h5 className='title__more-page'>More {type} for {searchTerm}</h5>
                        {/* <span><img src={right_arrow} className='go-next' /></span> */}
                    </div>
                    <ul className='see-more-box-images__result'>
                        {arrItems.map(elem => 
                            (
                                <div className='box-container__more-page'>
                                     <div className='box-image-container__more-page__artist'>
                                        <img src={elem.image} className='box-image__album-picture__result' />
                                        <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
                                    </div>
                                    <div className='box-bottom__result'>
                                        <div className='box-bottom__left__result'>
                                            <p className='box-song-name__result'>{elem.artist.name.length > 20 ? elem.artist.name.substring(0, 19) + '...' : elem.artist.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
            </div>
        )
    } else if (type == 'playlists') {
        return (
            <div className='search-container__result'>
                <div>
                    <div className='title__more-page__container'>
                        <span onClick={handleGoBack}><img src={left_arrow} className='go-back__more-page'/></span>
                        <h5 className='title__more-page'>More {type} for {searchTerm}</h5>
                        {/* <span><img src={right_arrow} className='go-next' /></span> */}
                    </div>
                    <ul className='see-more-box-images__result'>
                        {arrItems.map(elem => 
                            (
                                <div className='box-container__more-page'>
                                     <div className='box-image-container__more-page'>
                                        <img src={elem.image} className='box-image__album-picture__result' />
                                        <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
                                    </div>
                                    <div className='box-bottom__result'>
                                        <div className='box-bottom__left__result'>
                                            <p className='box-song-name__result'>{elem.playlist.name.length > 20 ? elem.playlist.name.substring(0, 19) + '...' : elem.playlist.name}</p>
                                            <p className='box-artist-name__result'>{elem.owner.name}</p>
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

export default SearchMore;
