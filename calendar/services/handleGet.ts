import { HttpRequest } from "@azure/functions"
import { model } from "mongoose"
import { Context } from "vm"
import { Calendar } from "../../src/models/CalendarModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query
    const id = req.params.id

    const modelCalendar = model('Calendar').schema.obj
    
    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelCalendar).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await Calendar.findById(id).exec() }
        
    const totalCalendar = await Calendar.find(req.query).count()
    const calendar = await Calendar.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    return context.res = {
        body: { 
            items : calendar, 
            hasNext: Math.ceil(totalCalendar / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}