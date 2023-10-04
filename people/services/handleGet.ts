import { HttpRequest } from "@azure/functions"
import { model } from "mongoose"
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize, email, filter } = req.query
    const id = req.params.id

    const modelPeople = model('People').schema.obj
    
    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelPeople).includes(key)){
            delete req.query[key]
        }
    })

    if(filter)
        return getFilteredPeople(context,req, filter, page, pageSize)

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

const getFilteredPeople = async (context: Context,req: HttpRequest, filter: string, page: string, pageSize: string) => {
    const totalFiltered = await People.find({ $or: [
        { cpf: { $regex: filter, $options: 'i' } },
        { nome: { $regex: filter, $options: 'i' } }
      ], $and: [req.query]}).count()

    const filteredPeople = await People.find({ $or: [
        { cpf: { $regex: filter, $options: 'i' } },
        { nome: { $regex: filter, $options: 'i' } }
    ], $and: [req.query]})
    
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : filteredPeople, 
            hasNext: Math.ceil(totalFiltered / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}