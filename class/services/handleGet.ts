import { HttpRequest } from "@azure/functions"
import mongoose, { model } from "mongoose"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize, memberId } = req.query
    const id = req.params.id

    const modelClass = model('Class').schema.obj

    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelClass).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await Class.findById(id).exec() }
    
    if(memberId)
        return await handleMemberId(context, req, memberId, page, pageSize)
        
    const totalClass = await Class.find(req.query).count()
    const classFound = await Class.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : classFound, 
            hasNext: Math.ceil(totalClass / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}

const handleMemberId = async (context: Context, req: HttpRequest, memberId: string, page: string, pageSize: string) => {
    const query = {
        "peopleList._id": new mongoose.Types.ObjectId(memberId)
    }
    
    const totalClasses = await Class.find(query).count()
    const classesFound = await Class.find(query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : classesFound, 
            hasNext: Math.ceil(totalClasses / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}