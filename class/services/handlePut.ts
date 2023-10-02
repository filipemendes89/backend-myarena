import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"

export default async (context: Context,req: HttpRequest) => { 
    req.body.isIsFull = req.body.peopleList?.length > req.body.people 
    
    return context.res = {
        body: await Class.findByIdAndUpdate(req.params.id, req.body, { new: true }),
        status: 200
    }
}