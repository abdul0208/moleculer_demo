require('dotenv').config();
// const ServiceBroker = require("../src/service-broker");
const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");



const broker = new ServiceBroker({
    nodeID: "my-node",
	logger: console,
});

broker.loadService(__dirname + "/ls-connect.js");

broker.createService({
    mixins:[ApiService],

    settings: {
        port:3100,
        routes:[{
            path:"/",
            aliases:{
                "login":"connect.login"
            }
        }]

    }
})

broker
      .start()
      .then(()=>{
          return broker
                       .call("connect.login")
                       .then((r)=>{
                        // broker.logger.info(r)
                        broker.call("connect.getItem",{id:257,flag:433,ssid:r.sid}).then((r)=>{
                            broker.logger.info(r)
                        })
                       })
      })