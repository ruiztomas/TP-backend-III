import bcrypt from "bcrypt";
import {faker} from "@faker-js/faker";

export const generateMockUsers=(quantity)=>{
    const users=[];
    
    for (let i=0; i<quantity; i++){
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: bcrypt.hashSync("coder123", 10),
            role: faker.helpers.arrayElement(["user", "admin"]),
            pets:[]
        });
    }
    return users;
};