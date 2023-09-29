import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context,req: HttpRequest) => {
    const { reserverId, classId } = req.body

    if(!reserverId && !classId)
        throw new Error('ReserverId or ClassId are required')
        
    return context.res = {
        body: await new Reservation(req.body).save(),
        status: 200
    }
}