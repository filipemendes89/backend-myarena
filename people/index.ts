import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import mongoose from "mongoose"
import { People } from "../src/models/PeopleModel"

const handleGet = async (context: Context,req: HttpRequest) => context.res = {
    body: await People.find(req.params),
    status: 200
}

const handlePost = async (context: Context,req: HttpRequest) => context.res = {
    body: await new People(req.body).save(),
    status: 200
}

const URL_MAP = new Map<string, Function>([
    ['GET', handleGet],
    ['POST', handlePost]
])

const mongooseConnection = mongoose.connect('mongodb+srv://filipe:nxXegcYyOJljEMzf@cluster0.8ospl.mongodb.net/?retryWrites=true&w=majority');
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const fnc = URL_MAP.get(req.method)
    console.log(`Running: ${req.method} ${fnc.name}`)
    await fnc(context, req)
    console.log(JSON.stringify(context.res))
};

export default httpTrigger;

