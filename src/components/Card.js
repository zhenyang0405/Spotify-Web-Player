import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import play_button from '../images/play-button-2.png';
import { player_id } from './Player';
import { useWindowDimensions } from '../functions/custom-hook';

const axios = require('axios');

const Card = (props) => {

    const [search, setSearch] = useState('');
    const [selectedTrack, setSelectedTrack] = useState('');
    const [newArrObj, setNewArrObj] = useState([]);
    const { height, width } = useWindowDimensions();

    const navigate = useNavigate();

    // Set search term
    useEffect(() => {
        setSearch(props.search);
    })

    useEffect(() => {
        const queryTrack = async () => {
            const response = await axios.get('https://api.spotify.com/v1/search',
            { 
                params: {q: search, type: props.type, limit: 50},
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response);

            let track_list = response.data.tracks.items;
            
            if (width < 1200) {
                for (let i = 0; i < 5; i++) {
                    setNewArrObj(prev => [...prev, {
                        'track': {
                            'name': track_list[i].name,
                            'id': track_list[i].id,
                            'track_number': track_list[i].track_number - 1,
                            'uri': track_list[i].uri
                        },
                        'image': track_list[i].album.images[0].url,
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
            } else if (width < 1600) {
                for (let i = 0; i < 6; i++) {
                    setNewArrObj(prev => [...prev, {
                        'track': {
                            'name': track_list[i].name,
                            'id': track_list[i].id,
                            'track_number': track_list[i].track_number - 1,
                            'uri': track_list[i].uri
                        },
                        'image': track_list[i].album.images[0].url,
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
            } else if (width < 1900) {
                for (let i = 0; i < 7; i++) {
                    setNewArrObj(prev => [...prev, {
                        'track': {
                            'name': track_list[i].name,
                            'id': track_list[i].id,
                            'track_number': track_list[i].track_number - 1,
                            'uri': track_list[i].uri
                        },
                        'image': track_list[i].album.images[0].url,
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
            } else if (width > 1900) {
                for (let i = 0; i < 9; i++) {
                    setNewArrObj(prev => [...prev, {
                        'track': {
                            'name': track_list[i].name,
                            'id': track_list[i].id,
                            'track_number': track_list[i].track_number - 1,
                            'uri': track_list[i].uri
                        },
                        'image': track_list[i].album.images[0].url,
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

        }
        queryTrack();
    }, [search])


    // useEffect(() => {
    //     if (width < 1200) {
    //         for (let i = 0; i < 5; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     } else if (width < 1600) {
    //         for (let i = 0; i < 6; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     } else if (width < 1900) {
    //         for (let i = 0; i < 7; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     } else if (width > 1900) {
    //         for (let i = 0; i < 9; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     }
    // }, [props.givenArr])

    // PUT request to player
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

    // Resize window return number of cards
    // useEffect(() => {
    //     setNewArrObj([]);
    //     if (width < 1200) {
    //         for (let i = 0; i < 5; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     } else if (width < 1600) {
    //         for (let i = 0; i < 6; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     } else if (width < 1900) {
    //         for (let i = 0; i < 7; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     } else if (width > 1900) {
    //         for (let i = 0; i < 9; i++) {
    //             setNewArrObj(prev => [...prev, props.givenArr[i]]);
    //         }
    //     }
    // }, [width])


    // useEffect(() => {
    //     console.log(newArrObj);
    // }, [])

    // useEffect(() => {
    //     console.log(props.givenArr);
    // }, [])

    // return (
    //     <h5>Tets</h5>
    // )
     
    if (props.type === 'track') {
        return (
            <div>
                <div className='title-more'>
                    <h5 className='title'>Songs</h5>
                    {newArrObj.length === 0 ? '' : <p className='more' onClick={() => {navigate('/search/songs', {state: [JSON.stringify(newArrObj), search]}); }}>See More</p>}
                </div>
                <ul className='result-box-images'>
                    {newArrObj.map(elem => 
                        (
                            <div className='box-container' key={elem.track.id}>
                                <div className='box-image-container'>
                                    <li className='box-image'>
                                        <img src={elem.image} className='box-image__album-picture' />
                                    </li>
                                    <img src={play_button} className='box-image__play-button' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': elem.track.track_number })} />
                                </div>
                                <div className='box-bottom'>
                                    <div className='box-bottom__left'>
                                        <p className='box-song-name'>{elem.track.name}</p>
                                        <p className='box-artist-name' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </ul>
            </div>
        )
    }
    // } else if (props.type === 'album') {
    //     return (
    //         <div>
    //             <div className='title-more'>
    //                 <h5 className='title'>Albums</h5>
    //                 {newArrObj.length === 0 ? '' : <p className='more' onClick={() => {navigate('/search/albums', {state: [JSON.stringify(newArrObj), search]}); }}>See More</p>}
    //             </div>
    //             <ul className='result-box-images'>
    //                 {newArrObj.map(elem => 
    //                     (
    //                         <div className='box-container' key={elem.album.id}>
    //                             <div className='box-image-container'>
    //                                 <li className='box-image'>
    //                                     <img src={elem.image} className='box-image__album-picture' />
    //                                 </li>
    //                                 <img src={play_button} className='box-image__play-button' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
    //                             </div>
    //                             <div className='box-bottom'>
    //                                 <div className='box-bottom__left'>
    //                                     <p className='box-album-name' onClick={() => {navigate(`album/${elem.album.id}`, {state: [search]}); }} >{elem.album.name}</p>
    //                                     <p className='box-artist-name' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )
    //                 )}
    //             </ul>
    //         </div>
    //     )
    // } else if (props.type === 'artist') {
    //     return (
    //         <div>
    //             <div className='title-more'>
    //                 <h5 className='title'>Artists</h5>
    //                 {newArrObj.length === 0 ? '' : <p className='more' onClick={() => {navigate('/search/artists', {state: [JSON.stringify(newArrObj), search]}); }}>See More</p>}
    //             </div>
    //             <ul className='result-box-images'>
    //                 {newArrObj.map(elem => 
    //                     (   

    //                         <div className='box-container' key={elem.artist.id}>
    //                             <div className='box-image-container'>
    //                                 <li className='box-image'>
    //                                     <img src={elem.image} className='box-image__album-picture' />
    //                                 </li>
    //                                 <img src={play_button} className='box-image__play-button' onClick={() => setSelectedTrack({'uri': elem.artist.uri, 'track_number': 0 })} />
    //                             </div>
    //                             <div className='box-bottom'>
    //                                 <div className='box-bottom__left'>
    //                                     <p className='box-artist-name' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }} >{elem.artist.name}</p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )
    //                 )}
    //             </ul>
    //         </div>
    //     )
    // } else if (props.type === 'playlist') {
    //     return (
    //         <div>
    //             <div className='title-more'>
    //                 <h5 className='title'>Playlists</h5>
    //                 {newArrObj.length === 0 ? '' : <p className='more' onClick={() => {navigate('/search/playlists', {state: [JSON.stringify(newArrObj), search]}); }}>See More</p>}
    //             </div>
    //             <ul className='result-box-images'>
    //                 {newArrObj.map(elem => 
    //                     (
    //                         <div className='box-container' key={elem.playlist.id}>
    //                             <div className='box-image-container'>
    //                                 <li className='box-image'>
    //                                     <img src={elem.image} className='box-image__album-picture' />
    //                                 </li>
    //                                 <img src={play_button} className='box-image__play-button' onClick={() => setSelectedTrack({'uri': elem.playlist.uri, 'track_number': 0 })} />
    //                             </div>
    //                             <div className='box-bottom'>
    //                                 <div className='box-bottom__left'>
    //                                     <p className='box-song-name' onClick={() => {navigate(`playlist/${elem.playlist.id}`, {state: [search]}); }}>{elem.playlist.name}</p>
    //                                     <p className='box-artist-name'>By {elem.owner.name}</p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )
    //                 )}
    //             </ul>
    //         </div> 
    //     )
    // }
}

export default Card;
