import { isDateValid } from "../src/client/js/URLValidator";

describe("isDateValid function", () => {
  test("it should return true if the date is valid", () => {
    expect(isDateValid("2020-01-01")).toBeTruthy();
  });
  test("it should return false if the date is valid", () => {
    expect(isDateValid("invalidDate")).toBeFalsy();
  });
});
