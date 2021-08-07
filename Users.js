const express = require("express");
const router = express.Router();
// const { Users } = require("../models");
const db=require('../config/db');
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password,usermail} = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    db.query(
      "INSERT INTO users (username, password,usermail) VALUES (?, ?, ?)",
      [username, hash,usermail],
      (err, results) => {
        console.log(err);
        res.send("Registered");
      }
    );
   
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // const user =  await User.findOne()
  /// console.log()
  ///
  
   db.query(
    "SELECT * FROM users WHERE username = ?",
    username, (err, results) => {
      if (err) {
        console.log(err);
      }
      
//      [
//        {
//          id:'',
//          userName:'',
//        }
//      ]
    if (!user) res.json({ error: "User Doesn't Exist" });
  
      console.log(password, results[0]);
      
      
   const match = await bcrypt.compare(password, results[0].password);
    console.lg(match)
//   bcrypt.compare(password, results[0].password,async (match) => {
//   console.log(match);
//     if (!match) res.status(401).json({ error: "Wrong Username And Password Combination" });

//     try{
//       const accessToken = await sign(
//         { username: user.username, id: user.id },
//         "importantsecret"
        
//       );
//       res.status(200).json({ token: accessToken, username: username, id: user.id });
      
//     }catch(error){
//       console.log(error);
//     }
    
    
//   });
    });

  
});


router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

   await db.query("SELECT * FROM users WHERE id= ?",id,(err,res)=>{
if(err)
{console.log(err)}
   }) 
      res.json(basicInfo);

   //Users.findByPk(id, {
  //   attributes: { exclude: ["password"] },
  });

// });

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await  db.query(
    "SELECT * FROM users WHERE username = ?",
    req.user.username, (err, results) => {
      if (err) {
        console.log(err);
      }
    });
  bcrypt.compare(oldPassword, user.password,async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      db.query("UPDATE users SET password = ? WHERE username  = ?",[hash, req.user.username],(err, results) => {
        if (err) {
          console.log(err);
        }
      });
  
      // Users.update(
      //   { password: hash },
      //   { where: { username: req.user.username } }
      // );
      res.json("SUCCESS");
    });
  });
});

module.exports = router;
