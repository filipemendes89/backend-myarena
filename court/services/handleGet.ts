import { HttpRequest } from "@azure/functions"
import { model } from "mongoose"
import { Context } from "vm"
import { Court } from "../../src/models/CourtModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query
    const id = req.params.id

    const modelCourt = model('Court').schema.obj
    
    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelCourt).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await Court.findById(id).exec() }
        
    const totalCourt = await Court.find(req.query).count()
    const court = await Court.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : court, 
            hasNext: Math.ceil(totalCourt / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}