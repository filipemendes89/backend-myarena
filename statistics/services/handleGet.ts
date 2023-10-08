import { HttpRequest } from "@azure/functions"
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"
import { Sport } from "../../src/models/SportModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize, date } = req.query
    
    return context.res = {
       body : { 
        sportByPeople: await getSportsByPeople()
      }
    }
}

const getSportsByPeople = async () => {
  const sportResults = await Sport.find()
  
  const sportByPeople = []
  for await(const sport of sportResults){
    const result = await People.find({ sports: sport.name }).count()
    sportByPeople.push({
      label: sport.name,
      data: result,
      tooltip: sport.name
    })
  }

  return sportByPeople

}