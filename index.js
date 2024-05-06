const express = require('express')
const mysql = require('mysql')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const LocalStrategy = require('passport-local').Strategy
const xlsx = require('xlsx')
const bcrypt = require("bcrypt")

//Global variables
const all_subjects_val = {"MA102":"none", "CS102":"none", "NO101":"none", "EE101":"none"} // This dictionary decides whether the subject will be visible to the user or not
var attendanceCode = {"ma102":0,'cs102':0, 'ee101':0, 'no101':0} // This dictionary contains the access code for the attendance of each subject
var attendanceArray = {"ma102":[],'cs102':[], 'ee101':[], 'no101':[]}; //Stores the list of students who marked present for each subject
var time = 180000 //Set the time for which the student can enter their attendance (in milliseconds)

//Connects to the local mysql database
const db = mysql.createConnection({host:"sql6.freemysqlhosting.net", user:"sql6704343", password:"XvRrCeHIBT", database:"sql6704343" })
db.connect((error) =>{
    if (error){throw error} //If not able to connect throw an error
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Code to log in the user and maintain the session
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email,password,done){
  db.query("select * from users where email='"+email+"' ",async function(err,results){ //Fetches the user detail with the provided email
    user = Object.values(JSON.parse(JSON.stringify(results)))
   if(err){return done(err)}
   console.log(user)
   if(user.length === 0){
      console.log("no user")
       return done(null,false,{message: 'Incorrect email'}); //Returns an incorrect email message if no user with the email is found
   }
   user=user[0] //Takes the user out of the list
   
   if(!(await bcrypt.compare(password, user.hashedpassword))){ //Hashes the input and compares it to the hash password in the database
    console.log("password?")
      return done(null,false,{message: 'Incorrect password'}); //Returns incorrect password message if the two hashes don't match
   }
   //console.log("ok")
   return done(null,user); //Returns null message and logs in the user

  });
}))
passport.serializeUser((user, done) => done(null, user.id))//Logs in the user and creates a session id

