import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isUserNameValid', async: false })
export class IsUserNameValid implements ValidatorConstraintInterface {
  validate(userName: string, args: ValidationArguments) {
    // Custom validation logic (e.g., check if the username contains only letters and numbers)
    return /^[a-zA-Z0-9]+$/.test(userName);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Username ($value) is not valid. It should contain only letters and numbers.';
  }
}