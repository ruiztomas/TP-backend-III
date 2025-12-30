import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions={
    definition:{
        openapi:"3.0.1",
        info:{
            title: "Users API",
            description: "Documentacion del modulo Users"
        }
    },
    apis:["./src/routes/users.router.js"]
};

export const swaggerSpecs=swaggerJSDoc(swaggerOptions);