"use strict";
const express = require("express");
const bodyParser = require('body-parser')
module.exports = {
    name: "gateway",
    settings: {
        port: process.env.PORT || 3000,
    },
    methods: {
        initRoutes(app) {
            app.get("/movies", this.getMovies);
            app.get("/movies/:id", this.getMovie);
            app.post("/movies", this.createMovie);
        },
        getMovies(req, res) {
            return Promise.resolve()
                .then(() => {
                    return this.broker.call("movies.listAll").then(movies => {
                        res.send(movies);
                    });
                })
                .catch(this.handleErr(res));
        },
        getMovie(req, res) {
            const id = req.params.id;
            return Promise.resolve()
                .then(() => {
                    return this.broker.call("movies.getById", {id: id}).then(movie => {
                        res.send(movie);
                    });
                })
                .catch(this.handleErr(res));
        },
        createMovie(req, res) {
            const payload = req.body;
            return Promise.resolve()
          .then(() => {
              return this.broker.call("movies.create", { payload }).then(movie =>
                    res.send(movie)
                );
          })
          .catch(this.handleErr(res));
        },
        handleErr(res) {
            return err => {
                res.status(err.code || 500).send(err.message);
            };
        }
    },
    created() {
        const app = express();
        app.use(bodyParser());
        this.initRoutes(app);
        this.app = app;
    }
};