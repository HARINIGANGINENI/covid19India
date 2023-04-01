const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite");

const databasePath = path.join(__dirname, "covid19India.db");

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer=async()=>{
   try{
    database= await open({
        filename:databasePath,
        driver:sqlite3.Database,
    });
    app.listen(3000, ()=>
    console.log("Server Running at http://localhost:3000/");
    );
}

  catch(error){
      console.log(`DB Error: ${error.message}`);
      process.exit(1);
  };
}

initializeDbAndServer();

const convertStateDbObjectToResponseObject= (dbObject)=>{
    return{
        stateId:dbObject.state_id,
        stateName:dbObject.state_name;,
        population:dbObject.population,
        
    };
};


const convertDistrictDbObjectToResponseObject= (dbObject)=>{
    return{
        districtId:dbObject.district_id,
        districtName:dbObject.district_name,
        stateId:dbObject.state_id,
        cases:dbObject.cases,
        cured:dbObject.cured,
        active:dbObject.active,
        deaths:dbObject.deaths,
        
    };
};

app.get("/states/",async(request,response)=>{
    const getStatesQuery=`
    SELECT * FROM state;`;
    const statesArray= await database.all(getStatesQuery);
    response.send(statesArray); 
});


app.get("/states/:stateId/",async(request,response))=>{
    const {stateId}=request.params;
    const getStateQuery=`
    SELECT * FROM state 
    WHERE state_id=${stateId};`;
    const state=await database.get(getStateQuery);
    response.send(convertStateDbObjectToResponseObject(state));

};

app.post("/districts/",async(request,response)=>{
    const{districtName,stateId,cases,cured,active,deaths}=request.body;
    const postQuery=`
    INSERT INTO district(district_name,state_id,cases,cured,active,deaths)
    VALUES(
        "${districtName}",${stateId},'${cases}','${active}',${deaths});`;
        await database.run(postQuery);
        response.send("District Successfully Added");
       
});

app.get("/districts/:districtId",async(request,response)=>{
    const {districtId}=request.params;
    const getDistrictQuery=`
    SELECT * FROM district
    WHERE district_id=${districtId};`;
    const district=await database.get(getDistrictQuery);
    response.send(convertDistrictDbObjectToResponseObject(district));
});

app.delete("/districts/:districtId/",(request,response)=>{
    const {districtId}=request.params;
    const deleteDistrictQuery=`
    DELETE FROM district
    WHERE district_id=${districtId};`;
    await database.run(deleteDistrictQuery);
    response.send("District Removed");
});

app.put("/districts/:districtId/",async(request,response)=>{
const {districtId}=request.params;
const {districtName,stateId,cases,cured,active,deaths}=request.body;
const putDistrictQuery=`
UPDATE  district
SET 
   district_name='${districtName}',
   state_id=${stateId},
   cases="${cases}",
   cured='${curved}',
   active='${deaths}';`;
    await database.run(putDistrictQuery);
    response.send("District Details Updated");
});

app.get("/states/:stateId/status/",(request,response)=>{
    const {stateId}=request.params;
    const getStatusQuery=`
    SELECT 
    SUM(cases),
    SUM(curved),
    SUM(active),
    SUM(deaths)
    FROM state
    WHERE state_id=${stateId};`;
   const status= await database.get(getStatusQuery);

   console.log(status);
   response.send({
       totalCases:status["SUM(cases)"],
       totalCured:status["SUM(curved)"],
       totalActive:status["SUM(active)"],
       totalDeaths:status["SUM(deaths)"],
   });
});

app.get("/districts/:districtId/details/",(response,request)=>{
    const {districtId}=request.params;
    const
})


app.get("/districts/:districtId/details/",async (request, response) => {
const { districtId } = request.params;
const getDistrictIdQuery = `
select state_id from district
where district_id = ${districtId};
const getDistrictIdQueryResponse =await database.get(getDistrictIdQuery);

const getStateNameQuery = `
select state_name as stateName from state
where state_id = ${getDistrictIdQueryResponse.state_id};
`;
const getStateNameQueryResponse =await database.get(getStateNameQuery);
response.send(getStateNameQueryResponse);});


module.exports=app;