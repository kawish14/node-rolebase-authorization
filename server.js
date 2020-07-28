require('rootpath')();
const express = require('express');
var path = require('path');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');
var sql = require("mssql");

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


 const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'Gis@123',
        server: 'KHI-ENG-KABBAS', 
        database: 'Karachi',
        options: {
        trustedConnection: true
        },
        port: 1433,
    });

 async function getUserData(req,res){
   
    // config for your database

      await pool.connect().then(function(err){
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request(pool);
           
        // query to the database and get the records
        request.query("SELECT * FROM Users", function (err, result) {
            
            if (err) console.log(err)
         
         // send records as a response        
          res.send(result.recordset)
          console.log(result.recordset)
            pool.close()

            
        });
    });

  
}
app.get('/userdata', getUserData)
// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 2000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
