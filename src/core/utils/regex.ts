export const ALPHABETIC_CHARACTERS_REGEX = {
  regex: /^([a-zA-Z ]+|[\u0600-\u06FF\u0750-\u077F\s]+)$/,
  message: "label.ALPHABETIC_CHARACTERS_REGEX",
  //"Must only have Alphabetic characters!",
};

export const EMAIL_REGEX = {
  regex: /^([a-zA-Z0-9_.-]+)@([a-zA-Z]+)([\.])([a-zA-Z]+)/,
  message: "Enter a valid email",
};

export const ALPHABETIC_OR_ALPHA_NUMERIC_CHARACTERS_REGEX = {
  regex: /^([a-zA-Z]+([a-zA-Z0-9]+)*)+(?: [a-zA-Z0-9]+)*$/,
  message: "label.ALPHABETIC_OR_ALPHA_NUMERIC_CHARACTERS_REGEX",
  //"Must only have Alphabetic or Alpha-Numeric characters!",
};
export const PASSWORD_REGEX = {
  regex: /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,10}$/,
  message: "change.PASSWORD_REGEX",
  //"Password should be 8-10 characters, at least one capital letter, one number and one special character!",
};
export const PASSWORD_REGEX_RESET = {
  regex: /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,10}$/,
  message: "reset.PASSWORD_REGEX",
  //"Password should be 8-10 characters, at least one capital letter, one number and one special character!",
};
export const ITEM_NAME_REGEX = {
  regex: /^[a-zA-Z0-9_ ]*$/,
  message: "label.ITEM_NAME_REGEX",
  //"Special Characters are not allowed!",
};

export const DECIMAL_NUMBER_REGEX = {
  regex: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
  message: "label.DECIMAL_NUMBER_REGEX",
  //"Must be a number",
};

export const NUMBER_REGEX = {
  regex: /^[0-9]*$/,
  message: "label.NUMBER_REGEX",
  //"Enter a valid Number!",
};

export const ALPHA_NUMERIC_REGEX = {
  regex: /^[a-zA-Z0-9 ]+(?:[ ]+[a-zA-Z0-9]+)*$/,
  message: "label.ALPHA_NUMERIC_REGEX",
  //"Must be a alpha-numeric!",
};

export const SPECIAL_CHARACTERS_REGEX = {
  regex: /^[!@#$%\^&*)(+=._-]*$/,
  message: "label.SPECIAL_CHARACTERS_REGEX",
  //"Contains special characters!",
};

export const TEXT_INPUT_REGEX = {
  regex: /^(.|\s)*[a-zA-Z]+(.|\s)*$/,
  message: "label.TEXT_INPUT_REGEX",
  //"Should not contain only numbers or only special characters or mix of both them!",
};
