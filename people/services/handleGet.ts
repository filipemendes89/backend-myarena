import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query
    const id = req.params.id

    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(People.schema).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await People.findById(id).exec() }
        
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