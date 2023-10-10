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
  const monthNumbers = []
  const classNumbers: { label: string, data: { total: number, date: moment.Moment }[], type: string }[] = []
  const categories = []
  
  const sportsInYear = await Class.find({
    createdAt: { 
      $gte: moment().subtract(6, 'months').startOf('month')
    }
  }).distinct('sport')

  for(let i = 0; i <= 5; i++){
    await getData(i)
  }

  async function getData(i: number) {
    let month = moment().subtract(i, 'months').format('MM')
    let year = moment().subtract(i, 'months').format('YYYY')
    categories.unshift(moment(`${year}-${month}-01`).format('MMM/YY'))

    Reservation.find({
      date: { $regex: `${month}/${year}`, $options: 'i' }
    }).count().then(count => {
      
    monthNumbers.push(
      { 
        label: moment().subtract(i, 'months').format('MMM/YY'), 
        data: [count], 
        type: 'column',
        date: moment(`${year}-${month}-01`)
      }
    )
    })

    Class.aggregate([
      { $match: {date: { $regex: `${month}/${year}`, $options: 'i' }} },
      { $group: { _id: '$sport', totalPeople: { $sum: { $size: '$peopleList' } } } }
    ]).then(sports => {
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
          numberFound.data.unshift({ total: sportFound.totalPeople, date: moment().subtract(i, 'months').startOf('month') })
        else
          classNumbers.push({
            label: sportFound._id,
            data: [{ total: sportFound.totalPeople, date: moment().subtract(i, 'months').startOf('month') }], 
            type: 'line'
          })
      })
    })
  }

  return {
    monthNumbers: monthNumbers.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1),
    classNumbers: classNumbers,
    categories
  }
}
