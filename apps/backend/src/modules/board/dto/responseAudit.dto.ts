import { ApiExtraModels, ApiProperty, IntersectionType, getSchemaPath } from "@nestjs/swagger";
import { Action, Model } from "@prisma/client";
import { ResponseListDto } from "../../../modules/list/dto/response.dto";
import { ResponseTaskDto } from "../../../modules/task/dto/response.dto";

@ApiExtraModels(ResponseListDto, ResponseTaskDto)
class AuditListAndTaskTypesDto {
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(ResponseListDto) }, { $ref: getSchemaPath(ResponseTaskDto) }],
    description: "The state of the object after the update.",
  })
  readonly newState: ResponseListDto | ResponseTaskDto;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(ResponseListDto) }, { $ref: getSchemaPath(ResponseTaskDto) }],
    description: "The state of the object before the update.",
  })
  readonly oldState: ResponseListDto | ResponseTaskDto;
}

class AuditTaskTypeDto {
  @ApiProperty({ type: ResponseTaskDto, description: "The state of the object after the update." })
  readonly newState: ResponseTaskDto;

  @ApiProperty({ type: ResponseTaskDto, description: "The state of the object before the update." })
  readonly oldState: ResponseTaskDto;
}

export class BaseResponseAuditDto {
  @ApiProperty({ example: Action.CREATE, enum: Action, description: "What kind of action took place." })
  readonly action: Action;

  @ApiProperty({
    example: "clule8xke000008l91yi9d5gt ",
    description: "The id of the board in which the change occurred.",
  })
  boardId: string;

  @ApiProperty({ example: Model.TASK, enum: Model, description: "The type of model in which the change occurred." })
  relatedModel: Model;

  @ApiProperty({
    example: "clun97g8j000008kz2upaf5te",
    description: "The unique id of the record in which the update occurred.",
  })
  relatedId: string;

  @ApiProperty({ example: "name", description: "What field in the record was affected." })
  readonly affectedField: string;

  @ApiProperty({ example: new Date().toISOString(), description: "The date on which the action was recorded." })
  readonly createdAt: Date;
}

export class ResponseBoardAuditDto extends IntersectionType(BaseResponseAuditDto, AuditListAndTaskTypesDto) {}
export class ResponseBoardAuditTaskDto extends IntersectionType(BaseResponseAuditDto, AuditTaskTypeDto) {}
