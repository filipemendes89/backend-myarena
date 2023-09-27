import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query
    const id = req.params.id

    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(Class.schema).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await Class.findById(id).exec() }
        
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