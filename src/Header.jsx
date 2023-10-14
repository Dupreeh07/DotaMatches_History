import './Styles/App.css';
import './Styles/Header.css';
import axios from 'axios';
import { useState, createContext } from 'react';
import Matches from './Matches.jsx';
import { BrowserRouter } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';

export const PlayerSatsContext = createContext();

function Header() {
  let [dotaId, setDotaId] = useState('');
  let [playerStats, setPlayerStats] = useState({});
  const apiPlayerData = `https://api.opendota.com/api/players/${dotaId}`;
  const apiWinRate = `https://api.opendota.com/api/players/${dotaId}/wl`;

  //335085168

  const getResponse = async () => {
    try {
      const responsePD = await axios.get(apiPlayerData);
      const responseWR = await axios.get(apiWinRate);
      setPlayerStats({ player_data: responsePD.data, win_rate: responseWR.data })
    } catch (err) {
        console.error(err)
    }
  }


  return (
    <>
    <BrowserRouter> 
      <div className='Header-Wrapper'>
        <ProfileInfo playerStats = {playerStats}/>
        <div className="Right-Side">
          <input placeholder='dota id'
            onChange={e => {
              setDotaId(e.target.value); 
          }}/>
          <button className='Find-Button' onClick={getResponse}>Find
          </button>
        </div>
      </div>
      <Matches playerStats = {playerStats} id={dotaId}/>
    </BrowserRouter>
    </>
  );
}

export default Header;