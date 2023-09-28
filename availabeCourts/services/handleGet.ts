import { HttpRequest } from "@azure/functions"
import { model } from "mongoose"
import { Context } from "vm"
import { Calendar } from "../../src/models/CalendarModel"
import { Court } from "../../src/models/CourtModel"
import { Reservation } from "../../src/models/ReservationModel"

export default async (context: Context,req: HttpRequest) => { 
    const { page, pageSize, date } = req.query
    

    const modelCourt = model('Court').schema.obj
    
    Object.keys(req.query).forEach((key) => {
        if (!Object.keys(modelCourt).includes(key)){
            delete req.query[key]
        }
    })
    
    const totalCourt = await Court.find(req.query).count()
    const courts = await Court.find(req.query)
    .limit(Number(pageSize) * 1)
    .skip((Number(page) - 1) * Number(pageSize))
    .exec()

    const availabeCourts = await Promise.all(courts.map(async court => {
        
        const courtCalendar = await Calendar.findById(court.calendar)

        const reservationsForCourt = await Reservation.find({
            courtId: court._id,
            date,
            active: true
        })

        const availabeTimes = courtCalendar.times.filter(time => {
            return !reservationsForCourt.some(reservation => {
                return reservation.time === time.entryTime
            })
        }).sort((itemA:any, itemB:any) => Number(new Date(`2023-01-01 ${itemA.entryTime}`)) - Number(new Date(`2023-01-01 ${itemB.entryTime}`)))

        return {
            courtName: court.name,
            hours: availabeTimes,
            avatar: court.avatar,
            courtId: court._id
        }
    }))
    
    return context.res = {
        body: { 
            items : availabeCourts.filter(court => court.hours.length > 0), 
            hasNext: Math.ceil(totalCourt / Number(pageSize)) > Number(page) 
        },
        status: 200
    }
}