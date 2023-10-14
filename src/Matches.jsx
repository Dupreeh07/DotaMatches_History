
import React, { useState, useEffect } from 'react';

import {BrowserRouter as Router, Routes, Route, Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import MatchDetails from './MatchDetails';
import './Styles/Matches.css';

const getGameMod = (gameMode) => {
  switch (gameMode) {
    case 22:
      return "All Pick"
    case 23:
      return "Turbo"
    case 25:
      return "Captains Draft"
    case 26:
      return "Captains Mode"
    case 32:
      return "Ability Draft"
    case 4:
      return "Single Draft"
    case 34:
      return "Battle Cup"
  }
}

  

function Matches(props) {
  let [matchData, setMatchData] = useState([]);
  let [heroesData, setHeroesData] = useState([]);
  let [matchCounter, setMatchCounter] = useState(1);
  const location = useLocation(); 
  let [previousValue, setPreviousValue] = useState('');

  console.log(props.id)
  const apiPlayerMatchesUrl = `https://api.opendota.com/api/players` + 
  `/${props?.id}/matches/?limit=10`; 

  const apiPlayerMatchesOffsetUrl = `https://api.opendota.com/api/`+ 
  `players/${props?.id}/matches/?offset=${matchCounter.toString()}&limit=5`

  const apiHeroStats = 'https://api.opendota.com/api/constants/heroes';

  const getHeroesStats = async () => {
    try {
      const responseHD = await axios.get(apiHeroStats);
      setHeroesData(heroesData = responseHD.data);
    } catch (error){
      console.error(error);
    }
  }
  //each match response is creating here mb do it in MatchedDetails?
  const getMatchesData = async (apiMatchesUrl) => { 
    try {
      let result = [];
      const responsePM = await axios.get(apiMatchesUrl);    
      await Promise.all(responsePM.data.map(async match => {
        const apiMatchesUrl = 
          `https://api.opendota.com/api/matches/${(match.match_id).toString()}`;
        const advanceResponse = await axios.get(apiMatchesUrl);
        advanceResponse.data.player_slot = match.player_slot;
        result.push(advanceResponse.data); 
        for(let i = 0; i < 10; i += 1){
          if(advanceResponse.data.players[i].player_slot === 
              advanceResponse.data.player_slot){
            advanceResponse.data.player_slot_index = i;
          }
        }
      }));
      if(matchData[0] === undefined){
        setMatchData(result);
      }else{
        setMatchData(matchData => [...matchData, ...result]);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    getHeroesStats();
  }, []);

  useEffect(() => {
    if (props.id !== ''){
      if(previousValue !== props.id){
        setMatchData([]);
        getMatchesData(apiPlayerMatchesUrl);
        setPreviousValue(props.id);
      }else{
        getMatchesData(apiPlayerMatchesUrl);
      }
    }  
  }, [props.playerStats]);

 


  if (location.pathname.includes('/match-details')) {//hide Matches table
    return (       
      <Routes>
        <Route path="/match-details/:matchId" 
          element={<MatchDetails matchData={matchData} heroesData={heroesData}/>}/>
      </Routes>
    );
  }

  let rowTableIndex = 0;
  let matchList = matchData.map(match => { 
    const heroId = match.players[match.player_slot_index].hero_id;
    const playerSlotIndex = match.players[match.player_slot_index];
    console.log(match.game_mode)
    rowTableIndex += 1;
    return ( 
      <tr key={ match.match_id } className={ rowTableIndex % 2 === 0 
        ?  'Row-BG-Matches1'  : 'Row-BG-Matches2' }>
        <td style={{ display: 'flex', alignItems: 'center'}} className='Link-cell'>
          <Link to={{ pathname: `/match-details/${match.match_id}` }}
             key={match.match_id}>
            <img src={`https://api.opendota.com${heroesData[heroId].img}`} 
            alt='Hero Img' className='MHero-img'/>
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', border:'none',
           alignItems: 'flex-start', marginLeft: '10px' }}>
            <Link to={{ pathname: `/match-details/${match.match_id}`}}
             key={match.match_id}>
              <span>{heroesData[heroId].localized_name}</span>
            </Link>
            <span>{getGameMod(match.game_mode)}</span>
          </div>
        </td> 
      <td><b>{playerSlotIndex.win === 1 ? 
        (<span className='won'>Won</span>) : 
        (<span className='lost'>Lost</span>)}</b></td> 
      <td>{`${playerSlotIndex.kills}/`}
        {`${playerSlotIndex.deaths}/`}
        {`${playerSlotIndex.assists}`} 
      </td> 
      <td>{playerSlotIndex.gold_per_min} </td> 
      <td>{playerSlotIndex.xp_per_min  } </td> 
      <td>{playerSlotIndex.hero_damage} </td>
    </tr>
    )
  });


  return (
    <>
      {matchData.length > 0 || heroesData.length > 0 ? (
        <table className='Mtable'>
          <caption style={{textAlign: 'left', margin:'3px', fontSize:'20px'}}>
            <b>Latest Matches</b>
            <button onClick={async () => {
              await getMatchesData(apiPlayerMatchesOffsetUrl);
              setMatchCounter (matchCounter = matchCounter + 5);//add 5 heroes
            }} style={{float: 'right'}}>+ Show more</button>
          </caption>
          <thead><tr>
            <th>Hero</th><th>Result</th><th>KDA</th>
            <th>GPM</th><th>XPM</th><th>Herodamage</th>
            </tr></thead>
          <tbody>
          {matchList}
          </tbody>
        </table>
      ) : (
        <p style={{textAlign: 'center', fontSize:'25px'}}>Enter Dota id...</p>
      )}
      <Routes>
        <Route path="/match-details/:matchId" 
          element={<MatchDetails matchData={matchData} 
            heroesData={heroesData} id={props.id}
            />}
          />
      </Routes>
    </>
  );
}

export default Matches;