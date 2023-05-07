import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Post,
} from '@nestjs/common';
import { Role } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.metadata';
import { Article } from './article.schema';
import { ArticleService } from './article.service';
import { ArticleCreateRequest, ArticleUpdateRequest } from './article.types';

@Controller('article')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);
  constructor(private readonly articleService: ArticleService) {
    this.logger.log('ArticleController');
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  async getAllArticles(): Promise<Article[]> {
    return await this.articleService.getAllArticles();
  }

  @Roles(Role.Admin)
  @Post()
  async createArticle(
    @Body() articleCreateRequest: ArticleCreateRequest,
    @Headers() headers: Record<string, string>,
  ): Promise<Article> {
    const token = headers.authorization.split(' ')[1];
    return await this.articleService.createArticle(articleCreateRequest, token);
  }

  @Roles(Role.Admin)
  @Post(':id')
  async updateArticle(
    @Body() articleUpdateRequest: ArticleUpdateRequest,
    @Headers() headers: Record<string, string>,
  ): Promise<Article> {
    const token = headers.authorization.split(' ')[1];
    return await this.articleService.updateArticle(articleUpdateRequest, token);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteArticle(@Body() articleUpdateRequest: ArticleUpdateRequest) {
    return await this.articleService.deleteArticle(articleUpdateRequest);
  }

  @Roles(Role.Admin)
  @Delete()
  async deleteAllArticles() {
    return await this.articleService.deleteAllArticles();
  }
}
