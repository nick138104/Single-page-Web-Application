// for VARIABLES /////////////
var addtable_appear = false
var isGrey = false;
var isShowingEventBox = false;
var clickable = false;
var noti_on = false ;
var pop = document.getElementById('pop-up-box') ;
var delete_form = false
var titles_length;
/////////////////////////////

function toggleForm() { // close or open the form depend on the status of the form
  //console.log(`....toggling FORM....`)
  if (addtable_appear) { // hiding form
    //console.log(`hiding form`)
    document.getElementById("event-form").innerHTML = "";
    addtable_appear = false;
  } else { // showing form
    //console.log(`showing form`)
    let text = `<form class="detail-form">
                <label for="ftitle" id="ftitle-head"></label>
                <input type="text" placeholder="Title" id="ftitle"><br>
                <label for="flink" id="flink-head"></label>
                <input type="text" placeholder="Video Link" id="flink"><br>
                <input type="ch\eckbox" id="frepeat">
                <label for="repeat" id"frepeat-head">repeat every week</label><br>
                <botton class ="btn" id="submit-btn" onclick =   "validate_form()">submit</botton>
                </form>`
    document.getElementById("event-form").innerHTML = text;
    addtable_appear = true;
  }
}
  
function start(today) { // function create carlenda table and month year lable
  const month = today.getMonth(), year = today.getFullYear()
  var date = new Date(year, month, 1)
  var days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  let table = document.getElementById("calendar-table")
  text = `<thead>
          <th>SUN</th>
          <th>MON</th>
          <th>TUE</th>
          <th>WED</th>
          <th>THU</th>
          <th>FRI</th>
          <th>SAT</th>
          </thead>`
  let block = 0
  while(block != days[0].getDay()){
    if(block === 0){
      text +=  `<tr>`
    }
    if(clickable){
    text += `<td class="invalid-date"></td>`
    }else{
      text += `<td class="fakeinvalid-date"></td>`
    }
    block++
  }
  days.forEach(d => {
    if(block === 0){
      text +=  `<tr>`
    } 
      if(clickable){///////
      text +=  `<td class="valid-date" id = day${d.getDate()} onclick="toggleDateValid(this.id)">${d.getDate()}</td>`
    }else{
      text +=  `<td class="fakevalid-date" id = day${d.getDate()} ">${d.getDate()}</td>`
    }
    if(block === 6){
      text +=  `</tr>`
      block = -1
    }
    block++
  })
  while(block != 0){
    if(clickable){
    text += `<td class="invalid-date"></td>`
    }else{
      text += `<td class="fakeinvalid-date"></td>`
    }
    if(block === 6){
      text +=  `</tr>`
      block = -1
    }
    block++
  }
  text += `
          <tfoot>
          <td class="table-foot"></td>
          <td class="table-foot"></td>
          <td class="table-foot"></td>
          <td class="table-foot"></td>
          <td class="table-foot"></td>
          <td class="table-foot"></td>
          <td class="table-foot"></td>
          </tfoot>          
          `
  table.innerHTML = text
  
  addtable_appear = true
  toggleForm()
  hideBothEventButtons()
  MonthTextChange(month,year)
  
  setClickerOnDates(days); // setClicker on every date
  
  var daysInMonth = days.length; // store var daysInMonth for the rest of functions
  localStorage.setItem("daysInMonth", daysInMonth);
  var numberOfMonth = month; // store var numberOfMonth for the rest of functions
  localStorage.setItem("numberOfMonth", numberOfMonth);
  var numberOfYear = year; // store var numberOfMonth for the rest of functions
  localStorage.setItem("numberOfYear", numberOfYear);
}

function MonthTextChange(m, y){ // change the month-year lable *(m as index in months)
  const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
  let text = `
            <button class="month-btn" id="left-month-btn" onclick="MonthChange(this)"> < </button>
            <sup class="ordinal-number"></sup> ${months[m]} ${y} AD
            <button class="month-btn" id="right-month-btn" onclick="MonthChange(this)"> > </button>
            `
  document.getElementsByClassName("month")[0].innerHTML = text
  document.getElementsByClassName("month")[0].name = `${m}-${y}` 
}

function MonthChange(btn){ // check to be change to specific arrow button
  let dd = document.getElementsByClassName("month")[0].name.split("-")
  let mm = dd.at(-2), yy = dd.at(-1)
  if(btn.id === 'left-month-btn'){
    mm--;
    start(new Date(yy, mm, 2))
  } else {
    mm++;
    start(new Date(yy, mm, 2))
  }
}

function setClickerOnDates(days_array) { // setting all dates in calendar to be clickable -> color it to yellow
  for (let day=1; day <= days_array.length ; day++) {
    let btnDateValid =  document.querySelector('#day'+ day.toString() );
    if(clickable){//////////////////////////////////////
    btnDateValid.addEventListener('click', () =>   btnDateValid.style.backgroundColor='rgb(255, 180, 105)'); 
    btnDateValid.addEventListener('click', () =>   btnDateValid.style.color='white');
    }
  }
}

// ** ================================================== ** //

