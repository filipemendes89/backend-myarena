import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import mongoose from "mongoose"
import handleGet from "./services/handleGet"
import handlePost from "./services/handlePost"
import handlePut from "./services/handlePut"

const URL_MAP = new Map<string, Function>([
    ['GET', handleGet],
    ['POST', handlePost],
    ['PUT', handlePut]
])

const mongooseConnection = mongoose.connect('mongodb+srv://filipe:nxXegcYyOJljEMzf@cluster0.8ospl.mongodb.net/?retryWrites=true&w=majority');
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const fnc = URL_MAP.get(req.method)
    console.log(`Running: ${req.method} ${fnc.name}`)

    try {
        await fnc(context, req)
        context.res.headers = { 'Content-Type': 'application/json' }
    }catch(error){
        context.res = {
            body: error
        }
    }   
}

export default httpTrigger;

