import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"

export default async (context: Context, req: HttpRequest) => {
    return context.res = {
        body: await Class.findByIdAndDelete(req.params.id),
        status: 200
    }
}