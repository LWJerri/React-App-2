import { ApiProperty } from "@nestjs/swagger";

export class ResponseListDto {
  @ApiProperty({ example: "clulf5uxj000008jwhq3g1x6m", description: "A unique id in the database." })
  readonly id: string;

  @ApiProperty({ example: "Triage", description: "Title for the list.", minLength: 3, maxLength: 20 })
  readonly name: string;

  @ApiProperty({ example: new Date().toISOString(), description: "Date the list was created." })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date().toISOString(), description: "Date the list was updated." })
  readonly updatedAt: Date;

  @ApiProperty({
    example: "clulf690q000108jw8ezqf3rf",
    description: "The id of the board to which the list is attached.",
  })
  boardId: string;

  @ApiProperty({ example: false, description: "Whether this list has been deleted within the board." })
  isDeleted: boolean;
}
