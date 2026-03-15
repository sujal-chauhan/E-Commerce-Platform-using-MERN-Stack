import type { Request, Response } from "express"
import { oauth2client } from "../Utils/googleConfig.ts"
import axios from "axios";
import User from "../User/user.model.ts";
import jwt from "jsonwebtoken"

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

const googleLogin = async(req:Request, res:Response) : Promise<void> =>{
    try{
        const {code} = req.query;
        
        if (!code || typeof code !== 'string') {
            res.status(400).json({ error: 'Authorization code is required' });
            return;
        }

        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens)

        const userResponse = await axios.get<GoogleUser>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)

        const {name, email} = userResponse.data;

        let user = await User.findOne({email})

        //user doesn't already exists
        if(!user){
            user = await User.create({name, email})
        }

        const {_id, role} = user
        
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ error: 'JWT_SECRET is not set' });
            return;
        }

        const token = jwt.sign({_id, email, role}, process.env.JWT_SECRET, {expiresIn: '12h'});

        res.json({
            message: 'success',
            token,
            user 
        });
    }catch(err){
        console.error("Error in googleLogin:", err);
        res.status(500).json({
            message: 'Internal server error',
            error: err instanceof Error ? err.message : 'Unknown error'
        })
    }
}

export default googleLogin