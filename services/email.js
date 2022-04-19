"use strict";

module.exports = {
   name: "email",
   events: {
       "movie.created": {
           group: "other",
           handler(payload) {
              console.log('Recieved "movie.created" event in email service with payload: ', payload);
           }
       }
   },
};