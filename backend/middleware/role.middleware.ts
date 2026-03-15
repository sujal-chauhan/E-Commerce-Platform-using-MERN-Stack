import type { Request, Response, NextFunction } from "express";

export const roleMiddleware = async(
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    try{
        if(req.user?.role !== 'admin') {
            return res.status(403).json({message: "Access denied"})
        }
        next()
    }catch(error){
        console.error("Error in role middleware")
    }
}