import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Calendar } from "../../src/models/CalendarModel"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context, req: HttpRequest) => {

    const session = await Calendar.startSession()
    
    try {
        session.startTransaction()
        const calendarFound = await Calendar.findByIdAndDelete(req.params.id)

        await Reservation.deleteMany({ calendarId: calendarFound._id })
        session.commitTransaction()
        session.endSession()

        return context.res = {
            body: calendarFound,
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