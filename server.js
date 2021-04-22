require('rootpath')();
const express = require('express');
var path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');
const { Client } = require('pg');
var GeoJSON = require('geojson');

const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.json())
app.set('json spaces', 1)
app.use(cors());
//app.use(express.urlencoded({ extended: false }));

var username = "sde" // sandbox username
var password = "Gis@123" // read only privileges on our table
var host = "localhost:5432"
var database = "enterprise" // database name
var conString = "postgres://" + username + ":" + password + "@" + host + "/" + database;

var username1 = "gisuser" 
var password1 = "Gisuser@31A" 
var host1 = "45.249.11.5:5433"
var database1 = "gpondb" 
var conString1 = "postgres://" + username1 + ":" + password1 + "@" + host1 + "/" + database1;

const client1 = new Client(conString1);
const client = new Client(conString);
start()

async function start() {
    await connect()

    /* const readData = await read()
    console.log(readData) */

    /* const insertData = await insert('64F')
    console.log(insertData) 

     const successDelete = await deletData(351)
    console.log(successDelete) */
}

app.get("/NOC-data/0", async (req, res) => {
    const result = {}
   try
   {
       let query = await client1.query("SELECT * FROM ontsdb where status = 0 and olt in ('KHI-BA-OLT-1-1','KHI-RHT-OLT-1-1','KHI-TP-OLT-1-1','KHI-BDR-OLT-1-1','KHI-PH2-OLT-1-1')")
        result.success = query.rows
      
       console.log('get pop-detail data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})

app.get("/NOC-data", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT * FROM sde.customer_evw INNER JOIN dblink('host=45.249.11.5 port=5433 dbname=gpondb user=gisuser password=Gisuser@31A','select olt,frame,slot,port,ontid,alias,status,downcause,time,ontmodel,ontrxpower from ontsdb')as t1(olt text,frame bigint,slot bigint, port bigint, ontid bigint, alias text, status bigint, downcause text, time text, ontmodel text, ontrxpower text) ON sde.customer_evw.id = t1.alias")
        result.success = query.rows
      
       console.log('get NOC data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       let data = result.success
       //res.send(result.success)
       res.send(GeoJSON.parse(data, {Point: ['lat', 'lon']}))
   }
})

app.get("/pop-detail", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT * FROM sde.pop_detail_evw")
        result.success = query.rows
      
       console.log('get pop-detail data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})

app.get("/dktcc-trench", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,road_name,work_status,phase,date,hdpe,distance,remarks) AS l )) As properties FROM sde.dktcc_trench_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get dktcc_trench data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})
app.get("/dktcc-hh", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,road,layer,phase,date,distance,operators,lat,lon) AS l )) As properties FROM sde.dktcc_hh_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get dktcc_hh data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})
app.get("/customer", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,name,id,address,type,fat,dc_odb,pop,lat,lon) AS l )) As properties FROM sde.customer_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get customer data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})
app.get("/pop", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,name,id) AS l )) As properties FROM sde.pop_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get pop data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})

app.get("/dc", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,name,id,splitter,placement,pop,lat,lon) AS l )) As properties FROM sde.dc_odb_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get dc data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})
app.get("/fat", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,name,id,splitter,dc,pop,lat,lon) AS l )) As properties FROM sde.fat_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get fat data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})
app.get("/jc", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,network,placement,comment) AS l )) As properties FROM sde.joint_closure_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get JC data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})
app.get("/fiber", async (req, res) => {
    const result = {}
   try
   {
       let query = await client.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(ST_SetSRID(shape, 32642), 4326))::json As geometry,  row_to_json((SELECT l FROM (SELECT objectid,capacity,placement,network,pop,length,comment) AS l )) As properties FROM sde.fiber_evw As lg) As f) As fc")
       query.rows.map(e => {
        result.success = e.row_to_json
       })
       console.log('get fiber data successfully')
       return true
   }
   catch(e)
   {    
       console.log(`somwthing wrong happend ${e}`)
       result.success = false
       return false
   }
   finally
   {
       res.setHeader("content-type", "application/json")
       res.send(result.success)
   }
})

async function connect() {
    try {
        await client.connect()
        await client1.connect()

    }
    catch (e) {
        console.log(`Failed to connect ${e}`)
    }

}

app.use(express.static(path.join(__dirname, 'routes')));

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 2000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
