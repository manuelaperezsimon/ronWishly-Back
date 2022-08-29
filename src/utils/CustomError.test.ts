import CustomError from "./CustomError";

describe("Given a Custom Error class", () => {
  describe("When instantiated with a 200, 'Private Message' and 'Message Public", () => {
    test("Then it should created a object with properties status with 200, privateMessage with 'Private Message' and publicMessage with 'Message Public'", () => {
      const statusCodeTest = 200;
      const privateMessageTest = "Private Message";
      const publicMessageTest = "Message Public";

      const newCustomError = new CustomError(
        statusCodeTest,
        privateMessageTest,
        publicMessageTest
      );

      expect(newCustomError).toHaveProperty("statusCode", statusCodeTest);
      expect(newCustomError).toHaveProperty("message", privateMessageTest);
      expect(newCustomError).toHaveProperty("publicMessage", publicMessageTest);
    });
  });
});
