import { HttpRequest } from "@azure/functions"
import mongoose from "mongoose"
import { Context } from "vm"
import handleGetAvailableCourts from "../availabeCourts/services/handleGet"
import { Calendar } from "../src/models/CalendarModel"
import { Court } from "../src/models/CourtModel"
import { Reservation } from "../src/models/ReservationModel"

describe("handleGetAvailableCourts", () => {
  let context: Context;
  let req: HttpRequest;

  beforeAll(() => {
    const mongooseConnection = mongoose.connect(process.env.MONGOCONN);
  })
  beforeEach(() => {
    context = {} as Context;
    req = {
      query: {},
    } as HttpRequest;
  });

  it("should return available courts with matching query parameters", async () => {
    const courtMock = {
      _id: "court_id",
      name: "Court 1",
      calendar: "calendar_id",
      avatar: "avatar_url",
    };

    const calendarMock = {
      _id: "calendar_id",
      times: [
        { entryTime: "09:00" },
        { entryTime: "10:00" },
        { entryTime: "11:00" },
      ],
    };

    const reservationMock = {
      courtId: "court_id",
      date: "2023-01-01",
      active: true,
      time: "09:00",
    };

    jest.spyOn(Court, "find").mockReturnValueOnce({
      count: jest.fn().mockResolvedValueOnce(1),
      exec: jest.fn().mockResolvedValueOnce([courtMock]),
    } as any);

    jest.spyOn(Calendar, "findById").mockResolvedValueOnce(calendarMock);

    jest.spyOn(Reservation, "find").mockResolvedValueOnce([reservationMock]);

    const result = await handleGetAvailableCourts(context, req);

    expect(result.body.items).toHaveLength(2);
    expect(result.status).toBe(200);
  });
});