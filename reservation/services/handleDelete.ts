import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context, req: HttpRequest) => {
    return context.res = {
        body: await Reservation.findByIdAndDelete(req.params.id),
        status: 200
    }
}