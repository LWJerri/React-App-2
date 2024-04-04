import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { IsNotEmptyString } from "src/validators/IsNotEmptyString";

export class CreateListDto {
  @ApiProperty({ example: "Triage", description: "Title for the list.", minimum: 3, maximum: 20 })
  @IsNotEmptyString()
  @MinLength(3)
  @MaxLength(20)
  readonly name: string;
}
