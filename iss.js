const request = require("request");
const { parse } = require("yargs");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {

 
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
      callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback){
  request(`https://ipwho.is/${ip}`, (error, response, body)=>{
    // inside the request callback ...
  // error can be set if invalid domain, user is offline, etc.
  if (error) {
    callback(error, null);
    return;
  }

  // parse the returned body so we can check its information
  const parsedBody = JSON.parse(body);
    // check if "success" is true or not
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

  // if we get here, all's well and we got the data
  const  {latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude });


  });

};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
  
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback){
  
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }  
  
  fetchCoordsByIP(ip, (error, coordinates) =>{
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
  
    fetchISSFlyOverTimes(coordinates, (error, passTimes) =>{
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
    
      // console.log('It worked! Returned Flyovers:' , passTimes);

      callback(error, passTimes)
    
    });
  });

  
  });

 


};
// Don't need to export the other functions since we are not testing them right now.

module.exports = {nextISSTimesForMyLocation};