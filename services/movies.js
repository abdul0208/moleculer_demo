"use strict"; 

const movies = [
    {id: 1, title: 'Sharknado'},
    {id: 2, title: 'Roma'},
];

module.exports = {
    name: "movies",

    actions: {
        listAll(ctx) {
           return Promise.resolve({ movies: movies });
        },
        getById(ctx) {
            const id = Number(ctx.params.id);
            return Promise.resolve(movies.find(movie => movie.id === id ));
        },
        create(ctx) {
            const lastId = Math.max(...movies.map(movie => movie.id));
            const movie = {
                id: lastId + 1,
                ...ctx.params.payload,
            };
            movies.push(movie);
            this.broker.emit("movie.created", movie);
            return Promise.resolve(movie);
        }
    },
};