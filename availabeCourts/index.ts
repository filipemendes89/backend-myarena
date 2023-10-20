import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import connectMongoose from "../src/connectMongoose"
import handleGet from "./services/handleGet"

const URL_MAP = new Map<string, Function>([
    ['GET', handleGet]
])

connectMongoose()
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const fnc = URL_MAP.get(req.method)
    console.log(`Running: ${req.method} ${fnc.name}`)

    try {
        await fnc(context, req)
        context.res.headers = { 'Content-Type': 'application/json' }
    }catch(error){
        context.res = {
            body: error,
            status: 400
        }
    }   
}

export default httpTrigger;

