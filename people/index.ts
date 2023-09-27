import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import mongoose from "mongoose"
import { People } from "../src/models/PeopleModel"


const mongooseConnection = mongoose.connect('mongodb+srv://filipe:nxXegcYyOJljEMzf@cluster0.8ospl.mongodb.net/?retryWrites=true&w=majority');
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const people = await new People(req.body).save()
    
    context.res = {
        body: people,
        status: 200
    }

};

export default httpTrigger;