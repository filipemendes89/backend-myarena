import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Court } from "../../src/models/CourtModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await Court.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    status: 200
}