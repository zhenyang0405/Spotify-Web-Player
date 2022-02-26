import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import play_button from '../images/play-button-4.png';
import { player_id } from './Player';
import './css/playlist.css';
import { useLoading, Bars } from '@agney/react-loading';

const axios = require('axios');

const Playlist = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [myPlaylists, setMyPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState({});
    const navigate = useNavigate();
    
    const { containerProps, indicatorEl } = useLoading({
        loading: isLoading,
        indicator: <Bars width="50" />
    });

    // GET User Playlist
    useEffect(() => {
        const getMyPlaylist = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=50`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);

            setMyPlaylists([]);

            let info = await response.data.items;
            for (let i in info) {
                setMyPlaylists(prev => [...prev, {
                    'id': info[i].id,
                    'name': info[i].name,
                    'image': info[i].images[0].url,
                    'description': info[i].description,
                    'uri': info[i].uri,
                    'owner': info[i].owner.display_name,
                    'total_tracks': info[i].tracks.total
                }]);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 2000)
        }
        getMyPlaylist();

    }, [])

    // PUT request
    useEffect(() => {
        const putRequest = async () => {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedPlaylist.uri,
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

        if (selectedPlaylist !== {}) {
            putRequest();
        } else {
            console.log('HOME - Put Request Empty selected album.');
        }

    }, [selectedPlaylist])

    if (isLoading) {
        return (
            <div className='loading-container'>
                <section {...containerProps} className='loading'>
                    {indicatorEl} {/* renders only while loading */}
                </section>
            </div>
        )
    } else {
        return (
            <>
                <div className='user-playlist__container'>
                    <p className='user-playlist__title'>Your Playlists</p>
                    <div className='user-playlist__card-container'>
                        {myPlaylists.map(elem => 
                            (
                                <div className='user-playlist__card'>
                                    <div className='user-playlist__image-container'>
                                        <img src={elem.image} className='user-playlist__image' />
                                        <p className='user-playlist__total-tracks'>{elem.total_tracks} TRACKS</p>
                                        <img src={play_button} className='user-playlist__play-button' onClick={() => setSelectedPlaylist({'uri': elem.uri})} />
                                    </div>
                                    <div className='user-playlist__basic-info'>
                                        <p className='user-playlist__name' onClick={() => navigate(`/playlist/${elem.id}`)} >{elem.name}</p>
                                        <p className='user-playlist__owner'>By {elem.owner}</p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </>
        );
    }
};

export default Playlist;
