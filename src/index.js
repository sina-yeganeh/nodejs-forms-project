const express = require('express')
const session = require('express-session')
const upload = require('express-fileupload')
const mysql = require('mysql')
const path = require('path')

const port = 3000

var server = express()

var database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejsLoginForm"
})

server.set("view engine", "ejs")

database.connect((err) => {
  if (err) console.error(`can't connect to database:${err}`);
  else console.log("connect to database sussccfully!");
})

server.use(express.static(path.join(__dirname, "assets")))
server.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.get("/form-1", (req, resp) => {
  resp.render(path.join(__dirname, "public/forms/form_1.ejs"))
})

server.post("/check-form-1", (req, resp) => {
  session.speaking = req.body.speaking
  session.reading = req.body.reading
  session.writing = req.body.writing
  session.lisiting = req.body.lisiting
  session.vocab = req.body.vocab
  session.conver = req.body.conver

  resp.redirect("/form-2")
})

server.get("/form-2", (req, resp) => {
  resp.render(path.join(__dirname, "public/forms/form_2.ejs"))
})

server.post("/check-form-2", (req, resp) => {
  resp.redirect("/form-3")
})

server.get("/form-3", (req, resp) => {
  resp.render(path.join(__dirname, "public", "forms", "form_3.ejs"))
})

server.post("/check-form-3", (req, resp) => {
  session.fullname = req.body.fullname
  session.age = req.body.age
  session.gener = req.body.gener
  session.city = req.body.city
  session.fos = req.body.fos
  session.grade = req.body.grade
  session.number = req.body.number
  session.email = req.body.email
  session.contact = req.body.contact
  session.freetime = req.body.freetime
  session.freeTimeInterval = req.body.freeTimeInterval
  session.ref = req.body.ref
  session.range = req.body.range
  session.personalUpgrade = req.body.personalUpgrade
  session.jobUpgrade = req.body.jobUpgrade
  session.migration = req.body.migration
  session.readyToExam = req.body.readyToExam
  session.yesToExam = req.body.yesToExam
  session.noToExam = req.body.noToExam
  session.yesToSignin = req.body.yesToSignin
  session.noToSignin = req.body.noToSignin
  session.motivation = req.body.motivation
  session.teacher = req.body.teacher

  resp.redirect("/form-4")
})

server.get("/form-4", (req, resp) => {
  if (session.yesToExam) {
    resp.render(path.join(__dirname, "public/forms/form_4_1.ejs"))
  } else if (session.yesToSignin) {
    resp.render(path.join(__dirname, "public", "forms", "form_4_2.ejs"))
  } else if (session.yesToExam && session.yesToSignin) {
    resp.render(path.join(__dirname, "public", "forms", "form_4.ejs"))
  } else {
    resp.redirect("form-5")
    session.form_4 = false
  }
})

server.post("/upload", (req, resp) => {
  var filePath
  var file

  file1 = req.files.historyOfExam
  file2 = req.files.examSignupPic
  filePath1 = __dirname + "./assets/img/files" + file1
  filePath2 = __dirname + "./assets/img/files" + file2

  file1.mv(filePath1, (err) => {
    if (err) console.error(`can't upload file:${err}`);
    else console.log(`upload file succssfuly!`);
  })

  file2.mv(filePath2, (err) => {
    if (err) console.error(`can't upload file:${err}`);
    else console.log(`upload file succssfuly!`);
  })
})

server.post("/check-form-4", (req, resp) => {
  session.mak = req.body.mak
  session.general = req.body.general
  session.academic = req.body.academic
  session.tafel = req.body.tafel
  session.other = req.body.other
  session.historyOfExam = req.body.historyOfExam
  session.lisiteningRank = req.body.lisiteningRank
  session.readingRank = req.body.readingRank
  session.writingRank = req.body.writingRank
  session.speakingRank = req.body.speakingRank

  var file = req.files.UploadExamPic

  file.mv(__dirname + "./assets/img/files" + file.name, (err) => {
    if (err) console.error(`can't upload file:${err}`);
    else console.log(`upload file succssfuly!`);
  })

  resp.redirect("/form-5")
})

server.get("/form-5", (req, resp) => {
  session.password = req.body.password
  session.confirmPassword = req.body.confirmPassword
  session.emailIsUsername = req.body.emailIsUsername
  session.phoneIsUsername = req.body.phoneIsUsername
  session.private = req.body.private
  session.public = req.body.public

  resp.redirect("/add-user-to-database")
})

server.get("/add-user-to-database", (req, resp) => {
  database.query("INSERT INTO `Users` VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
  [
    session.user,
    session.password,
    session.email,
    session.number,
    [session.speaking, session.reading, session.writing, session.lisiting, session.vocab, session.conver],
    session.age,
    session.gener,
    session.city,
    session.contact,
    session.freetime,
    session.ref,
    session.motivation,
    session.teacher,
    [session.mak, session.general, session.academic, session.tafel, session.other],
    "NULL",
    session.historyOfExam,
    session.lisiteningRank,
    session.readingRank, 
    session.writingRank, 
    session.speakingRank, 
    session.emailIsUsername,
    session.phoneIsUsername,
    [session.private, session.public]
  ], err => {
    if (err) console.error(`can't insert data to database:${err}`)
  })
})

server.get("/", (req, resp) => {
  resp.render(path.join(__dirname, "public", "index.ejs"))
})

server.post("/search-in-database", (req, resp) => {
  session.searchWord = req.body.searchWord

  resp.redirect("/search")
})

server.get("/search", (req, resp) => {
  database.query("SELECT * FROM `Users` WHERE city = ?", [session.searchWord], (err, result, _) => {
    if (err) console.error(`can't select users from users:${err}`)
    else resp.render(path.join(__dirname, "public", "search.ejs"), {
      users: result
    })
  })
})

server.get("/pages/:user", (req, resp) => {
  username = req.params.user
  database.query("SELECT * FROM `Users` WHERE username = ?", [username], (err, result) => {
    if (err) console.error(`can't select user tabel:${err}`);
    else {
      resp.render(path.join(__dirname, "public", "user.ejs"), {
        user: result
      })
    }
  })
})

server.listen(port, () => {
  console.log(`server is running in port ${port}`)
})
