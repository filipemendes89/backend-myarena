import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await People.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    status: 200
}