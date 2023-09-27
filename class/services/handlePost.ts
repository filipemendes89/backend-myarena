import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"

export default async (context: Context,req: HttpRequest) => context.res = {
    body: await new Class(req.body).save(),
    status: 200
}