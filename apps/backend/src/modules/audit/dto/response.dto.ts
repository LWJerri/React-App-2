import { ApiExtraModels, ApiProperty, IntersectionType, getSchemaPath } from "@nestjs/swagger";
import { Action, Model } from "@prisma/client";
import { ResponseListDto } from "src/modules/list/dto/response.dto";
import { ResponseTaskDto } from "src/modules/task/dto/response.dto";

@ApiExtraModels(ResponseListDto, ResponseTaskDto)
class AuditListAndTaskTypesDto {
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(ResponseListDto) }, { $ref: getSchemaPath(ResponseTaskDto) }],
    description: "The new state of the object.",
  })
  readonly newState: ResponseListDto | ResponseTaskDto;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(ResponseListDto) }, { $ref: getSchemaPath(ResponseTaskDto) }],
    description: "The old state of the object.",
  })
  readonly oldState: ResponseListDto | ResponseTaskDto;
}

class AuditTaskTypeDto {
  @ApiProperty({ type: ResponseTaskDto, description: "The new state of the object." })
  readonly newState: ResponseTaskDto;

  @ApiProperty({ type: ResponseTaskDto, description: "The old state of the object." })
  readonly oldState: ResponseTaskDto;
}

export class BaseResponseAuditDto {
  @ApiProperty({ example: Action.CREATE, enum: Action, description: "What kind of action took place." })
  readonly action: Action;

  @ApiProperty({ example: "clule8xke000008l91yi9d5gt ", description: "Board Id which was affected." })
  boardId: string;

  @ApiProperty({ example: Model.TASK, enum: Model, description: "The model that was acted upon." })
  relatedModel: Model;

  @ApiProperty({ example: "name", description: "What exactly was changed in the record." })
  readonly affectedField: string;

  @ApiProperty({ example: new Date().toISOString(), description: "The date on which the action was performed." })
  readonly createdAt: Date;
}

export class ResponseAuditDto extends IntersectionType(BaseResponseAuditDto, AuditListAndTaskTypesDto) {}
export class ResponseAuditTaskDto extends IntersectionType(BaseResponseAuditDto, AuditTaskTypeDto) {}
