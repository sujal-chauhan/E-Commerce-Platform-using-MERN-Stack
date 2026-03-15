import { Router, type Request, type Response } from "express";
import googleLogin from './auth.controller.ts'


const router = Router()

router.get('/test', (req, res)=>{
    res.send('rest pass')
})

router.get('/google', googleLogin)

export default router