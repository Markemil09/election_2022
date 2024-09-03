import React, { useState, useEffect } from 'react';
import electionData from '../mock-data/presidential_election_2022.json'; 

const ElectionResultsTable = () => {
  const [totals, setTotals] = useState({});
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('ALL REGIONS');
  const [candidateMarcos, setCandidateMarcos] = useState('BONGBONG MARCOS');
  const [candidateLeni, setCandidateLeni] = useState('LENI ROBREDO');
  const [totalLeni, setTotalLeni] = useState(0);
  const [totalMarcos, setTotalMarcos] = useState(0);
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
      handlePopulateData();
    }, []);
  
  //Populate the data to be displayed.
  const handlePopulateData = () => {
    const totalsPerRegion = {};
      const totalsPerIsland = {
        Luzon: { Marcos: 0, Robredo: 0 },
        Visayas: { Marcos: 0, Robredo: 0 },
        Mindanao: { Marcos: 0, Robredo: 0 }
      };
      const availableRegions = new Set();
      
      const candidates = electionData.presidential_candidates;
      Object.keys(candidates).forEach(candidateName => {
        const regions = candidates[candidateName].regions;
        
        Object.keys(regions).forEach(region => {
          availableRegions.add(region);
          
          if (!totalsPerRegion[region]) {
            totalsPerRegion[region] = { Marcos: 0, Robredo: 0 };
          }
          if (!totalsPerRegion['ALL REGIONS']) {
            totalsPerRegion['ALL REGIONS'] = { Marcos: 0, Robredo: 0 };
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
              totalsPerIsland[island] = { Marcos: 0, Robredo: 0 };
            }
          }
          
          Object.keys(regions[region]).forEach(province => {
            const votes = regions[region][province];
            
            if (candidateName === 'Ferdinand Marcos Jr.') {
              totalsPerRegion[region].Marcos += votes;
              totalsPerRegion['ALL REGIONS'].Marcos += votes;
              if (island) {
                totalsPerIsland[island].Marcos += votes;
              }
            } else if (candidateName === 'Leni Robredo') {
              totalsPerRegion[region].Robredo += votes;
              totalsPerRegion['ALL REGIONS'].Robredo += votes;
              if (island) {
                totalsPerIsland[island].Robredo += votes;
              }
            }
          });
        });          
      });
      
      totalsPerRegion['Luzon'] = totalsPerIsland['Luzon'];
      totalsPerRegion['Visayas'] = totalsPerIsland['Visayas'];
      totalsPerRegion['Mindanao'] = totalsPerIsland['Mindanao'];
      
      setTotals(totalsPerRegion);
      setTotalMarcos(totalsPerRegion[selectedRegion]?.Marcos.toString() || 0);
      setTotalLeni(totalsPerRegion[selectedRegion]?.Robredo.toString() || 0)
      setRegions(['ALL REGIONS', 'Luzon', 'Visayas', 'Mindanao', ...Array.from(availableRegions)]);
  }
    
  //Handles the region change and sets the data change.
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setTotalMarcos(totals[event.target.value]?.Marcos.toString() || 0);
    setTotalLeni(totals[event.target.value]?.Robredo.toString()  || 0);
    setCandidateLeni('LENI ROBREDO');
    setCandidateMarcos('BONGBONG MARCOS');
  };

  //Handles the reversal of candidate name. Starting from center and last character to (center+1).
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
  
  
  //Handles the reversal of vote count. Starting from center and last character to (center+1).
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

  //Handles the sorting of candidates based on the number of votes.
  const sortedCandidates = [
      { name: candidateMarcos, votes: totalMarcos },
      { name: candidateLeni, votes: totalLeni }
    ].sort((a, b) => b.votes - a.votes);
  
  //Handles all the reverse functions and sets the changes to be displayed.
  const handleReverse = () => {
    const marcosReverse = handleReverseName(candidateMarcos);
    const leniReverse = handleReverseName(candidateLeni);
    const leniVoteReverse = handleReverseVotes(totalLeni);
    const marcosVoteReverse = handleReverseVotes(totalMarcos);
    setCandidateMarcos(marcosReverse);
    setCandidateLeni(leniReverse);
    setTotalLeni(leniVoteReverse);
    setTotalMarcos(marcosVoteReverse);
  }
  
    return (
      <div>
        <h1 className="py-12">Election 2022</h1>
        <p className="mb-3 font-bold">Presidential Results</p>
        <div className="flex py-2">
          <select id="region-select" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleRegionChange}>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>
          
          <button className="mx-3" onClick={handleReverse}>Reverse</button>
        </div>
        <div className="relative overflow-x-auto my-6">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="col" className="px-6 py-3">Presidential Candidate</th>
                <th scope="col" className="px-6 py-3">Total Votes</th>
              </tr>
            </thead>
            <tbody>
              {sortedCandidates.map((candidate, index) => (
                <tr className="bg-white border-b dark:bg-slate-600 dark:border-gray-700" key={index}>
                  <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{candidate.name}</td>
                  <td className="px-6 py-4 dark:text-white">{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      </div>
    );
  }
  
  export default ElectionResultsTable;
