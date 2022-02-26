import React, { useState, useEffect } from 'react';
import './css/home.css';
import { player_id } from './Player';
import play_button from '../images/play-button-4.png';
import { useWindowDimensions } from '../functions/custom-hook';
import { useLoading, Bars } from '@agney/react-loading';

const axios = require('axios');

const Home = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [selectedAlbum, setSelectedAlbum] = useState({});
    const [selectedTrack, setSelectedTrack] = useState({});
    const { height, width } = useWindowDimensions();
    
    const [arrRecentPlayed, setArrRecentPlayed] = useState([]);

    const [arrFeaturesTwelveCard, setArrFeaturesTwelveCard] = useState([]);
    const [arrFeaturesTenCard, setArrFeaturesTenCard] = useState([]);
    const [arrFeaturesEightCard, setArrFeaturesEightCard] = useState([]);
    const [arrFeaturesSixCard, setArrFeaturesSixCard] = useState([]);

    const unique_playlist = new Set();
    const unique_album = new Set();
    const unique_artist = new Set();
    let tracking_number = 0;

    const { containerProps, indicatorEl } = useLoading({
        loading: isLoading,
        indicator: <Bars width="50" />
    });
    
    // GET user name
    useEffect(() => {
        const getUserProfile = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/me`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            ).catch(function (error) {
                if (error.response) {
                    console.log('Catch error!');
                    const response = axios.get('/refresh');
                    console.log(response);
                }
            })
            setUsername(response.data.display_name);
        }
        getUserProfile();
    }, [])

    // GET recently-played
    useEffect(() => {

        const getRecentPlayed = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=50`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);

            setArrRecentPlayed([]);

            let info = await response.data.items;
            for (let i in info) {
                if (info[i].context == null) {
                    if (tracking_number < 9) {
                        setArrRecentPlayed(prev => [...prev, {
                            'id': info[i].track.id,
                            'name': info[i].track.name,
                            'image': info[i].track.album.images[0].url,
                            'type': info[i].track.type,
                            'uri': info[i].track.uri,
                            'track_number': info[i].track.track_number,
                            'album': {
                                'id': info[i].track.album.id,
                                'name': info[i].track.album.name,
                                'uri': info[i].track.album.uri
                            }
                        }]);
                        tracking_number++;
                        console.log(tracking_number);
                    }
                    continue;
                }
                let uri = (info[i].context.uri).split(':');
                if (uri[1] == 'playlist') {
                    if (unique_playlist.has(uri[2])) {
                        continue
                    } else {
                        const playlist_res = await axios.get(`https://api.spotify.com/v1/playlists/${uri[2]}`,
                        {
                            headers: {
                                Accept: 'application/json',
                                Authorization: 'Bearer ' + props.token,
                                'Content-Type': 'application/json'
                            }
                        }
                        )
                        // console.log(playlist_res);

                        let data = await playlist_res.data;
                        if (tracking_number < 9) {
                            setArrRecentPlayed(prev => [...prev, {
                                'id': data.id,
                                'name': data.name,
                                'image': data.images[0].url,
                                'type': data.type,
                                'uri': data.uri
                            }]);
                            tracking_number++;
                            console.log(tracking_number);
                        }

                        unique_playlist.add(uri[2]);
                    }
                    
                } else if (uri[1] == 'album') {
                    if (unique_album.has(uri[2])) {
                        continue
                    } else {
                        const album_res = await axios.get(`https://api.spotify.com/v1/albums/${uri[2]}`,
                        {
                            headers: {
                                Accept: 'application/json',
                                Authorization: 'Bearer ' + props.token,
                                'Content-Type': 'application/json'
                            }
                        }
                        )
                        // console.log(album_res);

                        let data_album = await album_res.data;
                        if (tracking_number < 9) {
                            setArrRecentPlayed(prev => [...prev, {
                                'id': data_album.id,
                                'name': data_album.name,
                                'image': data_album.images[0].url,
                                'type': data_album.type,
                                'uri': data_album.uri
                            }]);
                            tracking_number++;
                            console.log(tracking_number);
                        }
                        unique_album.add(uri[2]);
                    }
                    
                } else if (uri[1] == 'artist') {
                    if (unique_artist.has(uri[2])) {
                        continue
                    } else {
                        const artist_res = await axios.get(`https://api.spotify.com/v1/artists/${uri[2]}`,
                        {
                            headers: {
                                Accept: 'application/json',
                                Authorization: 'Bearer ' + props.token,
                                'Content-Type': 'application/json'
                            }
                        }
                        )
                        // console.log(artist_res);

                        let data_artist = await artist_res.data;
                        if (tracking_number < 9) {
                            setArrRecentPlayed(prev => [...prev, {
                                'id': data_artist.id,
                                'name': data_artist.name,
                                'image': data_artist.images[0].url,
                                'type': data_artist.type,
                                'uri': data_artist.uri
                            }]);
                            tracking_number++;
                            console.log(tracking_number);
                        }
                        unique_artist.add(uri[2]);
                    }

                }
                
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 2000)
        }    
        getRecentPlayed();
    }, [])

    // GET features playlist
    useEffect(() => {
        const queryFeatuesPlaylist = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/browse/featured-playlists?limit=20`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);

            setArrFeaturesSixCard([]);
            setArrFeaturesEightCard([]);
            setArrFeaturesTenCard([]);
            setArrFeaturesTwelveCard([]);
            
            let info = await response.data.playlists.items;
            for (let i in info) {
                if (i >= 0 && i < 6) {
                    setArrFeaturesSixCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                    setArrFeaturesEightCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                    setArrFeaturesTenCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                    setArrFeaturesTwelveCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                } else if (i >= 6 && i < 8) {
                    setArrFeaturesEightCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                    setArrFeaturesTenCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                    setArrFeaturesTwelveCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                } else if (i >= 8 && i < 10) {
                    setArrFeaturesTenCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                    setArrFeaturesTwelveCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                } else if (i >= 10 && i < 13) {
                    setArrFeaturesTwelveCard(prev => [...prev, {
                        'id': info[i].id,
                        'name': info[i].name,
                        'image': info[i].images[0].url,
                        'description': info[i].description,
                        'uri': info[i].uri,
                        'owner': info[i].owner.display_name
                    }]);
                }
            }

        }
        queryFeatuesPlaylist();
    }, [])

    // PUT selected song to player
    useEffect(() => {
        const putRequest = async () => {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedAlbum.uri,
                "offset": {
                    "position": 0
                },
                "position_ms": 0
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);
        }

        if (selectedAlbum !== {}) {
            putRequest();
        } else {
            console.log('HOME - Put Request Empty selected album.');
        }

    }, [selectedAlbum])

    // PUT track
    useEffect(() => {
        const putRequest = async () => {
            await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "uris": [
                    selectedTrack.uri
                  ]
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
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
                <div>
                    <div className='home-container'>
                        <h2 className='home-greetings'>Welcome back {username}</h2>
                        <p className='recent-played'>Recently Played</p>
                        <div className='recently-played__container'>
                            {arrRecentPlayed.map(elem => 
                                (
                                    <div key={elem.id} className='recently-played__card'>
                                        <img src={elem.image} className='recent-played__card__image' />
                                        <div className='recent-played__card__name-type'>
                                            <p className='recent-played__song-name'>{elem.name}</p>
                                            <p className='recent-played__type'>{elem.type}</p>
                                        </div>
                                        <img src={play_button} className='recent-played__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                    </div>
                                )
                            )}
                        </div>
                        <p className='features-playlist'>Editor's Picks</p>
                        <div className='features-playlist__container'>
                            {arrFeaturesSixCard.map(elem => 
                                (
                                    <div key={elem.id} className='features-playlist__card'>
                                        <div className='features-playlist__image-container'>
                                            <img src={elem.image} className='features-playlist__card__image' />
                                            <img src={play_button} className='features-playlist__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                        </div>
                                        <div className='features-playlist__text-container'>
                                            <p className='features-playlist__name'>{elem.name}</p>
                                            <p className='features-playlist__owner'>By {elem.owner}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )
        } else if (width < 800) {
            return (
                <div>
                    <div className='home-container'>
                        <h2 className='home-greetings'>Welcome back {username}</h2>
                        <p className='recent-played'>Recently Played</p>
                        <div className='recently-played__container'>
                            {arrRecentPlayed.map(elem => 
                                (
                                    <div key={elem.id} className='recently-played__card'>
                                        <img src={elem.image} className='recent-played__card__image' />
                                        <div className='recent-played__card__name-type'>
                                            <p className='recent-played__song-name'>{elem.name}</p>
                                            <p className='recent-played__type'>{elem.type}</p>
                                        </div>
                                        <img src={play_button} className='recent-played__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                    </div>
                                )
                            )}
                        </div>
                        <p className='features-playlist'>Editor's Picks</p>
                        <div className='features-playlist__container'>
                            {arrFeaturesSixCard.map(elem => 
                                (
                                    <div key={elem.id} className='features-playlist__card'>
                                        <div className='features-playlist__image-container'>
                                            <img src={elem.image} className='features-playlist__card__image' />
                                            <img src={play_button} className='features-playlist__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                        </div>
                                        <div className='features-playlist__text-container'>
                                            <p className='features-playlist__name'>{elem.name}</p>
                                            <p className='features-playlist__owner'>By {elem.owner}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )
        } else if (width < 1200) {
            return (
                <div>
                    <div className='home-container'>
                        <h2 className='home-greetings'>Welcome back {username}</h2>
                        <p className='recent-played'>Recently Played</p>
                        <div className='recently-played__container'>
                            {arrRecentPlayed.map(elem => 
                                (
                                    <div key={elem.id} className='recently-played__card'>
                                        <img src={elem.image} className='recent-played__card__image' />
                                        <div className='recent-played__card__name-type'>
                                            <p className='recent-played__song-name'>{elem.name}</p>
                                            <p className='recent-played__type'>{elem.type}</p>
                                        </div>
                                        <img src={play_button} className='recent-played__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                    </div>
                                )
                            )}
                        </div>
                        <p className='features-playlist'>Editor's Picks</p>
                        <div className='features-playlist__container'>
                            {arrFeaturesEightCard.map(elem => 
                                (
                                    <div key={elem.id} className='features-playlist__card'>
                                        <div className='features-playlist__image-container'>
                                            <img src={elem.image} className='features-playlist__card__image' />
                                            <img src={play_button} className='features-playlist__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                        </div>
                                        <div className='features-playlist__text-container'>
                                            <p className='features-playlist__name'>{elem.name}</p>
                                            <p className='features-playlist__owner'>By {elem.owner}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )
        } else if (width < 1500) {
            return (
                <div>
                    <div className='home-container'>
                        <h2 className='home-greetings'>Welcome back {username}</h2>
                        <p className='recent-played'>Recently Played</p>
                        <div className='recently-played__container'>
                            {arrRecentPlayed.map(elem => 
                                (
                                    <div key={elem.id} className='recently-played__card'>
                                        <img src={elem.image} className='recent-played__card__image' />
                                        <div className='recent-played__card__name-type'>
                                            <p className='recent-played__song-name'>{elem.name}</p>
                                            <p className='recent-played__type'>{elem.type}</p>
                                        </div>
                                        {(elem.type == 'track')
                                            ? <img src={play_button} className='recent-played__play-button' onClick={() => setSelectedTrack({'uri': elem.uri})} />
                                            : <img src={play_button} className='recent-played__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                        }
                                    </div>
                                )
                            )}
                        </div>
                        <p className='features-playlist'>Editor's Picks</p>
                        <div className='features-playlist__container'>
                            {arrFeaturesTenCard.map(elem => 
                                (
                                    <div key={elem.id} className='features-playlist__card'>
                                        <div className='features-playlist__image-container'>
                                            <img src={elem.image} className='features-playlist__card__image' />
                                            <img src={play_button} className='features-playlist__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                        </div>
                                        <div className='features-playlist__text-container'>
                                            <p className='features-playlist__name'>{elem.name}</p>
                                            <p className='features-playlist__owner'>By {elem.owner}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className='home-container'>
                        <h2 className='home-greetings'>Welcome back {username}</h2>
                        <p className='recent-played'>Recently Played</p>
                        <div className='recently-played__container'>
                            {arrRecentPlayed.map(elem => 
                                (
                                    <div key={elem.id} className='recently-played__card'>
                                        <img src={elem.image} className='recent-played__card__image' />
                                        <div className='recent-played__card__name-type'>
                                            <p className='recent-played__song-name'>{elem.name}</p>
                                            <p className='recent-played__type'>{elem.type}</p>
                                        </div>
                                        <img src={play_button} className='recent-played__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                    </div>
                                )
                            )}
                        </div>
                        <p className='features-playlist'>Editor's Picks</p>
                        <div className='features-playlist__container'>
                            {arrFeaturesTwelveCard.map(elem => 
                                (
                                    <div key={elem.id} className='features-playlist__card'>
                                        <div className='features-playlist__image-container'>
                                            <img src={elem.image} className='features-playlist__card__image' />
                                            <img src={play_button} className='features-playlist__play-button' onClick={() => setSelectedAlbum({'uri': elem.uri})} />
                                        </div>
                                        <div className='features-playlist__text-container'>
                                            <p className='features-playlist__name'>{elem.name}</p>
                                            <p className='features-playlist__owner'>By {elem.owner}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Home