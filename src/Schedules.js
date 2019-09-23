import React, { Component } from 'react';
import './style.css'
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";


var allMatches = {}


class Schedules extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data1: [],
            data2: [],
            selectValue: 'Team'
        }
    }

    handleClick(id) {
        // <a href="/scorecard" onClick={this.onClick.bind(this)}>Scorecard</a>
        window.location.href = "/scorecard/?matchId=" + id
        console.log("id", id)
    }


    componentDidMount() {

        let data1 = fetch('http://mapps.cricbuzz.com/cbzios/series/2810/matches').then((resp) => {
            resp.json().then((resp) => {
                console.log(resp)
                allMatches = resp.matches
                this.setState({
                    data1: resp.matches
                })

            })

        })

        let data2 = fetch('http://mapps.cricbuzz.com/cbzios/series/2810/teams/').then((resp) => {
            resp.json().then((resp) => {
                console.log(resp.teams)
                this.setState({
                    data2: resp.teams
                })
            })
        })


    }

    handleSelection(e) {
        console.log(e.target.value)
        // this.setState({ selectValue: e.target.value });
        if (e.target.value !== "all") {
            let selectedTeamMatches = allMatches.filter(item => item.team1.id === e.target.value || item.team2.id === e.target.value).reverse();
            this.setState({
                data1: selectedTeamMatches
            })
        } else {
            this.setState({
                data1: allMatches
            })
        }


    }

    render() {
        if (this.state.data1)
            return (
                <div>
                    <div style={{ padding: '10px' }}>
                        <select class="mdb-select md-form"
                            // value={this.state.selectValue}
                            onChange={this.handleSelection.bind(this)}>
                            <option value="all" >All Teams</option>
                            <option value="58">Chennai Super Kings</option>
                            <option value="62">Mumbai Indians</option>
                            <option value="61">Delhi Capitals</option>
                            <option value="255">Sunrisers Hyderabad</option>
                            <option value="63">Kolkata Knight Riders</option>
                            <option value="65">Kings XI Punjab</option>
                            <option value="59">Royal Challengers Banglore</option>
                            <option value="64">Rajasthan Royals</option>
                        </select>
                    </div>
                    <table className="table">
                        <tr className="back">
                            <th>Match</th>
                            <th>Details</th>
                            <th>Venue</th>
                        </tr>
                        {this.state.data1 ? this.state.data1.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <td>{item.header.match_desc}</td>
                                    <td><p onClick={this.handleClick.bind(this, item.match_id)} className="hover">{item.team1.name} vs {item.team2.name}</p>
                                        <p className="status">{item.header.status}</p>
                                    </td>
                                    <td>{item.venue.name}, {item.venue.location.split(',')[0]}</td>

                                </tr>
                            )

                        }) : <div>Data is fetching </div>
                        }
                    </table>
                </div>
            )

    }

}

export default Schedules