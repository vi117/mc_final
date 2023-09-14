import AJV from "ajv";

export const ajv = new AJV();
ajv.addFormat("date", (value) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
});
ajv.addFormat("date-time", (value) => {
  return /^\d{4}-[01]\d-[0-3]\d(?:T[0-5]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?)$/.test(
    value,
  );
});
ajv.addFormat("email", (value) => {
  // eslint-disable-next-line no-useless-escape
  return /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/
    .test(value);
});

export default ajv;
