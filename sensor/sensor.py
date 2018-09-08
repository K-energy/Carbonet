# coding: utf-8

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time


#we're pretending that the xlsx file is real-time data from the sensor

df = pd.read_excel('/media/tan/Local Disk/Users/Admin/Desktop/SEHackathon/Document for Hackathon/Document for Hackaton/Att1 - Online daily data.xlsx')

#rename the columns
df.columns = ['Date', 'Site-A',
       'Site-B',
       'Site-C',
       'Site-D',
       'Site-E']

#fill na with 0
df = df.fillna(0)

#remove last row (sum values)
daily_sum = df['Site-A'].iloc[:365].astype(int)


from web3 import Web3, HTTPProvider, IPCProvider, WebsocketProvider
from solc import compile_source
from web3.middleware import geth_poa_middleware

#join blockchain network
w3 = Web3(HTTPProvider('http://10.10.1.177:8545'))
w3.middleware_stack.inject(geth_poa_middleware, layer=0)

def_acc = w3.eth.accounts[0]
w3.eth.defaultAccount = def_acc

target_address = '0x359063cbfc1f2455ad9c0893f906a95ed98ffd55'
with open('SensorReading.sol') as source_code_file:
    code = source_code_file.read()
compiled_sol = compile_source(code)
contract_interface = compiled_sol['<stdin>:SensorReading']
csa = Web3.toChecksumAddress(target_address)

Target = w3.eth.contract(address = csa, abi=contract_interface['abi'])




#the same as for loop but with visualization

import dash
from dash.dependencies import Output, Event
import dash_core_components as dcc
import dash_html_components as html
import plotly
import random
import plotly.graph_objs as go
from collections import deque
import requests

X = deque(maxlen=20)
X.append(1)
Y = deque(maxlen=20)
Y.append(1)

i=0

app = dash.Dash(__name__)

app.layout = html.Div(
    [
        dcc.Graph(id='live-graph', animate=True),
        dcc.Interval(
            id='graph-update',
            interval=1*5000
        ),
    ]
)

@app.callback(Output('live-graph', 'figure'),
              events=[Event('graph-update', 'interval')])
def update_graph_scatter():
    global i
    i = (i+1)%daily_sum.shape[0] # iterate through data
    X.append(X[-1]+1)
    new_values = int(daily_sum.iloc[i])
    Y.append(new_values)
    print('Current val : ', new_values)
    data = {'time' : time.time(), 'val' : new_values}
    
    
    Target.functions.receiveSensorReading(new_values).transact() #create a transaction in blockchain
    #requests.post(url = 'http://10.10.3.65:5000/api/receivedata',data=data) 
    print('Current block : ',w3.eth.blockNumber) #see current block number of the chain
    print()

    data = plotly.graph_objs.Scatter(
            x=list(X),
            y=list(Y),
            name='Scatter',
            mode= 'lines+markers'
            )

    return {'data': [data],'layout' : go.Layout(xaxis=dict(range=[min(X),max(X)]),
                                                yaxis=dict(range=[min(Y),max(Y)]),)}



if __name__ == '__main__':
    app.run_server(debug=False)