function toggleDateValid(id) { // uncolor the previous selected date
  // NOTED that this function will remove :hover for the whole calendar's date
  
  // call the var daysInMonth from storage I did from above function
  var daysInMonth = localStorage.getItem("daysInMonth"); 
    
  // refresh all dates' color to default
  for (let day=1; day <= daysInMonth ; day++) {
    if (id != 'day'+ day.toString() ) {
      let btnDateValid =  document.querySelector('#day'+ day.toString() );
      btnDateValid.style.backgroundColor='#eee'; 
      btnDateValid.style.color='black'; 
    } else {
      var date = day;
      }
    }
  
  // find ordinal number //////////////
  if (date.toString().charAt(date.toString().length - 1) == "1"){
    if (date.toString().charAt(0) == "1" && date.toString().length != 1){
      var ordinalNumber = "th";
    } else {
    var ordinalNumber = "st";
    }
  } else if (date.toString().charAt(date.toString().length - 1) == "2") {
    if (date.toString().charAt(0) == "1"){
      var ordinalNumber = "th";
    } else {
    var ordinalNumber = "nd";
    }
  } else if (date.toString().charAt(date.toString().length - 1) == "3") {
    if (date.toString().charAt(0) == "1"){
      var ordinalNumber = "th";
    } else {
    var ordinalNumber = "rd";
    }
  } else {
    var ordinalNumber = "th";
  }
  
  /////////////////////////////////////
  var numberOfMonth = localStorage.getItem("numberOfMonth"); 
  var year = localStorage.getItem("numberOfYear"); 
  const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
  
  // change detail-box-head //
  let text = `<button class="month-btn" name="" id="left-month-btn" onclick="MonthChange(this)"> < </button>
              ${date}<sup class="ordinal-number">${ordinalNumber}</sup> ${months[numberOfMonth]} ${year} AD 
              <button class="month-btn" id="right-month-btn" onclick="MonthChange(this)"> > </button>`
  document.getElementById("date-month-year-ad").innerHTML = text
  
  UpdateDateName(date)
  if (clickable){
    //==========================================//
    showAddEventButton();
    showDeleteEventButton();
    //==========================================//
    isGrey = false; // change1
    delete_form = false
    //==========================================//
    isShowingEventBox = false; 
    toggleEventBox(); // open detail box
    addtable_appear = true; 
    toggleForm(); // close form
  }
}

function showAddEventButton() { // make add-event-btn appear
  let text = `<button class="btn" id="add-event-btn" onclick=" clickAddEventButton()">Add Event</button>`
  document.getElementById("add-event-btn-box").innerHTML = text;
}

function showDeleteEventButton() {
  let text = `<button class="btn" id="delete-event-btn" onclick="deletefunction()">DELETE</button>`
  document.getElementById("delete-event-btn-box").innerHTML = text;
}


function toggleEventBox() {
  //console.log(`....toggling event box....`)
  if (isShowingEventBox){
    //console.log(`hiding event box`)
    let text = `` // should be ""
    
    document.getElementById("event-detail").innerHTML = text
    isShowingEventBox = false;
  } else {
    //console.log(`showing event box`) // <h2 id = 'test_event_head'></h2><div 'test_event_details'></div>
      let text = `<h2 id = 'event-detail-head'></h2><div id='event-detail-body'></div>`
    document.getElementById("event-detail").innerHTML = text
    showEvents()
    isShowingEventBox = true;
  }
}

// ------------------------------------------------------------ //
function showEvents() { // show all event when click the date (please use only when already change name tag in date-month-year-ad)
  //console.log(`event-details`)
  get_detail_list().then(event_array => {
    let text = `<ul>`
    event_array.forEach(function(event) {
      //console.log(event)
      if(event.link != ""){
        text += `<li>Link : <botton onclick="show_video('${event.link}')">${event.title}</botton></li>`
      }
      else {
        text += `<li>${event.title}</li>`
      }
    })
    text += `</ul>`
    if(event_array.length === 0) document.getElementById('event-detail-head').innerHTML = 'NO EVENT'
    else document.getElementById('event-detail-head').innerHTML = 'EVENT DETAILS'
    document.getElementById('event-detail-body').innerHTML = text
  })
}

// ------------------------------------------------------------ //
function clickAddEventButton() { // clicking -> toggle Form and Event_Box
  // changing color of delete button
  if (isGrey) { // event box is showing
    let text = `<button class="btn" id="delete-event-btn" onclick="deletefunction()">DELETE</button>`
    document.getElementById("delete-event-btn-box").innerHTML = text
    let btnDeleteEvent =  document.querySelector('#delete-event-btn');
    btnDeleteEvent.style.backgroundColor='rgb(255, 120, 105)'; 
    btnDeleteEvent.style.borderColor='rgb(255, 120, 105)';
    document.getElementById("add-event-btn").innerHTML = "Add Event";
    
    isGrey = false;
  } else { // event box is NOT showing
    let text = `<button class="btn" id="delete-event-btn">DELETE</button>`
    document.getElementById("delete-event-btn-box").innerHTML = text
    let btnDeleteEvent =  document.querySelector('#delete-event-btn');
    btnDeleteEvent.style.backgroundColor='#eee'; 
    btnDeleteEvent.style.borderColor='#eee';
    btnDeleteEvent.style.cursor='auto';
    document.getElementById("add-event-btn").innerHTML = "Close";
    
    isGrey = true;
  }

  ////////////////////////////////
  toggleForm();
  toggleEventBox();
  delete_form = false
}
  
