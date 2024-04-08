import { ValidationArguments, ValidationOptions, isNotEmpty, isString, registerDecorator } from "class-validator";

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: "IsNotEmptyString",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown): boolean => isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          const property = validationArguments?.property ?? "Property";

          return `${property} should not be an empty string.`;
        },
      },
    });
  };
}
