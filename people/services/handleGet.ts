import { HttpRequest } from "@azure/functions"
import { model } from "mongoose"
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize, email } = req.query
    const id = req.params.id

    const modelPeople = model('People').schema.obj
    
    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelPeople).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await People.findById(id).exec() }

    if(email) 
        return context.res = { body: await People.findOne({ email }).exec() }
        
    const totalPeople = await People.find(req.query).count()
    const people = await People.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : people, 
            hasNext: Math.ceil(totalPeople / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}