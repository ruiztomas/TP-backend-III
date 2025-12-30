import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import UserModel from "../src/models/User.js";
import PetModel from "../src/models/Pet.js";
import AdoptionModel from "../src/models/Adoption.js";

const expect=chai.expect;
const requester=supertest("http://localhost:8080");

describe("Tests funcionales - Adoptions",function(){
  let userId;
  let petId;
  let adoptionId;

  before(async function(){
    await mongoose.connect("mongodb://127.0.0.1:27017/mocksTP");

    const user=await UserModel.create({
      first_name:"Test",
      last_name:"User",
      email:"testuser@test.com",
      password:"1234"
    });

    const pet=await PetModel.create({
      name:"Test Pet",
      species:"dog",
      adopted:false
    });

    userId=user._id.toString();
    petId=pet._id.toString();
  });

  after(async function(){
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await AdoptionModel.deleteMany({});
    await mongoose.connection.close();
  });

  it("POST /api/adoptions → debe crear una adopción correctamente",async function(){
    const res=await requester
      .post("/api/adoptions")
      .send({ userId, petId });

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.have.property("_id");

    adoptionId=res.body.payload._id;
  });

  it("POST /api/adoptions → error si faltan datos", async function(){
    const res=await requester
      .post("/api/adoptions")
      .send({});

    expect(res.status).to.equal(400);
  });

  it("GET /api/adoptions → debe devolver todas las adopciones", async function(){
    const res=await requester.get("/api/adoptions");

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
    expect(res.body.payload.length).to.be.greaterThan(0);
  });

  it("GET /api/adoptions/:id → debe devolver una adopción", async function(){
    const res=await requester.get(`/api/adoptions/${adoptionId}`);

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property("_id");
  });

  it("GET /api/adoptions/:id → error con ID inválido", async function(){
    const res=await requester.get("/api/adoptions/123");

    expect(res.status).to.equal(400);
  });

  it("DELETE /api/adoptions/:id → debe eliminar la adopción", async function(){
    const res=await requester.delete(`/api/adoptions/${adoptionId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Adopción eliminada");
  });

  it("DELETE /api/adoptions/:id → error si no existe", async function(){
    const res=await requester.delete(`/api/adoptions/${adoptionId}`);

    expect(res.status).to.equal(404);
  });

});