//Logs out the user and destroys the session
passport.deserializeUser((id, done) => {
  db.query("Select * from users where id="+id, function(err, results){
    if(err){return done(err);}
    user = Object.values(JSON.parse(JSON.stringify(results)))[0]
    return done(null, user)
  })
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.use(flash()) //Allows to send messages to the login page
app.use(session({secret:"secret123",resave: false,saveUninitialized: false})) //Creates a new session id for every logged in user
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.set("views", __dirname + "/views");
app.set('view engine', 'ejs') //Set the view engine to ejs type files present in the views folder
app.use(express.static("public"))// Sets path of the helper css and front-end js files to the public folder
app.use(express.urlencoded({extended:false}))
app.use(express.json()) //Allows to use Json

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/


//After making sure that the user is not logged in renders the login page
app.get("/login", checkNotAuthenticated, (req,res)=>{
  res.render("login")
})

//After making sure that the user is logged in renders the home page depending Whether the user is a student or teacher
app.get("/", checkAuthenticated, (req,res)=>{
  let all_subjects_val = get_subjects(req) //Function to decide whether a subject is rendered or not
  if(req.user.type==="student"){
    res.render("s_home", {ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
  }
  else{
    
    res.render("t_home", {codes:attendanceCode,ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
  }

  for (let key in all_subjects_val) {
    all_subjects_val[key] = "none"
 }
})

//After making sure that the user is logged in, renders the profile page
app.get("/profile", checkAuthenticated, (req,res)=>{
  if(req.user.type === "student"){
    res.render("s_profile", {name: req.user.name, id:req.user.id, email:req.user.email, branch: req.user.branch, batch: req.user.batch})
  }
  else{
    res.render("t_profile", {name: req.user.name, id:req.user.id, email:req.user.email, branch: req.user.branch, batch: req.user.batch})
  }
})

//Renders the post page for the Subject (Same for all four subjects)
app.get("/ma102", checkAuthenticated, (req,res)=>{
  if(req.user.subjects.includes("MA102")){//checks if the student is enrolled in the Subject, if not redirects them to homepage
    let all_subjects_val = get_subjects(req)
    db.query("select * from posts where subject='MA102'", function(err,results){//Fetches all the messages for the subject from the DBMS
      results =  Object.values(JSON.parse(JSON.stringify(results)))
      //console.log(results)
      if(req.user.type === "student"){
        res.render("s_post", {messages: results, subject:"Linear Algebra",ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      else{
        res.render("t_post", {subCode:"MA102", messages: results, subject:"Linear Algebra",ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      for (let key in all_subjects_val) {
        all_subjects_val[key] = "none"}
    })
  }
  else{res.redirect("/")}
})
app.get("/cs102", checkAuthenticated, (req,res)=>{
  if(req.user.subjects.includes("CS102")){
    let all_subjects_val = get_subjects(req)
    db.query("select * from posts where subject='CS102'", function(err,results){
      results =  Object.values(JSON.parse(JSON.stringify(results)))
      //console.log(results)
      if(req.user.type === "student"){
        res.render("s_post", {messages: results, subject:"Software tools", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      else{
        res.render("t_post", {subCode:"CS102", messages: results, subject:"Software tools", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      for (let key in all_subjects_val) {
        all_subjects_val[key] = "none"}
    })
  }
  else{res.redirect("/")}
})
app.get("/ee101", checkAuthenticated, (req,res)=>{
  if(req.user.subjects.includes("EE101")){
    let all_subjects_val = get_subjects(req)
    db.query("select * from posts where subject='EE101'", function(err,results){
      if(err){throw err}
      results =  Object.values(JSON.parse(JSON.stringify(results)))
      //console.log(results)
      if(req.user.type === "student"){
        res.render("s_post", {messages: results, subject:"Introduction to Electrical & Electronics Engineering", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      else{
        res.render("t_post", {subCode:"EE101", messages: results, subject:"Introduction to Electrical & Electronics Engineering", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      for (let key in all_subjects_val) {
        all_subjects_val[key] = "none"}
    })
  }
  else{res.redirect("/")}
})
app.get("/no101", checkAuthenticated, (req,res)=>{
  if(req.user.subjects.includes("MA102")){
    let all_subjects_val = get_subjects(req)
    db.query("select * from posts where subject='NO101'", function(err,results){
      results =  Object.values(JSON.parse(JSON.stringify(results)))
      //console.log(results)
      if(req.user.type === "student"){
        res.render("s_post", {messages: results, subject:"Sports", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      else{
        res.render("t_post", {subCode:"NO101", messages: results, subject:"Sports", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
      }
      for (let key in all_subjects_val) {
        all_subjects_val[key] = "none"}
    })
  }
  else{res.redirect("/")}
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Login and logout methods

//Activated when the login button is pressed, If successful, redirect them to homepage. If not, redirects to the login page with the error message
app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

//Logs out the user and redirects them to the login page
  app.delete('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Post Methods

//Post method for downloading the attendance (both teacher and student)
app.post("/downloadattendance", function(req,res){
  if(req.user.type == "student"){
    get_attendance(req.query.button,req,res)
  }
  else{
    get_attendance_teacher(req.query.button,res)
  }
});

//Post method for editing the attendance (teacher only)
app.post("/edit_attendance", function(req,res){
  edit_attendance(req.query.button,req,res)
})

//Post method to post a message on the site (teacher only)
app.post("/send", function(req,res){
  sub = req.query.button
  post(sub,sub.toLowerCase(),req,res)
})

//Post method to activate the take attendance function (teacher only)
app.post("/take_attendance", function(req,res){
  sub = req.query.button
  take_attendance(sub,sub.toLowerCase(),req,res)
})

//Post method to Mark present (student only)
app.post("/set_attendance", (req,res)=>{
  set_attendance(req.query.button.toLowerCase(),req,res)
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Helper Functions

//If the user is not logged in redirects them to the login page
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  //If user is logged in redirects them to the home page
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  //Function to fetch the attendance records in an Excel file
  function get_attendance(sub,req,res){
    id = req.user.id
    db.query("select date,status from attendance where id="+id+" and subject= '"+sub+"'", function(err, results){ //Mysql query to fetch the attendance records for a student with only the date and status
      if(err){throw err;}
      results = Object.values(JSON.parse(JSON.stringify(results)))
      for (i in results){results[i].date=results[i].date.substring(0,10)}
      console.log(results)
      const sheet = xlsx.utils.json_to_sheet(results);
      const book = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(book, sheet , "attendance")
      xlsx.writeFile(book, "attendance.xlsx")   
    });
    res.download("attendance.xlsx")//Downloads the file on the client's computer
  }

  //Function to get the attendance records for all the students in the class
  function get_attendance_teacher(sub,res){
    db.query("select date,status,id from attendance where subject= '"+sub+"'", function(err, results){
      if(err){throw err;}
      results = Object.values(JSON.parse(JSON.stringify(results)))
      for (i in results){results[i].date=results[i].date.substring(0,10)}
      console.log(results)
      const sheet = xlsx.utils.json_to_sheet(results);
      const book = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(book, sheet , "attendance")
      xlsx.writeFile(book, "attendance.xlsx")   
    });
    res.download("attendance.xlsx") //Download the attendance file on the client's computer
  }

  //Function to edit the attendance
  function edit_attendance(subject,req,res){
    id=req.body.id
    date= req.body.date //Fetch the ID, date and status from the HTML page
    stat= req.body.status
    db.query("UPDATE attendance set status='"+stat+"' where subject='"+subject+"' AND id="+id+" AND date= '"+date+"'",async function(err,results){//mysql query to update attendance record
      if(err){throw err}
      //results = Object.values(JSON.parse(JSON.stringify(results)))
      console.log(results)
      if(results.affectedRows===0){console.log("ewfrg")}
    })
    res.redirect("/")
  }

 //Allow the teacher to take attendance
  function take_attendance(sub_name,subject,req,res){
    let query = "INSERT INTO attendance (id, subject, date, status) VALUES"
  db.query("SELECT id FROM users WHERE type = 'student' and subjects LIKE '%"+sub_name+"%'",function (err,results){ // Fetches all the students in the subject
    if(err){throw err}
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    date = new Date().toJSON().slice(0,10) //Stores today's date
    for(i in results){
      query += "('"+results[i].id+"', '"+sub_name+"', '"+date+"', 'A'), " //Adds each student fetched earlier to the initial query
    }
    query = query.substring(0, query.length - 2);
    db.query(query,(err)=>{ //Marks all the students in the class as absent initially
      if(err){console.log(err.errno)}
    })

    attendanceCode[subject] = Math.floor(1000 + Math.random() * 9000); //Generates random attendance code between 1000 and 9999
    //attendanceCode[subject] = "1234"
    
    setTimeout(()=>{ //This function is executed after set amount of time
      console.log("ta:")
      console.log(attendanceArray)
      if(attendanceArray[subject].length >0){
        q2 = "UPDATE attendance SET status = 'P' WHERE subject = '"+sub_name+"' AND date = '"+date+"' AND id in (" // Query to update the attendance record to P for all the students who enter the correct code
        for (i in attendanceArray[subject]){
          q2 += "'"+attendanceArray[subject][i]+"', "
        }
        q2 = q2.substring(0,q2.length -2)
        q2 += ")"
        console.log(q2)
        db.query(q2) //Updates the attendance
      }
      attendanceCode[subject] = 0 //Set the attendance code back to zero for the subject
      attendanceArray[subject] = [] //Wipes out the list of the students who marked present
      console.log("Done")
    },time)
    console.log(attendanceCode)
    res.redirect("/") //Redirects back to the homepage
  })

  }

  //Allows the teacher to post a message
  function post(sub_name,subject,req,res){
    text = req.body.message
    console.log(text)
    var timestamp = new Date().toString().slice(0,21) //Gets the exact current timestamp
    db.query("INSERT INTO posts (message, sender, subject, time) VALUES ('"+text+"', '"+req.user.name+"', '"+sub_name+"', '"+timestamp+"')") //Enter the message into database along with the timestamp
    //console.log(timestamp)
    res.redirect("/"+subject) //Redirects back to the current subject post page
  }
  //Function to allow student to enter the code and mark their attendance
  function set_attendance(subject,req,res){
    let code = req.body.password
    console.log(code)
    if(code == attendanceCode[subject] && attendanceCode[subject] !==0){ //checks if the code entered by the student matches the random code generated and whether the random code is not zero
      attendanceArray[subject].push(req.user.id) //Add the id of the student to the list which is processed further in the take attendance function
    }
    console.log("S:")
    console.log(attendanceArray)
    res.redirect("/") //Redirect back to the home page
  }
  function get_subjects(req){
    let subjects = req.user.subjects.split(" ") //Gets all the subject of the student and converts them into a list
    all_subjects = Object.keys(all_subjects_val) //Fetch the list of all the subjects from the dictionary(keys)

    for(let i=0; i<all_subjects.length; i++){
      if(subjects.includes(all_subjects[i])){
        all_subjects_val[all_subjects[i]] = "block"; //Marks the value of the subject as block for all the subjects, the student is enrolled in
      }
    }
    return all_subjects_val
}
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/
app.listen(3000) //Specifies the port on which the server runs
