import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from './SideMenu';
import Home from './Home';
import Profile from './Profile';
import Playlist from './Playlist';
import Player from './Player.jsx';
import SearchMore from './SearchMore';
import SearchResult from './SearchResult';
import SearchArtist from './SearchArtist';
import SearchAlbum from './SearchAlbum';
import SearchPlaylist from './SearchPlaylist';
import SearchMoreArtist from './SearchMore-Artist';
import './css/interface.css';

import SearchBar from './SearchBar';
import SearchTrack from './SearchTrack';

const Interface = (props) => {
    return (
        <>
            <div className='bottom-player'>
                <Player token={props.token} />
            </div>
            <Routes>
                <Route path='/' element={<SideMenu />}>
                    <Route path='/' element={<Home token={props.token} />} />
                    <Route path='/profile' element={<Profile token={props.token} />} />
                    <Route path='/playlist' element={<Playlist token={props.token} />} />
                    <Route path='/playlist/:id' element={<SearchPlaylist token={props.token} />} />
                    <Route path='/search' element={<SearchBar token={props.token} />} />
                    {/* <Route path='/search?q=:text' element={<SearchResult token={props.token} />} /> */}
                    <Route path='/search/:type' element={<SearchMore token={props.token} />} />
                    <Route path='/search/artist/:id' element={<SearchArtist token={props.token} />} />
                    <Route path='/search/artist/:id/:type' element={<SearchMoreArtist token={props.token} />} />
                    <Route path='/search/artist/:id/:type/:id' element={<SearchAlbum token={props.token} />} />
                    <Route path='/search/album/:id' element={<SearchAlbum token={props.token} />} />
                    <Route path='/search/playlist/:id' element={<SearchPlaylist token={props.token} />} />
                    <Route path='/search/track/:id' element={<SearchTrack token={props.token} />} />
                    {/* <Route path='/search' element={<Search token={props.token}/>} /> */}
                    {/* <Route path='/profile' element={<Profile />} /> */}
                </Route>
            </Routes>
        </>
        // element={<SideMenu token={props.token} />}
    )
}

export default Interface;