import {Router} from "express";
import AdoptionModel from "../models/Adoption.js";
import UserModel from "../models/User.js";
import PetModel from "../models/Pet.js";

const router=Router();

router.get("/",async(req,res)=>{
  try{
    const adoptions=await AdoptionModel
      .find()
      .populate("user")
      .populate("pet");

    res.status(200).json({status:"success",payload:adoptions });
  }catch(error){
    res.status(500).json({status:"error",error:error.message});
  }
});

router.get("/:aid",async(req,res)=>{
  try{
    const adoption=await AdoptionModel
      .findById(req.params.aid)
      .populate("user")
      .populate("pet");

    if(!adoption){
      return res.status(404).json({
        status:"error",
        message:"Adopción no encontrada"
      });
    }
    res.status(200).json({status:"success",payload:adoption});
  }catch(error){
    res.status(400).json({
      status:"error",
      message:"ID inválido"
    });
  }
});

router.post("/",async(req,res)=>{
  try{
    const{userId,petId}=req.body;
    if(!userId || !petId){
      return res.status(400).json({
        status:"error",
        message:"userId y petId son obligatorios"
      });
    }

    const user=await UserModel.findById(userId);
    const pet=await PetModel.findById(petId);

    if(!user || !pet){
      return res.status(404).json({
        status:"error",
        message:"Usuario o mascota no encontrada"
      });
    }

    const adoption=await AdoptionModel.create({
      user:userId,
      pet:petId
    });
    res.status(201).json({status:"success",payload:adoption});
  }catch(error){
    res.status(500).json({status:"error",error:error.message});
  }
});

router.delete("/:aid",async(req,res)=>{
  try{
    const deleted=await AdoptionModel.findByIdAndDelete(req.params.aid);

    if(!deleted){
      return res.status(404).json({
        status:"error",
        message:"Adopción no encontrada"
      });
    }
    res.status(200).json({
      status:"success",
      message:"Adopción eliminada"
    });
  }catch(error){
    res.status(400).json({
      status:"error",
      message:"ID inválido"
    });
  }
});

export default router;