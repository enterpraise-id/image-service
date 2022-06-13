import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import * as sharp from 'sharp';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('process')
  async processImage(
    @Payload() { data, filename }: any,
    @Ctx() context: RmqContext,
  ) {
    const image = this.getBase64String(data);
    const result = await this.makeImageFile(filename, image);

    return {
      result,
    };
  }

  private getBase64String(data: string) {
    return data.split(';base64,')[1];
  }

  private async makeImageFile(filename: string, imageString: string) {
    const fileName = filename + '.jpg';
    await sharp(Buffer.from(imageString, 'base64')).webp().toFile(fileName);

    return fileName;
  }
}
