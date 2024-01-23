import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
const Crawler = require('crawler');

export type ShortnedUrl = {
  url: string;
  short: string;
  hits: number;
  title?: string;
};
type ShortnedUrlMap = Map<string, ShortnedUrl>;

@Injectable()
export class AppService {
  urls: ShortnedUrlMap = new Map();

  async create(url: string) {
    const short = uuidv4();

    const shortenedUrl = { url, short, hits: 0 };
    this.getUrlTitle(shortenedUrl);

    this.urls.set(short, shortenedUrl);
  }

  findAll() {
    return [...this.urls.values()];
  }

  getUrlByShort(short: string) {
    const shortenedUrl = this.urls.get(short);

    if (shortenedUrl) {
      shortenedUrl.hits++;
    }

    return shortenedUrl;
  }

  crawler = new Crawler({
    maxConnections: 10,
  });

  getUrlTitle(shortnedUrl: ShortnedUrl) {
    this.crawler.queue([
      {
        uri: shortnedUrl.url,
        callback: (error, res, done) => {
          if (error) {
            console.log(error);
          } else {
            shortnedUrl.title = res.$('title').text();
          }
          done();
        },
      },
    ]);
  }
}
