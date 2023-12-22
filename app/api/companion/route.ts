import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    try{
        const body= await req.json();
        const user= await currentUser()
        const {src,name,description, instruction,seed, categoryId}= body

        if (!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorised!!", {status: 401})
        }

        if (!src || !name|| !description || !instruction || !seed || !categoryId){
            return new NextResponse("Missing Fields Detected!", {status: 402})
        }

        const companion= await prismadb.companion.create({
            data: {
                categoryId,
                userID: user.id,
                userName: user.firstName,
                src,
                name,
                instruction,
                description,
                seed
            }
        })

        return NextResponse.json(companion)
    }catch(error){
        console.log("[COMPANION_POST]",error)
        return new NextResponse("Internal Error",{status: 500})
    }
}