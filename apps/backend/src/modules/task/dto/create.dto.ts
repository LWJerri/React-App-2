import { ApiProperty } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import { IsDateString, IsEnum, MaxLength, MinLength } from "class-validator";
import { IsAfterNow } from "src/validators/IsAfterNow";
import { IsNotEmptyString } from "src/validators/IsNotEmptyString";

export class CreateTaskDto {
  @ApiProperty({ example: "My awesome task 💖", description: "Title for the task.", minimum: 3, maximum: 20 })
  @IsNotEmptyString()
  @MinLength(3)
  @MaxLength(20)
  readonly name: string;

  @ApiProperty({
    example: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    description: "Detailed description for the task.",
    minimum: 1,
    maximum: 3000,
  })
  @IsNotEmptyString()
  @MinLength(1)
  @MaxLength(3000)
  readonly description: string;

  @ApiProperty({ example: new Date().toISOString(), description: "The time by which the task must be completed." })
  @IsDateString()
  @IsAfterNow()
  readonly dueAt: string;

  @ApiProperty({ example: Priority.NORMAL, enum: Priority, description: "Prioritization of task performance." })
  @IsEnum(Priority)
  readonly priority: Priority;
}
