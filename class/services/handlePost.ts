import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context,req: HttpRequest) => {
    
    const session = await Class.startSession()
    try {
        session.startTransaction()

        const createdClass = await new Class(req.body).save()
        const { courtId, time, date, _id: classId} = createdClass
    
        const reservation = {
            courtId,
            time,
            classId,
            date,
            active: true
        }
    
        await new Reservation(reservation).save()
        
        session.commitTransaction()
        session.endSession()
    
        return context.res = {
            body: createdClass,
            status: 200
        }    
    }catch(error){
        session.abortTransaction()
        return context.res = {
            body: error,
            status: 400
        }
    }
    
}