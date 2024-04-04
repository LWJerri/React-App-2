import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function IsAfterNow(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: "IsAfterNow",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (date: Date): boolean => Date.now() < new Date(date)?.getTime(),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          const property = validationArguments?.property ?? "Property";

          return `${property} should be greater than the current date.`;
        },
      },
    });
  };
}
