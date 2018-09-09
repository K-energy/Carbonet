import React from 'react'
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

import token from './token'

import WalletCard from './WalletCard'

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

const TransactionCard = (props) => {
    return (
        <Card style={{width:'250px',backgroundColor:green['100']}}>
            <CardHeader
                avatar={
                    <Avatar style={{backgroundColor:green['400']}}>
                        <Icon>multiline_chart</Icon>
                    </Avatar>
                }
                title={props.trans}
                subheader={'USD'}
            >
            </CardHeader>
        </Card>
    )
}

const UpdateCard = (props) => {
    return (
        <Card style={{width:'250px',backgroundColor:purple['100']}}>
            <CardHeader
                avatar={
                    <Avatar style={{backgroundColor:purple['400']}}>
                        <Icon>date_range</Icon>
                    </Avatar>
                       }
                title={props.update}
                subheader="Last update"
            >
            </CardHeader>
        </Card>
    )
}

const TransactionItemCard = (props) => (
    <Card style={{width:'100%',backgroundColor:green['300'],marginBottom:'20px'}} title={props.from}>
        <CardHeader
            title={props.time.toLocaleTimeString()}
            subheader={'receive from : '+ props.from.substr(0, 6) + '... ' +'\n'+ (props.value/1e9).toFixed(5) }
            style={{width: '100%'}}
        >
        </CardHeader>
    </Card>
)

const SpendingItemCard = (props) => (
    <Card style={{width:'100%',backgroundColor:orange['300'],marginBottom:'20px'}} title={props.from}>
        <CardHeader
            title={props.time.toLocaleTimeString()}
            subheader={'send to : '+ props.from.substr(0, 6) + '... ' +'\n'+ (props.value/1e9).toFixed(5) }
            style={{width: '100%'}}
        >
        </CardHeader>
    </Card>
)

class HomePage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            bal : '',
            trans : '',
            update : '',
            label: [],
            data: [],
            transactions: [],
            endpoint : 'http://10.10.3.65:5000'
        }
        
    }

    getBalance = () => {
        token.balanceOf.call('0xaa9De66C07F9F6D57E0F488Fe9B7B5b209C87cDd', (err, balance) => {
            this.setState({
                bal: (balance.toNumber()/1e9).toFixed(2),
                usd: ((balance.toNumber()/1e9) * 9.37).toFixed(2)
            })
        })
    }

    componentDidMount(){
        var socket = socketIOClient(this.state.endpoint)
        socket.on('receive',(data)=>{
            if (data.returnValues[1] == '0xaa9De66C07F9F6D57E0F488Fe9B7B5b209C87cDd'){
                if (this.state.data.length <= 20){
                    this.setState({data: [ ...this.state.data, data.returnValues[2]/1e9] })
                }
                else{
                    this.setState({data: [ ...this.state.data.slice(1), data.returnValues[2]/1e9] })
                } 
                this.getBalance()
                this.setState({transactions: [...this.state.transactions, { ...data.returnValues, time: new Date(), to: false }]})
                this.setState({update: new Date().toLocaleTimeString()})
            }
            else if (data.returnValues[0] == '0xaa9De66C07F9F6D57E0F488Fe9B7B5b209C87cDd'){
                this.getBalance()
                this.setState({transactions: [...this.state.transactions, { ...data.returnValues, time: new Date(), to: true }]})
                this.setState({update: new Date().toLocaleTimeString()})
            }
        })
        axios.get('/api/meta').then((res)=>{
            this.setState({bal:res.data.balance,trans:res.data.transactions})
        })
    }

    render(){
        return(
            <React.Fragment>
            <Paper style={{position:'static',background:lightBlue['100'],height:'50px',width:'100%',padding:'7px'}}>
                <img style={{height:'100%'}} src={require('../assets/img/carbonet.png')}/>
            </Paper>
            <div style={{height:'30px'}}/>
            
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',width:'70%'}}>
                    <WalletCard bal={this.state.bal} usd={this.state.usd}/>   
                    <TransactionCard trans={this.state.usd}/>
                    <UpdateCard update={this.state.update}/>
                </div>
                <div style={{height:'20px'}}/>

                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',width:'100%'}}>
                    <Paper style={{height:'60vh',width:'60%',padding:'20px',backgroundColor:grey['100']}}>
                        <Line 

                            data={{
                                labels:this.state.data.map((_, i) => i),
                                datasets: [
                                  {
                                    label: 'Carbon credits (tCO2e)',
                                    fill: false,
                                    lineTension: 0.1,
                                    backgroundColor: 'rgba(75,192,192,0.4)',
                                    borderColor: 'rgba(75,192,192,1)',
                                    borderCapStyle: 'butt',
                                    borderDash: [],
                                    borderDashOffset: 0.0,
                                    borderJoinStyle: 'miter',
                                    pointBorderColor: 'rgba(75,192,192,1)',
                                    pointBackgroundColor: '#fff',
                                    pointBorderWidth: 6,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: this.state.data
                                  }
                                ]
                              }}
                            options={{
                                maintainAspectRatio: false,
                                legend:{display:true},
                            }}
                        />
                    </Paper>
                    <Paper style={{height:'60vh',width:'30%',padding:'20px',overflowY:'scroll',backgroundColor:orange['100']}}>
  
                        {this.state.transactions.reverse().map((tran,idx)=>{
                            return(
                                tran.to ?
                                <SpendingItemCard
                                    from={tran[1]}
                                    value={tran[2]}
                                    time={tran.time}
                                />
                                :
                                <TransactionItemCard
                                    from={tran[0]}
                                    value={tran[2]}
                                    time={tran.time}
                                />
                                
                            
                            )
                        })}
                    </Paper>
                </div>

                
            </div>

            </React.Fragment>
        )
    }
}

export default HomePage