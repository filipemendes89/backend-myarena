import { HttpRequest } from "@azure/functions"
import * as moment from 'moment'
import { Context } from "vm"
import { Class } from "../../src/models/ClassModel"
import { People } from "../../src/models/PeopleModel"
import { Reservation } from "../../src/models/ReservationModel"
import { Sport } from "../../src/models/SportModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize } = req.query

    const dataByDate = await getReservationByMonth()
    return context.res = {
       body : { 
        sportByPeople: await getSportsByPeople(),
        reservationByMonth: dataByDate.monthNumbers,
        getMembersInClass: dataByDate.classNumbers,
        categories: dataByDate.categories
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
  const classNumbers = []
  const categories = []
  
  const sportsInYear = await Class.find({
    createdAt: { 
      $gte: moment().subtract(6, 'months').startOf('month')
    }
  }).distinct('sport')

  for(let i = 0; i <= 5; i++){
    month = moment().subtract(i, 'months').format('MM')
    year = moment().subtract(i, 'months').format('YYYY')
    categories.unshift(moment(`${year}-${month}-01`).format('MMM/YY'))

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

    const sports = await Class.aggregate([
      { $match: {date: { $regex: `${month}/${year}`, $options: 'i' }} },
      { $group: { _id: '$sport', totalPeople: { $sum: { $size: '$peopleList' } } } }
    ])

    const sportsComplete = sportsInYear.map(sport => {
      const sportFound = sports.find(sportFound => sportFound._id === sport)
      if(sportFound)
        return sportFound
      return {
        _id: sport,
        totalPeople: 0
      }
    })
    sportsComplete.map(sportFound => {
      const numberFound = classNumbers.find(sport => sport.label === sportFound._id)
      if(numberFound)
        numberFound.data.unshift(sportFound.totalPeople)
      else
        classNumbers.push({
          label: sportFound._id,
          data: [sportFound.totalPeople],
          type: 'line',
          date: moment(`${year}-${month}-01`)
        })
    })
  }

  return {
    monthNumbers: monthNumbers.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1),
    classNumbers: classNumbers.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1),
    categories
  }
}
