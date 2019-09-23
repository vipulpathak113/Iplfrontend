import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// import Background from './IPL-logo.jpg'

class PointsTable extends Component {
    constructor() {
        super();
        this.state = {
            data1: null,
        }
    }

    onClick() {
    }

    componentDidMount() {
        var matchkiid;
        let data1 = fetch('http://127.0.0.1:8000/points/').then((resp) => {
            resp.json().then((resp) => {
                console.log(resp)
                this.setState({ data1: resp })
            })
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <h1 color="red">IPL POINTS TABLE 2019</h1>
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                <th><center>Team</center></th>
                                <th><center>Played</center></th>
                                <th><center>Won</center></th>
                                <th><center>Lost</center></th>
                                <th><center>Points</center></th>
                                <th><center>Net Run Rate</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data1 ? this.state.data1.map((item, key) => {
                                return (
                                    <tr key={key} >
                                        <td><center>{item.team_name}</center></td>
                                        <td><center>{item.played}</center></td>
                                        <td><center>{item.won}</center></td>
                                        <td><center>{item.lost}</center></td>
                                        <td><center>{item.points}</center></td>
                                        <td><center>{item.nrr}</center></td>
                                    </tr>
                                )

                            }) : <tr><td>Wait.. Data is fetching/</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default PointsTable;