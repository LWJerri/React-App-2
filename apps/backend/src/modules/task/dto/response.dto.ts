import { ApiProperty } from "@nestjs/swagger";
import { Priority } from "@prisma/client";

export class ResponseTaskDto {
  @ApiProperty({ example: "clulj6xtd000f08lc56e6e4bv", description: "Unique Id of the record in the database" })
  readonly id: string;

  @ApiProperty({ example: "My awesome task", description: "Title for the task.", minLength: 3, maxLength: 20 })
  readonly name: string;

  @ApiProperty({
    example: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    description: "Detailed description for the task.",
    minLength: 1,
    maxLength: 3000,
  })
  readonly description: string;

  @ApiProperty({ example: new Date().toISOString(), description: "The time by which the task must be completed." })
  readonly dueAt: Date;

  @ApiProperty({ example: Priority.NORMAL, enum: Priority, description: "Prioritization of task performance." })
  readonly priority: Priority;

  @ApiProperty({ example: new Date().toISOString(), description: "Date the task was created." })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date().toISOString(), description: "Date the task was updated." })
  readonly updatedAt: Date;

  @ApiProperty({
    example: "clulj77yr000g08lc8nql2i95",
    description: "The unique Id of the list to which the task is bound.",
  })
  readonly boardId: string;

  @ApiProperty({
    example: "clulj7bal000h08lchj1x5hkb",
    description: "The unique Id of the list to which the task is bound.",
  })
  readonly listId: string;
}
