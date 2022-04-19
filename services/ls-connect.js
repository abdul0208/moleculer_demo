"use strict";
const express = require("express");
const bodyParser = require('body-parser')
const request = require('request');
const moment =require('moment')
require('dotenv').config();
const { ServiceBroker } = require('moleculer')
// const ServiceBroker = require("../src/service-broker");
// console.log(process.env)

const baseUrl='http://ekarme.locationsolutions.com'

const token='a322518aadf76972068a3848a66805ce527EE86D8BA65058FE923A6ACF392F2A01F3BC82'

const operateAs=''


module.exports = {
    name:"connect",
    settings: {
        port: process.env.PORT || 3000,
    },
    actions:{
        wexec(ctx) {
            // console.log(ctx.params)
            return new Promise (function(resolve,reject){

                // _log("sid", sid)
                if (typeof ctx.params.ssid == 'undefined') return
                var url = baseUrl + '/wialon/ajax.html'
            
                var form = {
                    sid: (typeof ctx.params.ssid !== 'undefined') ? ctx.params.ssid : sid,
                    svc: ctx.params.svc,
                    params: JSON.stringify(ctx.params.params)
                };
                console.log(url,form)
                request(url, {
                    json: true,
                    form: form
                }, (err, resp, body) => {
                    // if (Disrupt == 1) {
                    //     err = { error: 1 }
                    // }
                    if (err) {
                        console.log(err)
                        if (typeof global.FailedCommands == 'undefined') {
                            FailedCommands = []
                        }
                        if (typeof global.doFailedCommands == 'undefined'
                            || global.doFailedCommands == false) {
                            if (svc == 'unit/exec_cmd') {
                                FailedCommands.push({ svc: svc, params: params })
                                console.log(FailedCommands)
                            }
            
                        }
                       return reject(err);
                    }
                    else{
                        console.log(body)
                       return resolve(body);
                    }
            
                })
            })
        },
        getItem (ctx) {
            // console.log(ctx)
            return new Promise (function(resolve,reject){
                // wexec('core/search_item', {
                //     "id": ctx.params.id,
                //     "flags": ctx.params.flags,
            
                // },ctx.params.ssid).then((res)=>{
                //     return resolve(res)
                // })
                ctx.call('connect.login').then((res)=>{
                    ctx.call('connect.wexec',{svc:'core/search_item',params:{"id":257,"flags": 433},ssid:res.sid}).then((r)=>{
                        return resolve(r)
                    })
                })
                
            })
        },
       login() {
           return new Promise (function (resolve,reject){

            //    console.log(baseUrl, token)
               var url = baseUrl + '/wialon/ajax.html?svc=token/login&params={"token": "' + token + '", "operateAs":"' + operateAs + '"}'
            //    console.log(url)
               request(url, { json: true }, function (err, res, body) {
                //    console.log(body)
           
                   if (typeof body !== 'undefined' && typeof body.eid !== 'undefined') {
                       // console.log(body.user.prp)
                       // const loginTime = body.user.ld
                       const sid = body.eid;
                       const loginTime = body.tm * 1000
                       const loginTimeUnix = body.tm
                       const wialonTimeZone = body.user.prp.tz
           
                    //    console.log("SID", sid);
                       const loginData = {
                           user: body.user.nm,
                           sid: sid,
                           baseUrl: baseUrl,
                           userid: body.user.id,
                        //    version: version,
                        //    currentFolder: currentFolder,
                        //    account: account,
                           wialonTimeZone: wialonTimeZone,
                           // isLocal: checkLocalServer(),
                       };
                       console.table(loginData);
                       
                           return resolve(loginData)
                       
           
           
                   } else {
                       console.log("Retrying Login")
                       if (typeof DisuptionTime == 'undefined') {
                           const DisuptionTime = parseInt(moment().format("X"))
                           console.log("Setting Disruption Time");
           
                       }
           
                       setTimeout(function () {
                           if (typeof poll !== 'undefined') {
                               clearInterval(poll);
                               console.log("Polling Begin")
                           }
           
                           ctx.call('connect.login')
           
                       }, 2000)
                   }
           
           
               });
           })
        }
        
    }

}


