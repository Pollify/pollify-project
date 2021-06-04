import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreatePollDto {
  @ApiProperty({
    description: 'The title of the post.',
    example: 'Example title',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the post.',
    example: 'Example description',
  })
  @IsNotEmpty()
  description: string;

  image: string;

  @ApiProperty({
    type: [String],
    description: 'An array containing possible answers for the poll.',
    example: ['answer one', 'answer two'],
  })
  @ArrayMinSize(2, {
    message: 'Must provide at least two possible answers as: answers: string[]',
  })
  @ArrayMaxSize(4, {
    message: 'Cannot provide more then four possible answers',
  })
  answers: string[];
}
