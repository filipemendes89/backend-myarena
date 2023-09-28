import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Calendar } from "../../src/models/CalendarModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    status: 200
}