import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import {Button,Paper,Avatar, CardHeader} from '@material-ui/core';
import {Divider,Typography,Icon} from '@material-ui/core';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import lightBlue from '@material-ui/core/colors/lightBlue';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';
import {Card} from '@material-ui/core';
import axios from 'axios'
import socketIOClient from "socket.io-client";

class WalletCard extends Component {
    
    render() {
        return (
            <Card style={{width:'250px',backgroundColor:pink['100']}}>
                <CardHeader
                    avatar={
                        <Avatar style={{backgroundColor:pink['400']}}>
                            <Icon>money</Icon>
                        </Avatar>
                    }
                    title={this.props.bal}
                    subheader={ 'carbonets'}
                >
                </CardHeader>
            </Card>
        )
    }
}

export default WalletCard