import React from "react";
import steamIcon from './images/steamIcon.png';

function ProfileInfo({playerStats}) {

  const getRank = (rank_tier) => {
    switch (('' + rank_tier)[0]) {
      case '1':
        return "Herald"
      case '2':
        return "Guardian"
      case '3':
        return "Crusader"
      case '4':
        return "Archon"
      case '5':
        return "Legend"
      case '6':
        return "Ancient"
      case '7':
        return "Divine"
      case '8':
        return "Immortal"
    }
  }
  
   const getTier = (rank_tier) => {
    return ('' + rank_tier)[1]
   }


  return (
    <>
      {JSON.stringify(playerStats) !== '{}' ?
        <div>
          <div className="Avatar-Container">
            <div className="Profile-Info">
              <img src={playerStats.player_data.profile.avatarmedium} 
                className='Profile-Img'/>
                <div className="Profile-Text">
                  <div>
                  <span style={{marginBottom:'2px', fontWeight:'600', marginRight: '5px'}}>
                    {playerStats.player_data.profile.personaname}
                  </span>
                  <img src={steamIcon} onClick={(e) => {
                    e.preventDefault();
                    window.open(playerStats.player_data.profile.profileurl,
                      '_blank');
                  }} className="Steam-Icon" alt="Steam Icon"/>
                  </div>
                  <div>
                    <span style={{marginBottom:'2px'}}>
                      W/L {playerStats.win_rate.win}/
                      {playerStats.win_rate.lose}, </span>
                    <span>{`${((playerStats.win_rate.win /
                      (playerStats.win_rate.win + 
                      playerStats.win_rate.lose)) * 100).toFixed(2)}% `}
                    </span>
                  </div>
                  <span emptystr='' style={{}}>
                      {`Rank: ${getRank(playerStats.player_data.rank_tier)}, `}
                      {`Tier: ${getTier(playerStats.player_data.rank_tier)}   `}
                  </span>
                  
               </div>
            </div>
              
          </div>
    </div>
    : null}
  </>
  );
}

export default ProfileInfo;