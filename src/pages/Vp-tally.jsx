import React, { useState, useEffect } from 'react';
import electionData from '../mock-data/vice_presidential_election_2022.json'; 

const VpElectionResultsTable = () => {
    const [totals, setTotals] = useState({});
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('ALL REGIONS');
    const [candidateKiko, setCandidateKiko] = useState('KIKO PANGILINAN');
    const [candidateSarah, setCandidateSarah] = useState('SARAH DUTERTE');
    const [totalSarah, setTotalSarah] = useState(0);
    const [totalKiko, setTotalKiko] = useState(0);
    const islands = {
        Luzon: [
            "CORDILLERA ADMINISTRATIVE REGION", 
            "NATIONAL CAPITAL REGION", 
            "REGION I", 
            "REGION II", 
            "REGION III", 
            "REGION IV-A", 
            "REGION IV-B", 
            "REGION V"
        ],
        Visayas: ["REGION VI", "REGION VII", "REGION VIII"],
        Mindanao: [
            "REGION IX", 
            "REGION X", 
            "REGION XI", 
            "REGION XII", 
            "REGION XIII", 
            "BARMM"
        ]
    };
  
    useEffect(() => {
        const totalsPerRegion = {};
        const totalsPerIsland = {
          Luzon: { Kiko: 0, Sarah: 0 },
          Visayas: { Kiko: 0, Sarah: 0 },
          Mindanao: { Kiko: 0, Sarah: 0 }
        };
        const availableRegions = new Set();
        
        const candidates = electionData.vice_presidential_candidates;
        Object.keys(candidates).forEach(candidateName => {
          const regions = candidates[candidateName].regions;
          
          Object.keys(regions).forEach(region => {
            availableRegions.add(region);
            
            if (!totalsPerRegion[region]) {
              totalsPerRegion[region] = { Kiko: 0, Sarah: 0 };
            }
            if (!totalsPerRegion['ALL REGIONS']) {
              totalsPerRegion['ALL REGIONS'] = { Kiko: 0, Sarah: 0 };
            }
            
            let island = '';
            if (islands.Luzon.includes(region)) {
              island = 'Luzon';
            } else if (islands.Visayas.includes(region)) {
              island = 'Visayas';
            } else if (islands.Mindanao.includes(region)) {
              island = 'Mindanao';
            }
            
            if (island) {
              if (!totalsPerIsland[island]) {
                totalsPerIsland[island] = { Kiko: 0, Sarah: 0 };
              }
            }
            
            Object.keys(regions[region]).forEach(province => {
              const votes = regions[region][province];
              
              if (candidateName === 'Kiko Pangilinan') {
                totalsPerRegion[region].Kiko += votes;
                totalsPerRegion['ALL REGIONS'].Kiko += votes;
                if (island) {
                  totalsPerIsland[island].Kiko += votes;
                }
              } else if (candidateName === 'Sara Duterte') {
                totalsPerRegion[region].Sarah += votes;
                totalsPerRegion['ALL REGIONS'].Sarah += votes;
                if (island) {
                  totalsPerIsland[island].Sarah += votes;
                }
              }
            });
          });          
        });
        
        totalsPerRegion['Luzon'] = totalsPerIsland['Luzon'];
        totalsPerRegion['Visayas'] = totalsPerIsland['Visayas'];
        totalsPerRegion['Mindanao'] = totalsPerIsland['Mindanao'];
        
        setTotals(totalsPerRegion);
        setTotalKiko(totalsPerRegion[selectedRegion]?.Kiko || 0);
        setTotalSarah(totalsPerRegion[selectedRegion]?.Sarah || 0)
        setRegions(['ALL REGIONS', 'Luzon', 'Visayas', 'Mindanao', ...Array.from(availableRegions)]);
      }, []);
      
  
    const handleRegionChange = (event) => {
      setSelectedRegion(event.target.value);
      setTotalKiko(totals[event.target.value]?.Kiko || 0);
      setTotalSarah(totals[event.target.value]?.Sarah || 0);
      setCandidateSarah('SARA DUTERTE');
      setCandidateKiko('KIKO PANGILINAN');
    };

    const handleReverseName = (name) => {
      const words = name.split(' ');
  
      const reversedWords = words.map(word => {
          const len = word.length;
          const mid = Math.floor(len / 2);
          let beforeMid, afterMid;
  
          if (len % 2 === 0) {
              beforeMid = word.slice(0, mid).split('').reverse().join('');
              afterMid = word.slice(mid).split('').reverse().join('');
              return beforeMid + afterMid;
          } else {
              beforeMid = word.slice(0, mid).split('').reverse().join('');
              const middle = word[mid];
              afterMid = word.slice(mid + 1).split('').reverse().join('');
              return beforeMid + middle + afterMid;
          }
      });
  
      return reversedWords.join(' ');
    };
    
    

    const handleReverseVotes = (vote) => {
      const voteStr = vote.toString(); 
      const len = voteStr.length;
      let reversedVote = '';

      if (len % 2 === 0) {
          const beforeMid = voteStr.slice(0, len / 2).split('').reverse().join('');
          const afterMid = voteStr.slice(len / 2).split('').reverse().join('');
          reversedVote = beforeMid + afterMid;
      } else {
          const mid = Math.floor(len / 2);
          const beforeMid = voteStr.slice(0, mid).split('').reverse().join('');
          const middle = voteStr[mid];
          const afterMid = voteStr.slice(mid + 1).split('').reverse().join('');
          reversedVote = beforeMid + middle + afterMid;
      }

      return reversedVote;
    };

    const sortedCandidates = [
        { name: candidateKiko, votes: totalKiko },
        { name: candidateSarah, votes: totalSarah }
      ].sort((a, b) => b.votes - a.votes);

    const handleReverse = () => {
        const kikoReverse = handleReverseName(candidateKiko);
        const sarahReverse = handleReverseName(candidateSarah);
        const sarahVoteReverse = handleReverseVotes(totalSarah);
        const kikoVoteReverse = handleReverseVotes(totalKiko);
        setCandidateKiko(kikoReverse);
        setCandidateSarah(sarahReverse);
        setTotalSarah(sarahVoteReverse);
        setTotalKiko(kikoVoteReverse);
    }
  
    return (
      <div>
        <h2>Vice Presidential Results</h2>
  
        <label htmlFor="region-select">Select Region: </label>
        <select id="region-select" onChange={handleRegionChange}>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
        
        <button onClick={handleReverse}>Reverse</button>
        <table border="1" cellPadding="27%" cellSpacing="0">
        <thead>
          <tr>
            <th>Vice Presidential Candidate</th>
            <th>Total Votes</th>
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.name}</td>
              <td>{candidate.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  }
  
  export default VpElectionResultsTable;
