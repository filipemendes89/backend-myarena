import { HttpRequest } from "@azure/functions"
import * as moment from 'moment'
import { Context } from "vm"
import { People } from "../../src/models/PeopleModel"
import { Reservation } from "../../src/models/ReservationModel"
import { Sport } from "../../src/models/SportModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query
    
    return context.res = {
       body : { 
        sportByPeople: await getSportsByPeople(),
        reservationByMonth: await getReservationByMonth()
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

const getReservationByMonth = async () => {
  let month 
  let year 
  const monthNumbers = []
  
  for(let i = 0; i <= 11; i++){
    month = moment().subtract(i, 'months').format('MM')
    year = moment().subtract(i, 'months').format('YYYY')
    let data = [await Reservation.find({
      date: { $regex: `${month}/${year}`, $options: 'i' }
    }).count()]
    
    monthNumbers.push(
      { 
        label: moment().subtract(i, 'months').format('MMM/YY'), 
        data, 
        type: 'column',
        date: moment(`${year}-${month}-01`)
      }
    )
  }

  return monthNumbers.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1)
}