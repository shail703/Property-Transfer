import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import PropertyTransfer from'../abis/PropertyTransfer.json'
import Navbar from './Navbar.js'
import Main from './Main.js'

class App extends Component {

  async  componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchaindData()
  }
    
  async loadWeb3(){
    if(window.ethereum){
      window.web3= new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3= new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask!!')
    }
  }
  
  async loadBlockchaindData(){
    const web3 = window.web3
    const accounts= await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    console.log(accounts[0])
    const networkId= await web3.eth.net.getId()
    const networkdata=PropertyTransfer.networks[networkId]
    if(networkdata){
    const propertytransfer=web3.eth.Contract(PropertyTransfer.abi,networkdata.address)
    this.setState({propertytransfer})
    const totalNoOfProperty=await propertytransfer.methods.totalNoOfProperty().call()
    this.setState({totalNoOfProperty})
    console.log(totalNoOfProperty.toString())
    

    this.setState({loading:false})
    }else{
      window.alert('Contract is not deployed. ')
    }  

  }

  constructor(props){
    super(props)
    this.state={
      account:'',
      totalNoOfProperty:0,
      propertiesOwner:[],
      individualCountOfPropertyPerOwner:[],
      loading:true
    }

    this.allotProperty = this.allotProperty.bind(this)
    this.transferProperty = this.transferProperty.bind(this)
  }

  allotProperty(_verifiedowner,_propertyname){
    
    this.state.propertytransfer.methods.allotProperty(_verifiedowner,_propertyname).send({from:this.state.account})
    .once('receipt',(receipt)=>{
      this.setState({loading:false})
    })
  }

  transferProperty(newowner,propertyname_){
    this.state.propertytransfer.methods.transferProperty(newowner,propertyname_).send({from:this.state.account})
    .once('receipt',(receipt)=>{
      this.setState({loading:false})
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
             { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                allotProperty={this.allotProperty}
                transferProperty={this.transferProperty}
                />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
