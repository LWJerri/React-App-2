import { ApiProperty } from "@nestjs/swagger";
import { ResponseListDto } from "./response.dto";

export class ResponseListWithTaskFieldDto extends ResponseListDto {
  @ApiProperty({ example: 1, description: "How many tasks does this list have." })
  readonly task: number;
}
