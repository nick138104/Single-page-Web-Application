import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyBG1up5kt96q0n7DiOzo1sHNe3PPePSBwY",
  authDomain: "project-comess.firebaseapp.com",
  projectId: "project-comess",
  storageBucket: "project-comess.appspot.com",
  messagingSenderId: "1010221605691",
  appId: "1:1010221605691:web:306531af0e149afd5f4d1e"
};

const app = initializeApp(firebaseConfig);
var userRef_now // userRef at that moment

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

const db = getFirestore();
const usersRef = collection(db, 'users')
const people = await getDocs(usersRef)
var pp // list of all user
if (people) {
  pp = people.docs.map((person) => ({
    docID: person.id,
    ...person.data()
  }))
}
const users_detail = pp.map((person) => {
  return { docID: person.docID, username: person.username, password: person.password }
})
//==================================================================

window.login = login
async function login() { // validate and add user to firebase
  const username = document.getElementsByName("username")[0].value;
  const password = document.getElementsByName("password")[0].value;
  if (username === "" || password === "") {
    alert('No username or password')
  }
  else {
    const check = users_detail.find(element => element.username == username);
    if (check === undefined) {
      const docRef = await addDoc(usersRef, {
        events: [],
        username,
        password,
      });
      users_detail.push({
        docID: docRef.id,
        username,
        password,
      });
      userRef_now = await doc(usersRef, `${docRef.id}`)
      firstLogin()
      resetPage()
      alert(`You login as ${username}`)
      if (!noti_on) opennoti() ;
      else {
        opennoti() ;
        setTimeout(function(){
          opennoti() ;
        },200) ; 
      }
    }
    else if (check.password != password) {
      alert('Password is not correct.')
      document.getElementsByName("password")[0].value = ""
      if (noti_on) opennoti() ;
    }
    else {
      // fix later
      if (userRef_now != undefined) resetPage()
      //console.log(check.docID)
      userRef_now = await doc(usersRef, `${check.docID}`)
      firstLogin()
      alert(`You login as ${username}`)
      if (!noti_on) opennoti() ;
      else {
        opennoti() ;
        setTimeout(function(){
          opennoti() ;
        },400) ; 
      }
    }
  }
}

//=================================================================

var fullday = {Mon : 'Monday', Tue : 'Tuesday', Wed : 'Wednesday', Thu : 'Thursday', Fri : 'Friday', Sat : 'Saturday', Sun : 'Sunday'}
window.validate_form = validate_form
async function validate_form() {
  // all the value
  const title = document.getElementById('ftitle').value
  const end_date = document.getElementsByClassName('month')[0].name.split("-")
  const link = document.getElementById('flink').value
  const repeat = document.getElementById('frepeat').checked
  const date1 = new Date(end_date[2], end_date[1], end_date[0])
  let checkdate = new Date()
  checkdate = new Date(checkdate.getFullYear(), checkdate.getMonth(), checkdate.getDate())
  if(link != "" && repeat){
    alert('Link have no feature repeat every week')
  }
  else if (title != "" && date1 >= checkdate) {// add to firebase
    console.log('valid form')
    document.getElementById('ftitle').value = ""
    document.getElementById('flink').value = ""
    document.getElementById('frepeat').checked = false
    updateDoc(userRef_now, {
      events: arrayUnion({
        title,
        end_date: date1.toDateString(),
        link,
        repeat
      })
    })
    // alert message
    if(repeat){
      alert(`Your event is ${title} will repeat every ${fullday[date1.toDateString().slice(0,3)]}`)
    }
    else {
      if(link != ""){
        alert(`The link ${title} is save. End date is  ${date1.toDateString()}`)
      }
      else{
        alert(`The ${title} is save. End date is  ${date1.toDateString()}`)
      }
    }
  }
  else {// no need to add
    console.log('invalid form')
    if (date1 < checkdate) alert(`Invalid end date. Today is ${checkdate.toDateString()}`)
    else if (title === "") alert('Please put title.')
  }
  if (noti_on) {
     opennoti() ;
  }
}

//==================================================================

window.get_detail_list = get_detail_list
async function get_detail_list(){ // get event for selected day
  const end_date = document.getElementsByClassName('month')[0].name.split("-")
  const date1 = new Date(end_date[2], end_date[1], end_date[0]).toDateString()
  //console.log(date1)
  const docSnap = await getDoc(userRef_now);
  if (docSnap.exists()) {
    let event_on_date = docSnap.data().events
    event_on_date = event_on_date.filter(function(event) {
      return event.end_date === date1 || (date1.slice(0,3) === event.end_date.slice(0,3) && event.repeat)
    })
    return event_on_date
  } else {
    console.log("No such document!");
    return []
  }
}

//==================================================================

window.delete_fb = delete_fb 
async function delete_fb(deletetitle){
  console.log(deletetitle)
  const docSnap = await getDoc(userRef_now);
  if (docSnap.exists()) {
    let delete_event = docSnap.data().events
    delete_event = delete_event.filter(function(event) {
      return deletetitle.includes(event.title)
    })
    delete_event.forEach((event) => {
      updateDoc(userRef_now, {
        events: arrayRemove(event)
      })
    })
  } else {
    console.log("No such document!");
    return []
  }
}

//==================================================================

window.refreshEvent = refreshEvent
async function refreshEvent(){
  const docSnap = await getDoc(userRef_now);
  if (docSnap.exists()) {
    let old_event = docSnap.data().events
    old_event = old_event.filter(function(event) {
      return (!event.repeat) && getDateDifferent(event.end_date) < 0
    })
    old_event.forEach((event) => {
      updateDoc(userRef_now, {
        events: arrayRemove(event)
      })
    })
  } else {
    console.log("No such document!");
    return []
  }
}

//==================================================================

window.get_noti_list = get_noti_list
async function get_noti_list(){
  const docSnap = await getDoc(userRef_now);
  const one_week = 604800000
  if (docSnap.exists()) {
    let noti_this_week = docSnap.data().events
    noti_this_week = noti_this_week.filter(function(event) {
      return (!event.repeat) && getDateDifferent(event.end_date) <= one_week
    })
    return noti_this_week
  } else {
    console.log("No such document!");
    return []
  }
}