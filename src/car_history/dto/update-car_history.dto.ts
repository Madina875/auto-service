import { PartialType } from '@nestjs/mapped-types';
import { CreateCarHistoryDto } from './create-car_history.dto';

export class UpdateCarHistoryDto extends PartialType(CreateCarHistoryDto) {}
