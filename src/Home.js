import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// import Background from './IPL-logo.jpg'

class Home extends Component {
    constructor() {
        super();
        this.state = {
            data1: null,
            data2: [],
            data3: [],
            matchId: ""
        }
    }

    handleClick(id) {
        // <a href="/scorecard" onClick={this.onClick.bind(this)}>Scorecard</a>
        window.location.href = "/scorecard/?matchId=" + id
        console.log("id", id)
    }

    commentary(id) {
        window.location.href = "/commentary/?matchId=" + id
        console.log("id", id)
    }


    componentDidMount() {
        // setInterval(function () {
        //     window.location.reload();
        // }, 5000);
        var matchkiid;
        let data2 = fetch('http://mapps.cricbuzz.com/cbzios/series/2810/matches')
            .then((resp) => {
                resp.json().then((resp) => {
                    let matchInfo = resp.matches.find(item => item.header.state === "inprogress" || item.header.state === "innings break")
                    let matchInfo1 = resp.matches.find(item => item.header.state === "preview")
                    if (matchInfo) {
                        matchkiid = matchInfo.match_id;
                    }

                    else {
                        matchkiid = matchInfo1.match_id;

                    }
                    this.setState({ data2: resp.matches })
                    // this.score();
                    this.interval = setInterval(() => {
                        let data = fetch(`http://mapps.cricbuzz.com/cbzios/match/${matchkiid}/commentary`).then((resp) => {
                            resp.json().then((resp) => {
                                console.log("hi")
                                this.setState({ data3: [resp] })
                            })
                        })
                    }, 500);
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container-fluid">
                <h4 style={{ padding: '10px' }}>Live Score</h4>
                <div>
                    {this.state.data2 ? this.state.data2.map((item, key) => {

                        if (item.header.state === "inprogress" || item.header.state === "innings break")
                            return (
                                < div key={key}  >
                                    <p style={{ background: 'black', color: 'white', cursor: "pointer" }} onClick={this.handleClick.bind(this, item.match_id)}><strong>{item.team1.name.toUpperCase()}</strong> vs <strong>{item.team2.name.toUpperCase()}</strong></p>
                                    <div onClick={this.commentary.bind(this, item.match_id)} style={{ cursor: "pointer" }}>Commentary</div>
                                </div>
                            )
                        else if (item.header.state === "preview") {
                            return (
                                < div key={key} onClick={this.handleClick.bind(this, item.match_id)} style={{ cursor: "pointer" }}>
                                    <p style={{ background: 'black', color: 'white' }} ><strong>{item.team1.name.toUpperCase()}</strong> vs <strong>{item.team2.name.toUpperCase()}</strong></p>
                                </div>
                            )
                        }
                    }) : <p>Wait.. Data is fetching/</p>}
                </div>
                <div>
                    {this.state.data3 ? this.state.data3.map((item, key) => {
                        if (item.hasOwnProperty('bow_team')) {
                            return (
                                < div key={key} >
                                    <div class="row">
                                        <div className="col-sm-12 col-md-4 box">
                                            <strong>{item.bow_team.name}</strong> {item.bow_team.innings[0].score}/{item.bow_team.innings[0].wkts} ({item.bow_team.innings[0].overs} Ovs)
                 <p> <strong>{item.bat_team.name}</strong> {item.bat_team.innings[0].score}/{item.bat_team.innings[0].wkts} ({item.bat_team.innings[0].overs} Ovs)</p>
                                            <p><b> Batting </b></p>
                                            <p> {item.batsman[0].name}* {item.batsman[0].r}({item.batsman[0].b})</p>
                                            {item.batsman[1] ?
                                                <p>{item.batsman[1].name} {item.batsman[1].r}({item.batsman[1].b})</p>
                                                : ""
                                            }

                                            <p><b>Bowling</b></p>
                                            <p> {item.bowler[0].name} {item.bowler[0].w}-{item.bowler[0].r}({item.bowler[0].o})</p>
                                            <p style={{ color: 'blue' }}>{item.header.status}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        else if (!item.hasOwnProperty('bow_team') && item.hasOwnProperty('bat_team')) {

                            return (
                                < div key={key} >


                                    {/* <strong>{item.bow_team.name}</strong> {item.bow_team.innings[0].score}/{item.bow_team.innings[0].wkts} ({item.bow_team.innings[0].overs} Ovs) */}
                                    <p> <strong>{item.bat_team.name}</strong> {item.bat_team.innings[0].score}/{item.bat_team.innings[0].wkts} ({item.bat_team.innings[0].overs} Ovs)</p>
                                    <p><b> Batting </b></p>
                                    <p> {item.batsman[0].name}*  {item.batsman[0].r}({item.batsman[0].b})</p>

                                    {item.batsman[1] ?
                                        <p>{item.batsman[1].name} {item.batsman[1].r}({item.batsman[1].b})</p>
                                        : ""
                                    }
                                    <p><b>Bowling</b></p>
                                    <p> {item.bowler[0].name} {item.bowler[0].w}-{item.bowler[0].r}({item.bowler[0].o})</p>
                                    <p style={{ color: 'blue' }}>{item.header.status}</p>
                                </div>
                            )

                        }
                        else if (!item.hasOwnProperty('bow_team') && !item.hasOwnProperty('bat_team')) {
                            return (<div>
                                <b>  Match not started yet</b>
                            </div>
                            )

                        }


                    }
                    ) : <p>Wait.. Data is fetching/</p>}
                </div>
            </div>
        )
    }
}

export default Home;
