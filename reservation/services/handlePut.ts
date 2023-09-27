import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    status: 200
}