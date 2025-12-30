import {Router} from "express";
import {generateMockUsers} from "../utils/mockingUsers.js";
import UserModel from "../models/User.js";
import PetModel from "../models/Pet.js";

const router=Router();

router.get("/mockingpets",(req,res)=>{
    const pets=[
        {name: "Firulais", species:"dog"},
        {name: "Michi", species:"cat"}
    ];
    res.status(200).json({status: "success", payload: pets});
});

router.get("/mockingusers", async(req,res)=>{
    const users=generateMockUsers(50);
    res.status(200).json({status: "success", payload:users});
});

router.post("/generateData", async(req,res)=>{
    try{
        const {users=0, pets=0}=req.body;
        const mockUsers=generateMockUsers(users);
        const createdUsers=await UserModel.insertMany(mockUsers);
        const mockPets=Array.from({length: pets},()=>({
            name: "Pet Mock",
            species: "Dog",
            adopted: false
        }));
        const createdPets=await PetModel.insertMany(mockPets);
        res.status(201).json({
            status:"success",
            usersInserted: createdUsers.length,
            petsInserted: createdPets.length
        });
    }catch(error){
        res.status(500).json({status:"error", error: error.message});
    }
});
export default router;