import validator from "validator";

function isDateValid(date) {
  return validator.isDate(date);
}

export { isDateValid };
