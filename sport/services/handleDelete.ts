import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { Sport } from "../../src/models/SportModel"

export default async (context: Context, req: HttpRequest) => {
    return context.res = {
        body: await Sport.findByIdAndDelete(req.params.id),
        status: 200
    }
}