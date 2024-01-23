import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

import { AppService, ShortnedUrl } from './app.service';
import { CreateShortUrlDto } from './create-short-url.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    const shortenedUrl = this.appService.getUrlByShort(id);

    if (!shortenedUrl) return res.status(HttpStatus.NOT_FOUND).send();

    return res.redirect(shortenedUrl.url);
  }

  @Get()
  findAll() {
    const urls = this.appService.findAll();

    return urls.sort((a, b) => b.hits - a.hits);
  }

  @Post()
  async create(@Body() createShortUrlDto: CreateShortUrlDto) {
    this.appService.create(createShortUrlDto.url);

    return this.appService.findAll();
  }
}
