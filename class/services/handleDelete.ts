import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context, req: HttpRequest) => {

    const session = await Class.startSession()
    
    try {
        session.startTransaction()
        const classFound = await Class.findByIdAndDelete(req.params.id)

        await Reservation.deleteMany({ classId: classFound._id })
        session.commitTransaction()
        session.endSession()

        return context.res = {
            body: classFound,
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