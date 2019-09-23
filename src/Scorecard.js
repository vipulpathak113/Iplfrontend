import React, { Component } from 'react';
import './style.css'
var heading = [
    {

        "batsman": "Batsman",
        "dismissal": "Dismissal",
        "runs": "Runs",
        "balls": "Balls",
        "4s": "4s",
        "6s": "6s",
    }
]

var bowling = [
    {
        "b": "Bowler",
        "o": "Overs",
        "m": "Maiden",
        "r": "Runs",
        "w": "Wickets",
        "nb": "No Ball",
        "wd": "Wide",
    }

]
class Scorecard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data2: [],
            data3: [],
            team: [],
            squad1: [],
            squad2: [],
            data4: {}
        }
    }
    onClick() {
    }


    player_name1(id) {
        if (this.state.squad1) {
            var player = this.state.squad1.find(item => item.id === id)
            if (player)
                var player1 = player.f_name
            return player1
        }
    }

    player_name2(id) {
        if (this.state.squad2) {
            var player = this.state.squad2.find(item => item.id === id)
            if (player)
                var player2 = player.f_name
            return player2
        }
    }

    componentDidMount() {
        var matchId = new URLSearchParams(window.location.search).get('matchId');

        var team_id1;
        var team_id2;
        var matchkiid;
        let data2 = fetch('http://mapps.cricbuzz.com/cbzios/series/2810/matches')
            .then((resp) => {
                resp.json().then((resp) => {
                    let matchInfo = resp.matches.find(item => item.match_id === matchId)
                    // let matchInfo1 = resp.matches.find(item => item.header.state === "preview" || item.header.state === "complete")
                    // console.log(matchInfo)
                    if (matchInfo.header.state === "inprogress" || matchInfo.header.state === "innings break" && matchInfo.header) {
                        // console.log(matchInfo)
                        matchkiid = matchInfo.match_id;
                        team_id1 = matchInfo.bat_team.id;
                        // console.log(team_id1)
                        team_id2 = matchInfo.bow_team.id;
                    }

                    else if (matchInfo.header.state === "complete") {
                        matchkiid = matchInfo.match_id;
                        team_id1 = matchInfo.bat_team.id;
                        team_id2 = matchInfo.bow_team.id;
                    }
                    else {
                        matchkiid = matchInfo.match_id;
                    }
                    this.setState({ data2: resp.matches })
                    let squad1 = fetch(`http://mapps.cricbuzz.com/cbzios/series/2810/teams/${team_id1}/squads`).then((resp) => {
                        resp.json().then((resp) => {
                            // console.log(resp)
                            this.setState({
                                squad1: resp
                            })
                        })
                    })

                    let squad2 = fetch(`http://mapps.cricbuzz.com/cbzios/series/2810/teams/${team_id2}/squads`).then((resp) => {
                        resp.json().then((resp) => {
                            // console.log(resp)
                            this.setState({
                                squad2: resp
                            })
                        })
                    })
                    this.interval = setInterval(() => {
                        let data = fetch(`http://mapps.cricbuzz.com/cbzios/match/${matchId}/scorecard.json`).then((resp1) => {
                            resp1.json().then((resp1) => {
                                // console.log([resp1])
                                this.setState({ data3: [resp1] })
                            })
                        })
                    }, 1000);
                })
            })
            .catch(function (error) {
                console.log(error);
            });


        let comm = fetch(`http://mapps.cricbuzz.com/cbzios/match/${matchId}`).then((resp2) => {
            resp2.json().then((resp2) => {
                // console.log(resp2)
                this.setState({
                    data4: [resp2]
                })
            })
        })
    }


    render() {
        var list = []
        var list1 = []
        var list2 = []


        return (
            <table className="table">
                {/* <thead>
                    {heading.map((item, i) => {
                        return (
                            <tr key={i} className="back">
                                <th>{item.batsman}</th>
                                <th>{item.dismissal}</th>
                                <th>{item.runs}</th>
                                <th>{item.balls}</th>
                                <th>{item['4s']}</th>
                                <th>{item['6s']}</th>
                            </tr>

                        )
                    })}
                </thead> */}

                {this.state.data3 ? this.state.data3.map((item, key) => {
                    if (item.Innings[0])
                        return (
                            <tr key="key">
                                <div style={{ background: 'red', color: 'white' }}>{item.status}</div>
                                <div key={key} className="batteam">
                                    {item.Innings[0].bat_team_name} Innings
                                </div>
                            </tr>
                        )
                }
                ) : <p>Wait.. Data is fetching/</p>}


                {this.state.data3 ? this.state.data3.map((item, key) => {
                    if (item.Innings[0] && item.Innings[0].next_batsman)
                        for (var i = 0; i < (item.Innings[0].next_batsman).split(',').length; i++) {
                            list.push(this.player_name1((item.Innings[0].next_batsman).split(',')[i]), ',')

                        }

                    if (item.Innings[0]) {
                        return (

                            <div key={key}>

                                {(item.Innings[0].batsmen).map((head, i) => {
                                    // if (item.hasOwnProperty('fow'))
                                    return (
                                        <tr key={i} >
                                            <td> {this.player_name1(head.id)} </td>
                                            <td> {head.out_desc} </td>
                                            <td> {head.r} </td>
                                            <td> {head.b} </td>
                                            <td> {head['4s']} </td>
                                            <td> {head['6s']} </td>
                                        </tr>
                                    )
                                }
                                )
                                }

                                <div>
                                    <tr><td>Extras </td><td textAlign="right">{item.Innings[0].extras.t} (
                                        b {item.Innings[0].extras.b},
                                        lb {item.Innings[0].extras.lb},
                                        wd {item.Innings[0].extras.wd},
                                        nb {item.Innings[0].extras.nb},
                                        p {item.Innings[0].extras.p}
                                        )</td></tr>
                                    <tr><td>Total</td><td style={{ textAlign: 'right' }}> {item.Innings[0].score}({item.Innings[0].wkts}wkts, {item.Innings[0].ovr} Ovs)</td></tr>
                                    <tr><td textAlign="left">{item.Innings[0].next_batsman_label}</td><td textAlign="right">{list}</td></tr>
                                </div>
                                <div>
                                    <div className="back"> Fall of Wickets</div>
                                    <th>Batsman</th>
                                    <th>Score</th>
                                    <th>Overs</th>

                                    {item.Innings[0].fow ? item.Innings[0].fow.map((item, i) => {

                                        return (
                                            <tr key={i}>
                                                <td>{this.player_name1(item.id)}</td>
                                                <td>{item.score}</td>
                                                <td>{item.over}</td>
                                            </tr>
                                        )
                                    }) : ""}
                                </div>

                                <div>
                                    {bowling.map((item, i) => {
                                        return (
                                            <tr key={i} className="back">
                                                <th>{item.b}</th>
                                                <th>{item.o}</th>
                                                <th>{item.m}</th>
                                                <th>{item.r}</th>
                                                <th>{item.w}</th>
                                                <th>{item.nb}</th>
                                                <th>{item.wd}</th>
                                            </tr>

                                        )
                                    })}
                                    {item.Innings[0].bowlers.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td textAlign="center">{this.player_name2(item.id)}</td>
                                                <td textAlign="center">{item.o}</td>
                                                <td textAlign="center">{item.m}</td>
                                                <td textAlign="center">{item.r}</td>
                                                <td textAlign="center">{item.w}</td>
                                                <td textAlign="center">{item.n}</td>
                                                <td textAlign="center">{item.wd}</td>
                                            </tr>
                                        )
                                    })}
                                </div>
                                <div>
                                    <tr className="back"><th textAlign="center">PowerPlays</th>
                                        <th textAlign="center">Overs</th>
                                        <th textAlign="center">Runs</th>

                                    </tr>

                                    {item.Innings[0].pplay.map((item, i) => {
                                        return (
                                            <div>
                                                <tr><td textAlign="center">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                                                    <td textAlign="center">{item.from}-{item.to}</td>
                                                    <td textAlign="center">{item.runs}</td>

                                                </tr>
                                            </div>
                                        )

                                    }
                                    )
                                    }

                                </div>

                            </div>
                        )

                    }
                    else {


                        return (
                            <div>

                            </div>

                        )

                    }
                }) : <p>Wait.. Data is fetching/</p>
                }




                <div>
                    {this.state.data3 ? this.state.data3.map((item, key) => {
                        if (item.Innings[1] && item.Innings[1].next_batsman)
                            for (var i = 0; i < (item.Innings[1].next_batsman).split(',').length; i++) {
                                list1.push(this.player_name2((item.Innings[1].next_batsman).split(',')[i]), ',')


                            }
                        if (item.Innings[1])
                            return (
                                <div key={key} className="batteam">
                                    {item.Innings[1].bat_team_name} Innings
                                </div>
                            )
                    }
                    ) : <p>Wait.. Data is fetching/</p>}
                </div>
                {/* {heading.map((item, i) => {
                    return (
                        <tr key={i}>
                            <th>{item.batsman}</th>
                            <th>{item.dismissal}</th>
                            <th>{item.runs}</th>
                            <th>{item.balls}</th>
                            <th>{item['4s']}</th>
                            <th>{item['6s']}</th>
                        </tr>

                    )
                })} */}
                <tbody>
                    {this.state.data3 ? this.state.data3.map((item, key) => {
                        if (item.Innings[0] && item.Innings[1]) {
                            return (
                                <div key={key}>

                                    {(item.Innings[1].batsmen).map((head, i) => {
                                        return (
                                            <tr key={i}>
                                                <td> {this.player_name2(head.id)} </td>
                                                <td> {head.out_desc} </td>
                                                <td> {head.r} </td>
                                                <td> {head.b} </td>
                                                <td> {head['4s']} </td>
                                                <td> {head['6s']} </td>
                                            </tr>
                                        )
                                    }
                                    )
                                    }

                                    <div>
                                        <tr><td>Extras </td><td textAlign="right">{item.Innings[0].extras.t} (
                                        b {item.Innings[1].extras.b},
                                        lb {item.Innings[1].extras.lb},
                                        wd {item.Innings[1].extras.wd},
                                        nb {item.Innings[1].extras.nb},
                                        p {item.Innings[1].extras.p}
                                            )</td></tr>
                                        <tr><td>Total</td><td style={{ textAlign: 'right' }}> {item.Innings[1].score}({item.Innings[1].wkts}wkts, {item.Innings[1].ovr} Ovs)</td></tr>
                                        <tr><td>{item.Innings[0].next_batsman_label}</td><td textAlign="right">{list1}</td></tr>
                                    </div>
                                    <div>
                                        Fall of Wickets
                                                 <th>Batsman</th>
                                        <th>Score</th>
                                        <th>Overs</th>

                                        {item.Innings[1].fow.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{this.player_name2(item.id)}</td>
                                                    <td>{item.score}</td>
                                                    <td>{item.over}</td>
                                                </tr>
                                            )
                                        })}
                                    </div>

                                    <div>
                                        {bowling.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <th>{item.b}</th>
                                                    <th>{item.o}</th>
                                                    <th>{item.m}</th>
                                                    <th>{item.r}</th>
                                                    <th>{item.w}</th>
                                                    <th>{item.nb}</th>
                                                    <th>{item.wd}</th>
                                                </tr>

                                            )
                                        })}
                                        {item.Innings[1].bowlers.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{this.player_name1(item.id)}</td>
                                                    <td>{item.o}</td>
                                                    <td>{item.m}</td>
                                                    <td>{item.r}</td>
                                                    <td>{item.w}</td>
                                                    <td>{item.n}</td>
                                                    <td>{item.wd}</td>
                                                </tr>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <tr className="back"><th textAlign="center">PowerPlays</th>
                                            <th textAlign="center">Overs</th>
                                            <th textAlign="center">Runs</th>

                                        </tr>

                                        {item.Innings[1].pplay.map((item, i) => {
                                            return (
                                                <div>
                                                    <tr><td textAlign="center">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                                                        <td textAlign="center">{item.from}-{item.to}</td>
                                                        <td textAlign="center">{item.runs}</td>

                                                    </tr>
                                                </div>
                                            )

                                        }
                                        )
                                        }

                                    </div>

                                </div>
                            )

                        }
                        else {
                            return (
                                <div>

                                    {
                                        this.state.data4 ? this.state.data4.map((item, key) => {
                                            // if (item.team1.squad_bench)
                                            //     console.log(item.team1.squad_bench)
                                            // for (var i = 0; i < (item.team1.squad_bench).length; i++) {
                                            //     list2.push(this.player_name1((item.team1.squad_bench)[i]))
                                            //     console.log(list2)
                                            // }

                                            return (
                                                <div>
                                                    <h3>Match Info</h3>
                                                    <tr>
                                                        <td>Match</td>
                                                        <td>{item.team1.s_name} vs {item.team2.s_name}, {item.header.match_desc}, Indian Premier League 2019 </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Toss</td>
                                                        <td>{item.header.toss ? item.header.toss : "Toss still to come"}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Venue</td>
                                                        <td>{item.venue.name}, {item.venue.location}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Umpires</td>
                                                        {item.official ?
                                                            <td>{item.official.umpire1.name}, {item.official.umpire2.name}</td> : ""}
                                                    </tr>
                                                    <tr>
                                                        <td>Third Umpire</td>
                                                        <td>{item.official ? item.official.umpire3.name : ""}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Match Refree</td>
                                                        <td>{item.official ? item.official.referee.name : ""}</td>
                                                    </tr>
                                                    {/* <tr>

                                                        <tr><td>{item.team1.name} Squad</td></tr>
                                                        <tr><td>Playing XI</td>
                                                            <td>{item.team1.squad}</td>
                                                        </tr>
                                                    </tr> */}

                                                </div>

                                            )

                                        }) : <div> Data is fetching</div>
                                    }

                                </div>

                            )
                        }
                    }) : <p>Wait.. Data is fetching/</p>
                    }



                </tbody>


            </table>
        )

    }

}

export default Scorecard