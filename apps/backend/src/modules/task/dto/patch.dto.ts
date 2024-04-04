import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CreateTaskDto } from "./create.dto";

export class PatchTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: "clulj6jrz000e08lc13qofuyj",
    description: "The new Id of the list where the task will be moved to.",
  })
  @IsOptional()
  @IsString()
  readonly listId: string;
}
