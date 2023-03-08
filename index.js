
const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  passTimes.forEach(element => {
    console.log(`Next pass at ${new Date(element.risetime)} for ${element.duration} seconds!`);
    
  });
  
});