import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractYear } from '../functions/extractDate';
import msToMinuteSecond from '../functions/msToMinuteSecond';
import play_button from '../images/play-button-4.png';
import { player_id } from './Player';
import './css/profile.css';
import { useLoading, Bars } from '@agney/react-loading';

const axios = require('axios');

const Profile = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState({});
    const navigate = useNavigate();

    const { containerProps, indicatorEl } = useLoading({
        loading: isLoading,
        indicator: <Bars width="50" />
    });

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // GET 
    useEffect(() => {
        const getMe = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/me`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            // console.log(response);

            let info = await response.data;
            setUserInfo({
                name: info.display_name,
                country: info.country,
                email: info.email,
                followers: info.followers.total,
                images: info.images[0].url,
                product_type: info.product
            });

            setIsLoading(false);

            // setTimeout(() => {
            //     setIsLoading(false);
            // }, 2000)
        }

        const getTopArtists = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=20`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            // console.log(response);

            setTopArtists([]);

            let artist_info = await response.data.items;
            for (let i in artist_info) {
                setTopArtists(prev => [...prev, {
                    id: artist_info[i].id,
                    name: artist_info[i].name,
                    image: artist_info[i].images[0].url,
                    followers: artist_info[i].followers.total,
                    popularity: artist_info[i].popularity,
                    genres: artist_info[i].genres
                }]);
            }
        }

        const getTopTracks = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=20`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);

            setTopTracks([]);

            let track_info = await response.data.items;
            for (let i in track_info) {
                setTopTracks(prev => [...prev, {
                    id: track_info[i].id,
                    name: track_info[i].name,
                    image: track_info[i].album.images[0].url,
                    duration: track_info[i].duration_ms,
                    uri: track_info[i].uri,
                    artists: track_info[i].artists,
                    year: extractYear(track_info[i].album.release_date)
                }]);
            }
        }

        getMe();
        getTopArtists();
        getTopTracks();

    }, []);

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
        return (
            <div className='profile-page__container'>
                <div className='profile-page__upper-container'>
                    <div className='profile-upper-info'>
                        <div className='profile-image__container'>
                            <img src={userInfo.images} className='profile-image' />
                        </div>
                        <div className='profile-basic-info'>
                            <p className='profile-name'>{userInfo.name}</p>
                            <p className='profile-email'>{userInfo.email}</p>
                            <p className='profile-follower'>{userInfo.followers} followers <span>&nbsp;·&nbsp;</span> {userInfo.country} <span>&nbsp;·&nbsp;</span> {userInfo.product_type}</p>
                        </div>
                    </div>
                </div>
                <div className='profile-page__lower-container'>
                    <div className='lower-left__container'>
                        <p className='lower-title lower-left__title'>Top Artists</p>
                        <div className='lower-left__artists-container'>
                            {topArtists.map((elem, idx) => (
                                <div key={elem.id} className='artist-card'>
                                    <div className='artist-image__container'>
                                        <img src={elem.image} className='lower-left__artist-image' />
                                    </div>
                                    <div className='artist-info__container'>
                                        <p className='profile__artist-name' onClick={() => navigate(`/search/artist/${elem.id}`, {state: ['']})} >{elem.name}</p>
                                        <p className='artist-follower'>{numberWithCommas(elem.followers)} followers <span>&nbsp;·&nbsp;</span> {elem.popularity} popularity</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='lower-right__container'>
                        <p className='lower-title lower-right__title'>Top Tracks</p>
                        <div className='lower-right__tracks-container'>
                            {topTracks.map((elem, idx) => (
                                <div key={elem.id} className='track-card'>
                                    <div className='track-image__container'>
                                        <img src={elem.image} className='lower-right__track-image' />
                                        <img src={play_button} className='profile-track__play-button' onClick={() => setSelectedTrack({'uri': elem.uri})} />
                                    </div>
                                    <div className='track-info__container'>
                                        <p className='profile__track-name'>{elem.name}</p>
                                        <p className='arr-artists'>{
                                            elem.artists.map(value => (
                                                <span><span className='arr-artists__name' onClick={() => navigate(`/search/artist/${value.id}`, {state: ['']})}>{value.name}</span>&nbsp;·&nbsp;</span>
                                            ))}
                                            <span>{elem.year}</span>
                                        </p>
                                        <p className='profile__track-duration'>{msToMinuteSecond(elem.duration)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;
