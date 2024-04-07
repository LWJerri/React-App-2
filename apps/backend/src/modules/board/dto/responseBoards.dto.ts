import { ApiProperty } from "@nestjs/swagger";

export class ResponseBoardDto {
  @ApiProperty({ example: "cluld4viq000008jv05sdhd54", description: "A unique id in the database." })
  readonly id: string;

  @ApiProperty({ example: "Board #1", description: "Title for the board.", minLength: 3, maxLength: 20 })
  readonly name: string;

  @ApiProperty({ example: new Date().toISOString(), description: "Date the board was created." })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date().toISOString(), description: "Date of board update." })
  readonly updatedAt: Date;
}
