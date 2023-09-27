import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await new People(req.body).save(),
    status: 200
}