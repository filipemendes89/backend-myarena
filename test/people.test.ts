import mongoose from "mongoose"
import handleGet from "../people/services/handleGet"
import handlePost from "../people/services/handlePost"
import handlePut from "../people/services/handlePut"
import { People } from "../src/models/PeopleModel"

jest.setTimeout(60000)
describe("Testes de pessoas", () => {
  let context;
  let req;

  beforeAll(() => {
    const mongooseConnection = mongoose.connect(process.env.MONGOCONN);
  })

  beforeEach(() => {
    context = {} ;
    req = {
        params: {},
        query: {}
    };
    jest.resetAllMocks()
  });

  it("should return filtered people when filter is provided", async () => {
    req.query = {
      filter: "37799219874",
      page: "1",
      pageSize: "10"
    };

    const result = await handleGet(context, req);

    // Assert that the expected response is returned
    expect(context.res.body.items).toHaveLength(1)
  });

  it("should return a specific person when id is provided", async () => {
    req.params = {
      id: "65170fa9bfdaf8608a2b5d45"
    };

    const result = await handleGet(context, req);

    // Assert that the expected response is returned
    expect(context.res.body._id.toString()).toEqual('65170fa9bfdaf8608a2b5d45');
  });

  it("should return a person by email when email is provided", async () => {
    req.query = {
      email: "filipemendes89@hotmail.com"
    };

    const result = await handleGet(context, req);

    // Assert that the expected response is returned
    expect(context.res.body.email).toEqual("filipemendes89@hotmail.com");
  });

  it("should return paginated list of people when no filter, id, or email is provided", async () => {
    req.query = {
      page: "1",
      pageSize: "10"
    };

    const result = await handleGet(context, req);

    // Assert that the expected response is returned
    expect(context.res.body.items.length).toBeGreaterThan(1);
  });

  it("should save a new person and return a 200 status", async () => {
    // Mock the request body
    const requestBody = {
      test: 'teste'
    };

    req.body = requestBody;

    // Spy on the People model's save method
    const saveSpy = jest.spyOn(People.prototype, "save").mockImplementationOnce((data) => {
      return Promise.resolve();
    });

    const result = await handlePost(context, req);

    // Assert that the save method is called with the correct arguments
    expect(saveSpy).toHaveBeenCalled();

    // Assert that the expected response is returned
    expect(context.res.status).toEqual(200);
  });

  it("should save a person and return a 200 status", async () => {
    // Mock the request body
    const requestBody = {
      test: 'teste'
    };

    req.body = requestBody;

    // Spy on the People model's save method
    const putSpy = jest.spyOn(People, "findByIdAndUpdate").mockImplementationOnce(() => {
      return <any>Promise.resolve();
    });

    const result = await handlePut(context, req);

    // Assert that the save method is called with the correct arguments
    expect(putSpy).toHaveBeenCalled();

    // Assert that the expected response is returned
    expect(context.res.status).toEqual(200);
  });
});