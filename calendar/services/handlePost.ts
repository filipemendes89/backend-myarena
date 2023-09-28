import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Calendar } from "../../src/models/CalendarModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await new Calendar(req.body).save(),
    status: 200
}