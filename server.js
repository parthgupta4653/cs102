const express = require('express')
const mysql = require('mysql')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt")

const all_subjects_val = {"MA102":"none", "CS102":"none", "NO101":"none", "EE101":"none"}

const db = mysql.createConnection({host:"localhost", user:"root", password:"", database:"cs102" })
db.connect((error) =>{
    if (error){throw err}
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

app.get("/", checkAuthenticated,(req, res)=>{
  let subjects = req.user.subjects.split(" ")
  all_subjects = Object.keys(all_subjects_val)

  for(let i=0; i<all_subjects.length; i++){
    if(subjects.includes(all_subjects[i])){
      all_subjects_val[all_subjects[i]] = "block";
    }
  }

  res.render("home_page", {ma102:all_subjects_val['MA102'], cs102:all_subjects_val['CS102'], ee101:all_subjects_val['EE101'], no101:all_subjects_val['NO101']})
  for (let key in all_subjects_val) {
     all_subjects_val[key] = "none"
  }
})

app.get("/profile", checkAuthenticated, (req,res)=>{
  res.render("profile", {name: req.user.name, id:req.user.id, email:req.user.email, branch: req.user.branch, batch: req.user.batch})
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

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/
app.listen(3000)