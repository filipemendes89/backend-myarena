import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Court } from "../../src/models/CourtModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await new Court(req.body).save(),
    status: 200
}