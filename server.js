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

const all_subjects_val = {"MA102":"none", "CS102":"none", "NO101":"none", "EE101":"none"}
let attendanceCode = {"ma102":0,'cs102':0, 'ee101':0, 'no101':0}
var attendanceArray = {"ma102":[],'cs102':[], 'ee101':[], 'no101':[]};
var time = 10000

const db = mysql.createConnection({host:"127.0.0.1", user:"root", password:"", database:"cs102" })
db.connect((error) =>{
    if (error){throw error}
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email,password,done){
  db.query("select * from users where email='"+email+"' ",async function(err,results){
    user = Object.values(JSON.parse(JSON.stringify(results)))
   if(err){return done(err)}
   //console.log(user)
   if(user.length ===0){
      //console.log("no user")
       return done(null,false,{message: 'Incorrect email'});           
   }
   user=user[0]
   //console.log(await bcrypt.hash(password,5))
   if(!(await bcrypt.compare(password, user.hashedpassword))){
    //console.log("nodfe user")
      return done(null,false,{message: 'Incorrect password'});
   }
   //console.log("ok")
   return done(null,user);     

  });
}))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  db.query("Select * from users where id="+id, function(err, results){
    if(err){return done(err);}
    user = Object.values(JSON.parse(JSON.stringify(results)))[0]
    return done(null, user)
  })
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.use(flash())
app.use(session({secret:"s",resave: false,saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/



app.get("/login", checkNotAuthenticated, (req,res)=>{
  res.render("login")
 
})

app.get("/", checkAuthenticated, (req,res)=>{
  let subjects = req.user.subjects.split(" ")
  all_subjects = Object.keys(all_subjects_val)

  for(let i=0; i<all_subjects.length; i++){
    if(subjects.includes(all_subjects[i])){
      all_subjects_val[all_subjects[i]] = "block";
    }
  }
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

app.get("/profile", checkAuthenticated, (req,res)=>{
  if(req.user.type === "student"){
    res.render("s_profile", {name: req.user.name, id:req.user.id, email:req.user.email, branch: req.user.branch, batch: req.user.batch})
  }
  else{
    res.render("t_profile", {name: req.user.name, id:req.user.id, email:req.user.email, branch: req.user.branch, batch: req.user.batch})
  }
})

app.get("/ma102", checkAuthenticated, (req,res)=>{
  let subjects = req.user.subjects.split(" ")
  all_subjects = Object.keys(all_subjects_val)

  for(let i=0; i<all_subjects.length; i++){
    if(subjects.includes(all_subjects[i])){
      all_subjects_val[all_subjects[i]] = "block";
    }
  }
  db.query("select * from posts where subject='MA102'", function(err,results){
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    //console.log(results)
    if(req.user.type === "student"){
      res.render("s_post", {messages: results, subject:"Linear Algebra",ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    else{
      res.render("t_post", {subCode:"ma102", messages: results, subject:"Linear Algebra",ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    for (let key in all_subjects_val) {
      all_subjects_val[key] = "none"}
  })
})
app.get("/cs102", checkAuthenticated, (req,res)=>{
  let subjects = req.user.subjects.split(" ")
  all_subjects = Object.keys(all_subjects_val)

  for(let i=0; i<all_subjects.length; i++){
    if(subjects.includes(all_subjects[i])){
      all_subjects_val[all_subjects[i]] = "block";
    }
  }
  db.query("select * from posts where subject='CS102'", function(err,results){
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    //console.log(results)
    if(req.user.type === "student"){
      res.render("s_post", {messages: results, subject:"Software tools", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    else{
      res.render("t_post", {subCode:"cs102", messages: results, subject:"Software tools", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    for (let key in all_subjects_val) {
      all_subjects_val[key] = "none"}
  })
})
app.get("/ee101", checkAuthenticated, (req,res)=>{
  let subjects = req.user.subjects.split(" ")
  all_subjects = Object.keys(all_subjects_val)

  for(let i=0; i<all_subjects.length; i++){
    if(subjects.includes(all_subjects[i])){
      all_subjects_val[all_subjects[i]] = "block";
    }
  }
  db.query("select * from posts where subject='EE101'", function(err,results){
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    //console.log(results)
    if(req.user.type === "student"){
      res.render("s_post", {messages: results, subject:"Introduction to Electrical & Electronics Engineering", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    else{
      res.render("t_post", {subCode:"ee101", messages: results, subject:"Introduction to Electrical & Electronics Engineering", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    for (let key in all_subjects_val) {
      all_subjects_val[key] = "none"}
  })
})
app.get("/no101", checkAuthenticated, (req,res)=>{
  let subjects = req.user.subjects.split(" ")
  all_subjects = Object.keys(all_subjects_val)

  for(let i=0; i<all_subjects.length; i++){
    if(subjects.includes(all_subjects[i])){
      all_subjects_val[all_subjects[i]] = "block";
    }
  }
  db.query("select * from posts where subject='NO101'", function(err,results){
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    //console.log(results)
    if(req.user.type === "student"){
      res.render("s_post", {messages: results, subject:"Sports", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    else{
      res.render("t_post", {subCode:"no101", messages: results, subject:"Sports", ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
    }
    for (let key in all_subjects_val) {
      all_subjects_val[key] = "none"}
  })
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.delete('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/downloadattendance_ma102", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance(id,"MA102")
  res.download("attendance.xlsx")
});

app.post("/downloadattendance_cs102", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance(id,"CS102")
  res.download("attendance.xlsx")
});

app.post("/downloadattendance_ee101", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance(id,"EE101")
  res.download("attendance.xlsx")
});

app.post("/downloadattendance_no101", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance(id,"NO101")
  res.download("attendance.xlsx")
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/tdownloadattendance_ma102", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance_teacher(id,"MA102")
  res.download("attendance.xlsx")
});

app.post("/tdownloadattendance_cs102", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance_teacher(id,"CS102")
  res.download("attendance.xlsx")
});

app.post("/tdownloadattendance_ee101", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance_teacher(id,"EE101")
  res.download("attendance.xlsx")
});

app.post("/tdownloadattendance_no101", function(req,res){
  //console.log("hi")
  id = req.user.id
  get_attendance_teacher(id,"NO101")
  res.download("attendance.xlsx")
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/edit_attendance_ma102", function(req,res){
  subject="MA102" 
  id=req.body.id
  date= req.body.date
  stat= req.body.status
  update_attendance(id,subject,stat,date)
  res.redirect("/")
})

app.post("/edit_attendance_cs102", function(req,res){
  subject="CS102" 
  id=req.body.id
  date= req.body.date
  stat= req.body.status
  update_attendance(id,subject,stat,date)
  res.redirect("/")
})

app.post("/edit_attendance_ee101", function(req,res){
  subject="EE101" 
  id=req.body.id
  date= req.body.date
  stat= req.body.status
  update_attendance(id,subject,stat,date)
  res.redirect("/")
})

app.post("/edit_attendance_no101", function(req,res){
  subject="NO101" 
  id=req.body.id
  date= req.body.date
  stat= req.body.status
  update_attendance(id,subject,stat,date)
  res.redirect("/")
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/post_ma102", function(req,res){
  text = req.body.message
  console.log(text)
  var timestamp = new Date().toString().slice(0,21)
  db.query("INSERT INTO posts (message, sender, subject, time) VALUES ('"+text+"', '"+req.user.name+"', 'MA102', '"+timestamp+"')")
  //console.log(timestamp)
  res.redirect("/ma102")
})
app.post("/post_cs102", function(req,res){
  text = req.body.message
  //console.log(text)
  var timestamp = new Date().toString().slice(0,21)
  db.query("INSERT INTO posts (message, sender, subject, time) VALUES ('"+text+"', '"+req.user.name+"', 'CS102', '"+timestamp+"')")
  //console.log(timestamp)
  res.redirect("/cs102")
})
app.post("/post_ee101", function(req,res){
  text = req.body.message
  //console.log(text)
  var timestamp = new Date().toString().slice(0,21)
  db.query("INSERT INTO posts (message, sender, subject, time) VALUES ('"+text+"', '"+req.user.name+"', 'EE101', '"+timestamp+"')")
  //console.log(timestamp)
  res.redirect("/ee101")
})
app.post("/post_no101", function(req,res){
  text = req.body.message
  //console.log(text)
  var timestamp = new Date().toString().slice(0,21)
  db.query("INSERT INTO posts (message, sender, subject, time) VALUES ('"+text+"', '"+req.user.name+"', 'NO101', '"+timestamp+"')")
  //console.log(timestamp)
  res.redirect("/no101")
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/take_attendance_ma102", function(req,res){
  let query = "INSERT INTO attendance (id, subject, date, status) VALUES"
  db.query("SELECT id FROM users WHERE type = 'student' and subjects LIKE '%MA102%'",function (err,results){
    if(err){throw err}
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    date = new Date().toJSON().slice(0,10)
    for(i in results){
      query += "('"+results[i].id+"', 'MA102', '"+date+"', 'A'), "
    }
    query = query.substring(0, query.length - 2);
    db.query(query,(err)=>{
      if(err){
        console.log(err.errno)}
    })

    attendanceCode.ma102 = Math.floor(1000 + Math.random() * 9000);
    
    setTimeout(()=>{
      console.log("t:")
      console.log(attendanceArray)
      if(attendanceArray.ma102.length >0){
        q2 = "UPDATE attendance SET status = 'P' WHERE subject = 'MA102' AND date = '"+date+"' AND id in ("
        for (i in attendanceArray.ma102){
          q2 += "'"+attendanceArray.ma102[i]+"', "
        }
        q2 = q2.substring(0,q2.length -2)
        q2 += ")"
        console.log(q2)
        db.query(q2)
      }
      attendanceCode.ma102 = 0
      attendanceArray.ma102 = []
      console.log("Done")
    },time)
    console.log(attendanceCode)
    res.redirect("/")
  })
})

app.post("/take_attendance_cs102", function(req,res){
  let query = "INSERT INTO attendance (id, subject, date, status) VALUES"
  db.query("SELECT id FROM users WHERE type = 'student' and subjects LIKE '%CS102%'",function (err,results){
    if(err){throw err}
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    date = new Date().toJSON().slice(0,10)
    for(i in results){
      query += "('"+results[i].id+"', 'CS102', '"+date+"', 'A'), "
    }
    query = query.substring(0, query.length - 2);
    db.query(query,(err)=>{
      if(err){console.log(err.errno)}
    })

    attendanceCode.cs102 = Math.floor(1000 + Math.random() * 9000);
    
    setTimeout(()=>{
      console.log("ta:")
      console.log(attendanceArray)
      if(attendanceArray.cs102.length >0){
        q2 = "UPDATE attendance SET status = 'P' WHERE subject = 'CS102' AND date = '"+date+"' AND id in ("
        for (i in attendanceArray.cs102){
          q2 += "'"+attendanceArray.cs102[i]+"', "
        }
        q2 = q2.substring(0,q2.length -2)
        q2 += ")"
        console.log(q2)
        db.query(q2)
      }
      attendanceCode.cs102 = 0
      attendanceArray.cs102 = []
      console.log("Done")
    },time)
    console.log(attendanceCode)
    res.redirect("/")
  })
})

app.post("/take_attendance_ee101", function(req,res){
  let query = "INSERT INTO attendance (id, subject, date, status) VALUES"
  db.query("SELECT id FROM users WHERE type = 'student' and subjects LIKE '%EE101%'",function (err,results){
    if(err){throw err}
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    date = new Date().toJSON().slice(0,10)
    for(i in results){
      query += "('"+results[i].id+"', 'EE101', '"+date+"', 'A'), "
    }
    query = query.substring(0, query.length - 2);
    db.query(query,(err)=>{
      if(err){console.log(err)}
    })

    attendanceArray.ee101 = Math.floor(1000 + Math.random() * 9000);
    
    setTimeout(()=>{
      console.log("t:")
      console.log(attendanceArray)
      if(attendanceArray.ee101.length >0){
        q2 = "UPDATE attendance SET status = 'P' WHERE subject = 'EE101' AND date = '"+date+"' AND id in ("
        for (i in attendanceArray.ee101){
          q2 += "'"+attendanceArray.ee101[i]+"', "
        }
        q2 = q2.substring(0,q2.length -2)
        q2 += ")"
        console.log(q2)
        db.query(q2)
      }
      attendanceArray.ee101 = 0
      attendanceArray.ee101 = []
      console.log("Done")
      res.redirect("/")
    },time)
    console.log(attendanceCode)
  })
})

app.post("/take_attendance_no101", function(req,res){
  let query = "INSERT INTO attendance (id, subject, date, status) VALUES"
  db.query("SELECT id FROM users WHERE type = 'student' and subjects LIKE '%no101%'",function (err,results){
    if(err){throw err}
    results =  Object.values(JSON.parse(JSON.stringify(results)))
    date = new Date().toJSON().slice(0,10)
    for(i in results){
      query += "('"+results[i].id+"', 'NO101', '"+date+"', 'A'), "
    }
    query = query.substring(0, query.length - 2);
    db.query(query,(err)=>{
      if(err){console.log(err)}
    })

    attendanceArray.no101 = Math.floor(1000 + Math.random() * 9000);
    
    setTimeout(()=>{
      console.log("t:")
      console.log(attendanceArray)
      if(attendanceArray.no101.length >0){
        q2 = "UPDATE attendance SET status = 'P' WHERE subject = 'NO101' AND date = '"+date+"' AND id in ("
        for (i in attendanceArray.no101){
          q2 += "'"+attendanceArray.no101[i]+"', "
        }
        q2 = q2.substring(0,q2.length -2)
        q2 += ")"
        console.log(q2)
        db.query(q2)
      }
      attendanceArray.no101 = 0
      attendanceArray.no101 = []
      console.log("Done")
      res.redirect("/")
    },time)
    console.log(attendanceCode)
  })
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/set_attendance_ma102", (req,res)=>{
  let code = req.body.password
  console.log(code)
  if(code == attendanceCode.ma102 && attendanceCode.ma102 !==0){
    attendanceArray.ma102.push(req.user.id)
  }
  console.log("S:")
  console.log(attendanceArray)
  res.redirect("/")
})
app.post("/set_attendance_cs102", (req,res)=>{
  let code = req.body.password
  console.log(code)
  if(code == attendanceCode.cs102 && attendanceCode.cs102 !==0){
    attendanceArray.cs102.push(req.user.id)
  }
  console.log("S:")
  console.log(attendanceArray)
  res.redirect("/")
})
app.post("/set_attendance_ee101", (req,res)=>{
  let code = req.body.password
  console.log(code)
  if(code == attendanceCode.ee101 && attendanceCode.ee101 !==0){
    attendanceArray.ee101.push(req.user.id)
  }
  console.log("S:")
  console.log(attendanceArray)
  res.redirect("/")
})
app.post("/set_attendance_no101", (req,res)=>{
  let code = req.body.password
  console.log(code)
  if(code == attendanceCode.no101 && attendanceCode.no101 !==0){
    attendanceArray.no101.push(req.user.id)
  }
  console.log("S:")
  console.log(attendanceArray)
  res.redirect("/")
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()

    }
  
    res.redirect('/login')
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  function get_attendance(id, sub){
    db.query("select date,status from attendance where id="+id+" and subject= '"+sub+"'", function(err, results){
      if(err){throw err;}
      results = Object.values(JSON.parse(JSON.stringify(results)))
      for (i in results){results[i].date=results[i].date.substring(0,10)}
      console.log(results)
      const sheet = xlsx.utils.json_to_sheet(results);
      const book = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(book, sheet , "attendance")
      xlsx.writeFile(book, "attendance.xlsx")   
    });
  }
  function get_attendance_teacher(id, sub){
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
  }
  function update_attendance(id,subject,stat,date){
    db.query("UPDATE attendance set status='"+stat+"' where subject='"+subject+"' AND id="+id+" AND date= '"+date+"'",async function(err,results){
      if(err){throw err}
      //results = Object.values(JSON.parse(JSON.stringify(results)))
      console.log(results)
      if(results.affectedRows===0){console.log("ewfrg")}
    })
  }
  
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/
app.listen(3000)