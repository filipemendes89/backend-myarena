import { HttpRequest } from "@azure/functions"
import { model } from "mongoose"
import { Context } from "vm"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query
    const id = req.params.id

    const modelReservation = model('Reservation').schema.obj

    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelReservation).includes(key)){
            delete req.query[key]
        }
    })

    if(id)
        return context.res = { body: await Reservation.findById(id).populate('reserverId').populate('courtId')
        .populate('classId').exec() }
        
    const totalReservation = await Reservation.find(req.query).count()
    const classFound = await Reservation.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .populate('reserverId')
    .populate('courtId')
    .populate('classId')
    .populate({
        path: 'classId',
        populate: {
            path: 'teacherId'
        }
    })
    .exec()

    return context.res = {
        body: { 
            items : classFound, 
            hasNext: Math.ceil(totalReservation / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}