import React, { Component } from 'react';
class Main extends Component {
render() {
    return (
        <div id="content">
        <h2>Allot Property</h2>
          <form  onSubmit={(event) => {
          event.preventDefault()
          const _verifiedowner = this.ownership.value
          const _propertyname = this.property_name.value
          this.props.allotProperty(_verifiedowner,_propertyname)
        }}  >
            <div className="form-group mr-sm-2" id="content">
            <input
              id="ownership"
              type="text"
              ref={(input) => { this.ownership = input }}
              className="form-control"
              placeholder="Owner's Address"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="property_name"
              type="text"
              ref={(input) => { this.property_name = input }}
              className="form-control"
              placeholder="Property Name"
              required />
              <button type="submit" className="btn btn-primary" >Allot Property</button>
          </div>
          </form>  

           <h2>Transfer property</h2>
           <form onSubmit={(event) => {
          event.preventDefault()
          const newowner = this.newownership.value
          const propertyname_ = this.propertyname.value
          this.props.transferProperty(newowner,propertyname_)
        }}>
           <div className="form-group mr-sm-2" id="content">
            <input
              id="newownership"
              type="text"
              ref={(input) => { this.newownership = input }}
              className="form-control"
              placeholder="Address of receiver"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="propertyname"
              type="text"
              ref={(input) => { this.propertyname = input }}
              className="form-control"
              placeholder="Property Name"
              required />
          </div>
          <button type="submit" className="btn btn-primary" >Transfer Property</button>
       
           </form>

        </div>
    );
  }
}

export default Main;