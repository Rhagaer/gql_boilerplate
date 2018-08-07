import { request } from "graphql-request";
import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import { duplicateEmail } from "./errorMessage";

let getHost = () => "";

const mutatuon = (email: string, password: string) => `
mutation{
    register(email: "${email}", password: "${password}"){
      path
      message
    }
}
`;

beforeAll(async () => {
  const app = await startServer();
  //@ts-ignore
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

describe("Register User", async () => {
  const email = "bab@gmail.com";
  const password = "123456";

  it("Register User", async () => {
    //make sure registration works
    const response = await request(getHost(), mutatuon(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("Test Duplicate Emails", async () => {
    const response2: any = await request(getHost(), mutatuon(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  //test for bad email
  it("Test For  A Bad Email", async () => {
    const response3: any = await request(
      getHost(),
      mutatuon("bademail", password)
    );
    expect(response3.register).toHaveLength(1);
    expect(response3.register[0].path).toEqual("email");
  });
  
});

// use a test database
// drop all data once tests are over
// should not have to start server seperately
