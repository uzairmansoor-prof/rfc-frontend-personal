import { string } from "yup";
import { ALPHABETIC_CHARACTERS_REGEX, EMAIL_REGEX } from "../utils/regex";
import * as Yup from "yup";
export const EMAIL_VALIDATION_UPDATE = () =>
  string()
    .email("Enter a valid email")
    .required("Email address is required") //"Email address is required!")
    .matches(EMAIL_REGEX.regex, EMAIL_REGEX.message)
    .max(60, "Must be less than 60 characters")
    .test("usernameTest", "Enter a valid email", (value: string) => {
      const sliceIndex = value?.search("@");
      if (sliceIndex > 0) {
        const nameString: string[] = value.slice(0, sliceIndex)?.split("");
        const containAtleastAlphabet = nameString.some(
          (ch) => ch.toLowerCase() != ch.toUpperCase(),
        );

        if (!containAtleastAlphabet) {
          return false;
        }
      }
      return true;
    });

export const requiredAlphabetValidationUpdated = (
  requiredText: string,
  maximumText: string,
  alphabetRegexText: string,
) => {
  return (
    string()
      .required(requiredText)
      //  .required(`${labelText} is required!`)
      .matches(ALPHABETIC_CHARACTERS_REGEX.regex, alphabetRegexText)
      .max(255, maximumText)
      .test(
        `EmptyStringTest`,
        requiredText,
        (value) => value?.trim()?.length > 0,
      )
  );
};

export const generalStringNumberValidation = (
  min: number,
  max: number,
  requireText: string,
  minimumText: string,
  maximumText: string,
  isRequired: boolean = true,
) =>
  isRequired
    ? Yup.string()
        .required(requireText)
        .min(min, minimumText)
        .max(max, maximumText)
    : Yup.string().nullable().min(min, minimumText).max(max, maximumText);

export const generalStringValidation = (
  isRequired = true,
  requireText: string,
  maxText?: string,
) => {
  return isRequired
    ? string().required(requireText).max(255, maxText)
    : string().nullable();
};

export const validationSchema = (
  options: {
    min?: number;
    max?: number;
    isRequired?: boolean;
    minMessage?: string;
    maxMessage?: string;
    requiredMessage?: string;
  } = {},
) => {
  let schema = Yup.number();

  if (options?.isRequired) {
    schema = schema.required(options?.requiredMessage);
  }

  if (options?.min !== undefined) {
    schema = schema.min(options?.min, options?.minMessage);
  }

  if (options?.max !== undefined) {
    schema = schema.max(options?.max, options?.maxMessage);
  }

  return schema;
};
