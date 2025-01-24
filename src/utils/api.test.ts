import MockAdapter from "axios-mock-adapter";
import api from "./api";
const mock = new MockAdapter(api);

describe("API Module", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should create an axios instance with the correct baseURL and headers", () => {
    expect(api.defaults.baseURL).toBe(
      "https://transaction-dmx4.onrender.com/api"
    );
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("should handle a GET request successfully", async () => {
    const data = { message: "Hello, World!" };
    mock.onGet("/hello").reply(200, data);
    const response = await api.get("/hello");
    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it("should handle a POST request successfully", async () => {
    const requestData = { name: "John Doe" };
    const responseData = { message: "User created" };
    mock.onPost("/users", requestData).reply(201, responseData);
    const response = await api.post("/users", requestData);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(responseData);
  });

  it("should handle a failed request", async () => {
    mock.onGet("/error").reply(500);
    await expect(api.get("/error")).rejects.toThrow(
      "Request failed with status code 500"
    );
  });
});
