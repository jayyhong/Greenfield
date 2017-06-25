import axios from 'axios'

module.exports = {

  getOneUser: (idToken) => (
    //should return the userObj that matches auth0 token
    axios.get(`http://localhost:3000/getOneUser/${idToken}`)
  ),
  postNewUser: (idToken) => (
    axios.post(`http://localhost:3000/postNewUser`, {
      idToken: idToken
    })
  ),
  getUserUpcomingTrips: (userId) => (
    //should return array of upcomingTrips for a given userId
    axios.get(`http://localhost:3000/getUserUpcomingTrips/${userId}`)
  ),
  getAllUserTrips: (userId) => (
    axios.get(`http://localhost:3000/getUserPreviousTrips/${userId}`)
  ),
  getUserPreviousTrips: (userId) => (
    //should return array of previousTrips for a given userId
    axios.get(`http://localhost:3000/getUserPreviousTrips/${userId}`)
  ),
  postUserProfilePic: (userId, imgUrl) => (
    //should post/update imgUrl of a given userid
    axios.post(`http://localhost:3000/postUserProfilePic/${userId}`, {
      url: imgUrl
    })
  ),
  postUserProfileInfo: (userId, userData) => (
    //should post/update userprofileinfo with a given userId
    axios.post(`http://localhost:3000/postUserProfileInfo/${userId}`, {
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email
    })
  )
  
}

// id, firstname, lastname, email, idtoken