import React, { useState, useEffect } from 'react';
import play_button from '../images/icons8-play-button-circled-100.png';
import pause_button from '../images/icons8-pause-button-100.png';
import next_button from '../images/icons8-fast-forward-50.png';
import previous_button from '../images/icons8-rewind-50.png';
import no_music from '../images/Spotify_Icon_RGB_White.png';
import './css/player.css';

const axios = require('axios');

let track = {
    name: "Currentlly no track playing",
    album: {
        images: [
            {
                url: no_music
            }
        ]
    },
    artists: [
        {
            name: ""
        }
    ]
}

export let player_id = '';

const Player = (props) => {
    const [webPlayer, setWebPlayer] = useState(undefined);
    const [isPaused, setIsPaused] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(track);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Zhen Yang's Web Player",
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.3,
            });

            setWebPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                player_id = device_id;
                console.log('Ready with Device ID: ', device_id)
            })

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id)
            })

            player.addListener('player_state_changed', (state => {
                if (!state) {
                    console.log('Not state: ', state)
                    return;
                }

                setCurrentTrack(state.track_window.current_track);
                setIsPaused(state.paused)


                console.log(state);
            }));

            player.connect();
        }
    }, [])


    return (
        <div className='now-playing__container'>
            <img src={currentTrack.album.images[0].url} className="now-playing__cover" alt="" />
            <div className="now-playing__side">
                <div className='now-playing__name-container'>
                    <div className="now-playing__name">{currentTrack.name}</div>
                    <div className="now-playing__artist">{currentTrack.artists[0].name}</div>
                </div>
                
                <div className='now-playing__play-progress'>
                    <div className='btn-player'>
                        <div className='btn-spotify' onClick={() => { webPlayer.previousTrack() }}>
                            <img src={previous_button} className='fast-forward' />
                        </div>

                        <div className="btn-spotify" onClick={() => { webPlayer.togglePlay() }} >
                            { isPaused ? <img src={play_button} className='playpause' /> : <img src={pause_button} className='playpause'/> }
                        </div>

                        <div className='btn-spotify' onClick={() => { webPlayer.nextTrack() }}>
                            <img src={next_button} className='rewind' />
                        </div>
                        
                    </div>
                    
                    
                </div>
            </div>
        </div>
    )
}


export default Player
