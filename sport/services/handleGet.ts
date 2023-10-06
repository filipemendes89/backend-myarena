import { HttpRequest } from "@azure/functions"
import mongoose, { model } from "mongoose"
import { Context } from "vm"
import { Sport } from "../../src/models/SportModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize, memberId } = req.query
    const id = req.params.id

    const modelSport = model('Sport').schema.obj

    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelSport).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await Sport.findById(id).exec() }
        
    const totalSport = await Sport.find(req.query).count()
    const sportFound = await Sport.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : sportFound, 
            hasNext: Math.ceil(totalSport / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}

const handleMemberId = async (context: Context, req: HttpRequest, memberId: string, page: string, pageSize: string) => {
    const query = {
        "peopleList._id": new mongoose.Types.ObjectId(memberId)
    }
    
    const totalSportes = await Sport.find(query).count()
    const sportesFound = await Sport.find(query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .populate('teacherId')
    .populate('courtId')
    .exec()

    return context.res = {
        body: { 
            items : sportesFound, 
            hasNext: Math.ceil(totalSportes / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}