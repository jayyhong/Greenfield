import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FriendsList from './FriendsList'
import { Link } from 'react-router-dom';
import axios from 'axios'
import axiosRoutes from './CreateTripPageAxiosRoutes'
import {Redirect} from 'react-router-dom'
import {Button, Icon, Row, Input} from 'react-materialize'

class Create extends Component {
  constructor(){
    super();
    this.state = {

      // hideInvite: false,

      fromDate: '',

      toDate: '',

      showInvite: true,
      //Invited Friends storage
      friends: [],

      display: false,

      // displayEventPage: false,

      //Trip info

      tripName: '',

      location: '',

      description: '',

      friendsData: ''
    }
    
    this.inviteFriends = this.inviteFriends.bind(this)
    this.uninviteFriend = this.uninviteFriend.bind(this)
    this.invite = this.invite.bind(this)
    this.done = this.done.bind(this)
    this.eventFromDate = this.eventFromDate.bind(this)
    this.eventToDate = this.eventToDate.bind(this)
    this.finalize = this.finalize.bind(this)
    this.tripNameData = this.tripNameData.bind(this)
    this.locationNameData = this.locationNameData.bind(this)
    this.descriptionData = this.descriptionData.bind(this)
    this.initAutocomplete = this.initAutocomplete.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    // this.hideInvite = this.hideInvite.bind(this)
  }

  // hideInvite(){
  //   if(this.state.hideInvite === false){
  //   this.setState({hideInvite: true})
  //   console.log('hideInvite')
  //   } else {
  //   this.setState({hideInvite: false})
  //   }
  // }
componentWillMount() {
  console.log('MOUNTED CREATE')
}

componentDidMount() {
  // axiosRoutes.getUserFriends()
  //   .then((res)=>{
  //     console.log('res.body in componentdidmount = ', res.data[0].friend)
  //     this.setState({friendsData: res.data[0].friend})
  //   })
  //   .catch((err) =>{
  //     console.log(err)
  //   })
}
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
//auth0 login
  login() {
    this.props.auth.login();
  }

//Invite Frinends Button
  inviteFriends(){
    this.setState({display: true})
  }

//Uninvite Friends button
  uninviteFriend(friend){
    for(var i = 0; i < this.state.friends.length; i++) {
      if(friend === this.state.friends[i]) {
        this.state.friends.splice(i, 1)
        this.setState({friends: this.state.friends})
      }
    }
    console.log(this.state.friends)
    console.log(friend + ' was uninvited')
  }

//Invite friends list invite button
  invite(friend){
    for (var i = 0; i < this.state.friends.length; i++) {
      if (friend.name === this.state.friends[i]) {
        return alert('Friend already invited')
      }
    }
    console.log('Clicked on friend')
    console.log(friend)
    this.state.friends.push(friend.name)
    this.setState({
      friends: this.state.friends
    })
  }

//When finished inviting friends Button
  done(){
    this.setState({display: false})
    console.log(this.state.friends)
  }


//grab all trip data and put it into an object to pass into database
// title, destination, startDate, endDate
  finalize() {
    const tripInfo = {
      title: this.state.tripName,
      destination: this.state.location,
      description: this.state.description,
      startDate: this.state.fromDate,
      endDate: this.state.toDate
    }
    //post request to database
    axiosRoutes.postTripInfo(tripInfo)
      .then((res) => {
        axiosRoutes.postInvitedFriends
        //using the new trip info we will redirect them from here
        this.goTo.call(this, res.body.id)

        console.log(res.body)
      })
      .catch((err)=> {
        //take this out once we get servers linked
        this.goTo.call(this, 'event/1')
        console.log(err)
        console.log(tripInfo)
      })

  }

//Event listeners to populate fields onchange
  tripNameData(events) {
    this.setState({tripName: events.target.value})
    console.log('Trip Name: ',events.target.value)
  };
  locationNameData(events) {
    this.setState({location: events.target.value})
    console.log('Location: ',events.target.value)
  };
  descriptionData(events) {
    this.setState({description: events.target.value})
    console.log('Description: ',events.target.value)
  };
  eventFromDate(events) {
    this.setState({fromDate: events.target.value})
    console.log(this.state.fromDate)
  };
  eventToDate(events) {
    this.setState({toDate: events.target.value})
    console.log(this.state.toDate)
  };

handleFormSubmit(){
    this.initAutocomplete();
  }

 initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var placeSearch, autocomplete;
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});
    // console.log(“document.getElementById in initAutocomplet”, document.getElementById(‘autocomplete’).value);
    // console.log(“autocomplete return object in initAutocomplete”, autocomplete.getPlace())
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', ()=>{
      console.log("is it in autocomplete?",autocomplete.getPlace().geometry.location);
      this.setState({
        searchedLocation : autocomplete.getPlace().geometry.location
      })

    });
    
 }

  render() {
    console.log(this.props.location)
  //Invite Friends List on "Invite Friends" click
  //Popup friends list/invite list
    if (this.state.display === true) {
      return (
      <div>
        <h1>Friends List</h1>
        <FriendsList 
        friends = {this.state.friendsData} 
        invite = {this.invite}
        done = {this.done}
        hideInvite = {this.hideInvite}
        />
      </div>
      )
  }

  /*if (this.state.displayEventPage === true) {
    return (
      <div>
        <EventPage 
        tripName={this.state.tripName} 
        location={this.state.location} 
        description={this.state.description} 
        toDate={this.state.toDate}
        fromDate={this.state.fromDate}
        friends={this.state.friends}
        displayEventPage={this.finalize}
        />
      </div>
    )
  }*/

const { isAuthenticated } = this.props.auth;
        
        if (!isAuthenticated()) {
          return (
          <Redirect to ={{
            pathname: '/'
          }} />
          )
        }

    return (
      <div> 

          {/*<div id="topHalf">
            <h2>Create Trip</h2>
            <input id="tripName" type = 'text' placeholder = "Trip name" ></input>
          <br></br>
            <input id="location" type = 'text' placeholder = 'Location/Address' onChange={this.locationNameData}></input>
          <br></br>
            <textarea name="description" placeholder ="Description Details" onChange={this.descriptionData}></textarea>
          </div>*/}

          <div className="input field" style={{marginLeft: 30 + "px", marginTop: 30 + "px", marginRight: 30 + "px"}}>
            <Row>
                <Input style={{height: 70 + "px", fontSize: 30 + "px"}} placeholder="Trip Name" s={12} label="Trip Name" onChange={this.tripNameData}/>
                <input id="autocomplete" type="text" style={{height: 40 + "px", fontSize: 20 + "px"}} placeholder="Destination" s={12} label="Destination" onChange={this.handleFormSubmit}/>
                <Input style={{fontSize: 15 + "px"}}placeholder="Description" s={12} label="Description" onChange={this.descriptionData}/>
            </Row>
          </div>

          <div id="bottomHalf" style={{marginLeft: 30 + "px", marginRight: 50 + "%"}}>
            {/*Dropdown calendars*/}
            <span>From:</span>
            <input style={{height: 50 + "px", fontSize: 15 + "px"}} type="date" onChange={this.eventFromDate}/>
            <span> To:</span>
            <input style={{height: 50 + "px", fontSize: 15 + "px"}} type="date" onChange={this.eventToDate}/>
            <br></br>
            
            {/*Invite friends pop up*/}
            <button className="btn" onClick={this.inviteFriends}>Invite Friends</button>
            <br></br>
            
            {/*go to event page*/}
            
              <button className="finalize" onClick = {this.finalize}>Finalize Trip</button>
            
          </div>

          {/*Render Invited Friends*/}
          <div id="invitedFriends">
            <Friends friends={this.state.friends} uninviteFriend={this.uninviteFriend} />
          </div> 


      </div>
    ) 

  } //end render bracket
} //end Create component bracket

//Render invited friends onto Create Page
const Friends = ({friends, uninviteFriend}) => (
  <div>
  {friends.map((friend, key) => {
    return <div>
    <p>{friend}
    <button className="uninvite" onClick={() => {uninviteFriend(friend)}}>Uninvite</button>
    </p>
    </div>
  })
  }
  </div>
)

export default Create