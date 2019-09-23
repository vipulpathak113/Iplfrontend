import React, { Component } from 'react';
import './style.css'


class Commentary extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data1: []
        }
    }


    componentDidMount() {
        var matchId = new URLSearchParams(window.location.search).get('matchId');
        this.interval = setInterval(() => {
            let data1 = fetch(`http://mapps.cricbuzz.com/cbzios/match/${matchId}/commentary`).then((resp) => {
                resp.json().then((resp) => {
                    console.log(resp)
                    this.setState({
                        data1: [resp]
                    })
                })
            })
        }, 1000);
    }

    render() {
        return (
            <div>

                {this.state.data1 ? this.state.data1.map((item, key) => {
                    if (item.bow_team.innings[0]) {
                        return (
                            <div>
                                <div style={{ marginLeft: '590px', marginTop: '20px', borderBlockColor: 'black' }}>
                                    <div>Key Stats</div>
                                    <div>Last Wicket: {item.last_wkt_name} {item.last_wkt_score}</div>
                                    <div>Partnership: {item.prtshp}</div>
                                </div>
                                <table className="table" style={{ width: '570px' }}>
                                    <tr><td>{item.bow_team.name} {item.bow_team.innings[0].score}/{item.bow_team.innings[0].wkts}</td>
                                        <td></td></tr>

                                    {item.bat_team.innings[0] ?
                                        <tr><td>{item.bat_team.name} {item.bat_team.innings[0].score}/{item.bat_team.innings[0].wkts}</td>
                                            <td></td></tr>
                                        : ""
                                    }


                                    <tr><td>{item.header.status}</td></tr>
                                    <p>Batting</p>
                                    <tr style={{ padding: '10px' }}>
                                        <th>Batsman</th>
                                        <th>R</th>
                                        <th>B</th>
                                        <th>4s</th>
                                        <th>6s</th>
                                    </tr>

                                    <tr><td>{item.batsman[0].name}</td>
                                        <td>{item.batsman[0].r}</td>
                                        <td>{item.batsman[0].b}</td>
                                        <td>{item.batsman[0]['4s']}</td>
                                        <td>{item.batsman[0]['6s']}</td>
                                    </tr>
                                    <tr><td>{item.batsman[1].name}</td>
                                        <td>{item.batsman[1].r}</td>
                                        <td>{item.batsman[1].b}</td>
                                        <td>{item.batsman[1]['4s']}</td>
                                        <td>{item.batsman[1]['6s']}</td>
                                    </tr>

                                    <p>Bowling</p>
                                    <tr>
                                        <th>Bowler</th>
                                        <th>O</th>
                                        <th>M</th>
                                        <th>R</th>
                                        <th>W</th>
                                    </tr>

                                    <tr><td>{item.bowler[0].name}</td>
                                        <td>{item.bowler[0].o}</td>
                                        <td>{item.bowler[0].m}</td>
                                        <td>{item.bowler[0].r}</td>
                                        <td>{item.bowler[0].w}</td>
                                    </tr>


                                </table>


                            </div>
                        )
                    }

                }) : <div>Data is fetching </div>
                }

            </div>
        )
    }

}

export default Commentary