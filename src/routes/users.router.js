import {Router} from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         pets:
 *           type: array
 *       example:
 *         first_name: Juan
 *         last_name: Perez
 *         email: juan@test.com
 *         password: 1234
 *         role: user
 *         pets: []
 */

const router=Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get("/", async (req, res)=>{
    try{
        const users=await UserModel.find();
        res.status(200).json({status:"success",payload: users});
    }catch(error){
        res.status(500).json({status:"error", error: error.message});
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get("/:uid", async(req,res)=>{
    try{
        const user=await UserModel.findById(req.params.uid);
        if(!user){
            return res.status(400).json({status: "error", message: "Usuario no encontrado"});
        }
        res.status(200).json({status: "success", payload: user});
    }catch(error){
        res.status(400).json({status: "error", message: "ID invalido"});
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos incompletos
 */

router.post("/", async(req,res)=>{
    try{
        const {first_name, last_name, email, password, role}=req.body;
        if(!first_name || !last_name || !email || !password){
            return res.status(400).json({status: "error", message: "Datos incompletos"});
        }
        const hashedPassword=bcrypt.hashSync(password, 10);
        const newUser=await UserModel.create({
            first_namem,
            last_name,
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json({status: "success", payload: newUser});
    }catch(error){
        res.status(500).json({status:"error", error: error.message});
    }
});

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */

router.put("/:uid",async(req,res)=>{
  try{
    const updatedUser=await UserModel.findByIdAndUpdate(
      req.params.uid,
      req.body,
      {new:true}
    );
    if(!updatedUser){
      return res.status(404).json({status:"error",message:"Usuario no encontrado"});
    }
    res.status(200).json({status:"success",payload:updatedUser});
  }catch(error){
    res.status(400).json({status:"error",message:"Error al actualizar usuario"});
  }
});

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */

router.delete("/:uid",async(req,res)=>{
  try{
    const deletedUser=await UserModel.findByIdAndDelete(req.params.uid);
    if(!deletedUser){
      return res.status(404).json({status:"error",message:"Usuario no encontrado"});
    }
    res.status(200).json({status:"success",message:"Usuario eliminado"});
  }catch(error){
    res.status(400).json({status:"error",message:"ID inválido"});
  }
});

export default router;