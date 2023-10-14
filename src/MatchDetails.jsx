import { useLocation } from 'react-router-dom'; 
import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import './Styles/Matches.css';


const apiMatchData = 'https://api.opendota.com/api/matches/';
const apiHeroStats = 'https://api.opendota.com/api/constants/heroes';
const apiItemsId = 'https://api.opendota.com/api/constants/item_ids';
const apiItems = 'https://api.opendota.com/api/constants/items';


const MatchDetails = (props) => {
  let [matchData, setMatchData] = useState([]);
  let [heroesData, setHeroesData] = useState([]);
  const location = useLocation();

  console.log(props)
  let [itemIds, setItemIds] = useState([]);
  let [items, setItems] = useState([]);

  const getMDResponse = async () => {
    const digitsOnly = location.pathname.match(/\d+/g);
    let  id = digitsOnly[0];
    try {
      const responseMD = await axios.get(apiMatchData + id);
      setMatchData(responseMD.data);
      } catch (err) {
        console.error(err);
        for(let i = 0; i < props.matchData.length; i += 1){
          if (id === props.matchData[i].match_id){
            setMatchData(props.matchData[i]);
          }
          break;
        }
    }
  }

  const getHDResponse = async () => {
    if(!props.heroesData){
      try{
        const responseII = await axios.get(apiItemsId);
        setItemIds(itemIds = responseII.data);
        const responseHD = await axios.get(apiHeroStats);
        setHeroesData(responseHD.data);
        const responseItems = await axios.get(apiItems);
        setItems(items = responseItems.data)
      } catch (err){
        console.err(err);
      }
    }else{
      setHeroesData(props.heroesData);
      const responseII = await axios.get(apiItemsId);
      setItemIds(itemIds = responseII.data);
      const responseItems = await axios.get(apiItems);
      setItems(items = responseItems.data)
    }
  }

  useEffect(() => {
    getMDResponse();
    getHDResponse();
  }, [props.playerStats])

  const playersList = matchData.players?.map(player => {
    const heroId = player.hero_id;
    const urlItem = 'https://api.opendota.com';
    const isRadiant = player.isRadiant;
    const isEvenPlayerSlot = player.player_slot % 2 === 0;
    console.log(`https://api.opendota.com${heroesData[heroId]?.img}`);
    return(
      <>
      <tr style={{ width: player?.player_slot === 0 || 
        player?.player_slot === 128 ? '60px' : 'auto', margin: '10px',
        backgroundColor:  player?.player_slot === 0 ? '#073f074d' : '#8918184d'}}>
        <span>{ player?.player_slot === 0 ? `Radiant team` : null }
        { player?.player_slot === 128 ? `Dire team` : null }</span>
      </tr>
      <tr key={props.matchData[0]?.match_id }  className={
        isRadiant
          ? isEvenPlayerSlot
            ? 'green-bg'
            : 'transparent-red-bg'
          : isEvenPlayerSlot
            ? 'red-bg'
            : 'transparent-green-bg'
      }>
        <td style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div>
            <img src={urlItem + heroesData[heroId]?.img} className='MDHero-img'/>
          </div>
          <div>
            <b>{player.personaname ? player.personaname : "Closed profile"}</b>
          </div>
        </td>
        <td>{`${player?.kills}/${player?.deaths}/${player?.kills}`}</td>
        <td>{player?.net_worth}</td>
        <td>{player?.hero_damage}</td><td>{player?.gold_per_min} </td> 
        <td>{player?.xp_per_min}</td> 
        <td>{`${player?.last_hits}/${player?.denies}`} </td>
        <td className='ItemsImg'>
          <div>
            {[0, 1, 2, 3, 4, 5].map((index) => { //item images
              const item = player[`item_${index}`];
                return (
                  <>
                    {item ? (
                      <img src={urlItem + items[itemIds[item]]?.img} alt={`Item ${index}`} />
                    ) : (
                      null
                    )}
                  </>
                );
            })}
          {player?.item_neutral ? (//neutral item images
            <img
              src={urlItem + items[itemIds[player?.item_neutral]]?.img}
              alt="Neutral Item"
              className='NeutralItem'
            />
          ) : null}
        </div>
        <div>
          {[0, 1, 2].map((index) => {//backpack item images
            const backpack = player[`backpack_${index}`];
            return (
              <>
                {backpack ? (
                  <img src={urlItem + items[itemIds[backpack]]?.img} 
                    alt={`Backpack ${index}`} />
                ) : ( null )}
              </>
            );
          })}
        </div>
      </td>
      </tr>
    </>
    )
  })

  const getBans =  matchData.picks_bans?.map(bans => {
    if (bans.is_pick === false ){
      return (
        <td><img src={'https://api.opendota.com' + 
          heroesData[bans.hero_id]?.icon} alt='Hero Ban'/>
        </td>
      );
    }
  })
  console.log("ps", matchData)


  return (
    <>
    <div className='TableHeader'>
      <b>
      <div className={matchData?.radiant_win === true ? 'won' : 'lost'}>
        {matchData?.radiant_win === true ? "Radiant Victory": "Dire Victory"}
      </div>
      <div>
        <span>Score:</span>
        <span className='lost'>{` ${matchData?.radiant_score}`}</span>:
        <span className='won'>{`${matchData?.dire_score}`}</span>
      </div>
      <div> 
        {`Duration: ${Math.floor(matchData?.duration/60)}:${(matchData?.duration%60)
          .toString().padStart(2,'0')}`}
      </div>
      </b>
    </div>
      {matchData || heroesData ? (
    <table>
        <thead className='MDTable'><tr>
          <th>Player</th><th>K/D/A</th>
          <th>Net Worth</th><th>Herodamage</th>
          <th>GPM</th><th>XPM</th>
          <th>L/D</th><th>Items</th>
          </tr></thead>
          <tbody>{playersList}</tbody>
      </table>) : (
      <p>Loading...</p>
      )}
      {matchData.picks_bans !== null ?
      <table style={{marginTop: '20px', marginBottom: '30px', border:'none'}}>
        <tbody><b>Banned heroes</b>{getBans}</tbody>
      </table> :
      null
      }
    </>
  );
};

export default MatchDetails;