function hideBothEventButtons() { // hide both Add_Event and Delete buttons
  let text = `<tr>
              <td id="add-event-btn-box">
              </td>
              <td id="delete-event-btn-box">
              </td>
              </tr>`
  document.getElementById("detail-box-foot").innerHTML = text

  /////////////////////////////
  if (isShowingEventBox) { // in first start
    toggleEventBox();
  }
}

function UpdateDateName(date){ // date = 0 if change back to m-y else change tag name to date-m-y
  const tag = document.getElementsByClassName("month")[0].name.split("-")
  // console.log(date)
  // console.log(tag)
  const m = tag.at(-2), y = tag.at(-1)
  if(date === 0){
    document.getElementsByClassName("month")[0].name = `${m}-${y}`
  }
  else{
    document.getElementsByClassName("month")[0].name = `${date}-${m}-${y}`
  }
}

function firstLogin(){ // make the calendar clickable when first login happened
  clickable = true
  refreshEvent()
  start(new Date())
}

function resetPage(){ // reset the page for new user
  start(new Date())
  isGrey = false;
}


function deleteEventsForm() {
  //console.log(delete_form)
  // the rest of code waiting on events' detail
  let form = document.getElementById('event-detail-body')
  //console.log(form.innerText.split('\n'))
  let text = `<ul>`
  const titles = form.innerText.trim().split('\n')
  for(let i=0; i < titles.length; i++){
    if(titles[i].slice(0,4) === 'Link'){
      text += `<input type="checkbox" id = "check_box${i}" name="${titles[i].slice(7)}">
              <label for="coding">${titles[i].slice(7)}</label><br>`
    }
    else{
      text += `<input type="checkbox" id = "check_box${i}" name="${titles[i]}">
              <label for="coding">${titles[i]}</label><br>`
    }
  }
  text += `</ul>`
  if(titles[0].length === 0){
    alert('No Event')
  }
  else{
    form.innerHTML = text
    console.log(titles[0])
    titles_length = titles.length
  }
}

function deleteEvents(len){
  delete_form = false
  const deletetitle = []
  for(let i=0;i<len;i++){
    if(document.getElementById(`check_box${i}`).checked){
      deletetitle.push(document.getElementById(`check_box${i}`).name)
    }
  }
  delete_fb(deletetitle)
  // change back to nothing show (* still need (want to not click))
  let dd = document.getElementsByClassName("month")[0].name.split("-")
  let mm = dd.at(-2), yy = dd.at(-1)
  today = new Date(yy,mm,2)
  start(today)
  //=======================
  alert(`you delete ${deletetitle.length} event(s)`)
}

function deletefunction(){
  if(delete_form){
    //console.log(delete_form)
    deleteEvents(titles_length)
    if (noti_on) {
     opennoti() ;
      setTimeout(function(){
        opennoti() ;
      },400) ;
    }
  } else{
    deleteEventsForm()
    
    delete_form = true
    //console.log(delete_form)
  }
}

var month_num = {Jan:0, Feb:1,Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11}
function getDateDifferent(date){ // date(string format ex.) Sat Apr 30 2022) - today
  date = date.split(" ")
  //console.log(date)
  const day = parseInt(date[2])
  let mon_abb = date[1]
  mon_abb = month_num[mon_abb]
  const year = parseInt(date[3])
  //console.log(day,mon_abb,year)
  const test_date = new Date(year,mon_abb,day)
  console.log(test_date)
  let today = new Date()
  today = new Date(today.getFullYear(),today.getMonth(),today.getDate())
  //console.log(today)
  //86400000 = 1 day
  //604800000 = 1 week
  return test_date-today
}

function opennoti() {
  if(clickable){ ////////////please login to use noti-btn
    if (noti_on) {
      pop.style.height = '0px' ;
      pop.style.opacity = 0 ;
      noti_on = false ;
    }else {
      pop.style.height = '300px' ;
      pop.style.opacity = 1 ;
      noti_on = true ;
      wirtenoti() ;
    } 
  }
}

function wirtenoti() {
  get_noti_list().then(noti_array => {
    let text = `<ul>`
    if (noti_array.length ===0) {
      text += `NO EVENT IN THESE SEVEN DAYS`
    }
    noti_array.forEach(function(noti) {
      text += `<li>${noti.title}</li>`
      text += `<ul><li>${noti.end_date}</li></ul>`
    })
    text += `</ul>`
    document.getElementById('pop-up-text').innerHTML = text
  })
}

function show_video(link){
  var res = link.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
  if (res !== null){
    window.location.assign(link)
  }
  else{
    alert('wrong url link format')
  }
}

