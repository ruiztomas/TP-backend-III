import express from "express";
import {connectDB} from "./config/db.js";
import mocksRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import swaggerUi from "swagger-ui-express";
import {swaggerSpecs} from "./config/swagger.js";
import adoptionRouter from "./routes/adoption.router.js";

const app=express();
const PORT=8000;

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api/mocks", mocksRouter);
app.use("/api/users", usersRouter);
app.use("api/adoptions", adoptionRouter);

connectDB();

app.listen(PORT, ()=>{
    console.log(`Servidor activo en puerto ${PORT}`);
});