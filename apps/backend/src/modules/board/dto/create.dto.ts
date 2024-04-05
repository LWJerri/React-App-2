import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { IsNotEmptyString } from "../../../validators/IsNotEmptyString";

export class CreateBoardDto {
  @ApiProperty({ example: "Board #1", description: "Title for the board.", minimum: 3, maximum: 20 })
  @IsNotEmptyString()
  @MinLength(3)
  @MaxLength(20)
  readonly name: string;
}
