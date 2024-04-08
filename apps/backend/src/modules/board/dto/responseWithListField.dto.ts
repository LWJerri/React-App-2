import { ApiProperty } from "@nestjs/swagger";
import { ResponseBoardDto } from "./responseBoards.dto";

export class ResponseBoardWithListFieldDto extends ResponseBoardDto {
  @ApiProperty({ example: 1, description: "How many lists does the board contain." })
  readonly list: number;
}
