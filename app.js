const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 5000 || 4000;




require("dotenv").config();






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT || 3306  // Default to port 3306 if not provided
});



connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database", err);
    return;
  }
  console.log("Connected to database");
});




app.get('/users', (req, res) => {
    connection.query(" SELECT * FROM users ", (err, rows) => {
      if (err){
        res.status(err.code).json({error: err.message});
      };
      res.send(rows);
    });
}
);





app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM users WHERE id =?", [id], (err, rows) => {
    if (err) {
      res.status(err.code).json({ error: err.message });
    } else {
      res.send(rows[0]);
    }
  });
});





app.post('/adduser', (req, res) => {
  const { name, email ,age} = req.body;
  connection.query("INSERT INTO users (name, email,age) VALUES (?,?,?)", [name, email,age], (err, result) => {
    if (err) {
      res.status(err.code).json({ error: err.message });
    } else {
      res.json({ message: "User added successfully", id: result.insertId });
    }
  });   
});




app.put('/updateuser/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;


  console.log("ajghsdhgasdghagsd");
  
  connection.query(
    "UPDATE users SET name =?, age =? WHERE id =?",
    [name, age, id],
    (err, result) => {
      if (err) {
        console.log(err.message);
        
        res.status(err.code).json({ error: err.message });
      } else {
        res.json({ message: "User updated successfully" });
      }
    }
  );
});



app.delete('/deleteuser/:id', (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM users WHERE id =?", [id], (err, result) => {
    if (err) {
      res.status(err.code).json({ error: err.message });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
