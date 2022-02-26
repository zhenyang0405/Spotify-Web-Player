import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import logo from '../images/spotify_logo.png';
import icon_logo from '../images/Spotify_Icon_RGB_Green.png';
import icon_home from '../images/icons8-home-96.png';
import icon_search from '../images/icons8-google-web-search-96.png';
import icon_profile from '../images/icons8-name-96.png';
import icon_playlist from '../images/icons8-chord-96.png';
import { useWindowDimensions } from '../functions/custom-hook';
import './css/interface.css';

const SideMenu = (props) => {
    const { height, width } = useWindowDimensions();

    if (width < 900) {
        return (
            <div className='side-bar'>
                <div className='side-bar__menu'>
                    <img src={icon_logo} alt='Spotify logo' className='logo' />
                    <nav className='side-bar__main-navigation'>
                        <ul>
                            <li><Link to="/"><img src={icon_home} className='icon home-icon'/></Link></li>
                            <li><Link to="search"><img src={icon_search} className='icon search-icon'/></Link></li>
                            <li><Link to="profile"><img src={icon_profile} className='icon icon-profile' /></Link></li>
                            <li><Link to="playlist"><img src={icon_playlist} className='icon icon-playlist' /></Link></li>
                        </ul>
                    </nav>
                </div>
                <div className='side-bar__link-result' >
                    <div className='link-result__outlet-area' >
                        <Outlet />
                    </div>
                </div>
            </div>
        )
    } else if (width < 1400) {
        return (
            <div className='side-bar'>
                <div className='side-bar__menu'>
                    <img src={icon_logo} alt='Spotify logo' className='logo' />
                    <nav className='side-bar__main-navigation'>
                        <ul>
                            <li className='side-bar__link'><Link to="/"><img src={icon_home} className='icon icon-home' /></Link></li>
                            <li className='side-bar__link'><Link to="search"><img src={icon_search} className='icon icon-search' /></Link></li>
                            <li><Link to="profile"><img src={icon_profile} className='icon icon-profile' /></Link></li>
                            <li><Link to="playlist"><img src={icon_playlist} className='icon icon-playlist' /></Link></li>
                        </ul>
                    </nav>
                </div>
                <div className='side-bar__link-result' >
                    <div className='link-result__outlet-area' >
                        <Outlet />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='side-bar'>
                <div className='side-bar__menu'>
                    <img src={logo} alt='Spotify logo' className='logo' />
                    <nav className='side-bar__main-navigation'>
                        <ul>
                            <li className='side-bar__home'><Link to="/"><img src={icon_home} className='icon icon-home' />  Home</Link></li>
                            <li className='side-bar__search'><Link to="search"><img src={icon_search} className='icon icon-search' />  Search</Link></li>
                            <li className='side-bar__profile'><Link to="profile"><img src={icon_profile} className='icon icon-profile' /> Profile</Link></li>
                            <li className='side-bar__playlist'><Link to="playlist"><img src={icon_playlist} className='icon icon-playlist' />  Playlist</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className='side-bar__link-result' >
                    <div className='link-result__outlet-area' >
                        <Outlet />
                    </div>
                </div>
            </div>
        )
    }
}

export default SideMenu
