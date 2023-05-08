import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.metadata';
import { Role } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.metadata';
import { Article } from './article.schema';
import { ArticleService } from './article.service';
import { ArticleCreateRequest, ArticleUpdateRequest } from './article.types';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);
  constructor(private readonly articleService: ArticleService) {
    this.logger.log('ArticleController');
  }

  @Roles(Role.Admin, Role.User)
  // @Public()
  @Get('')
  async getAllArticles(): Promise<Article[]> {
    this.logger.log('getAllArticles');
    const articles = await this.articleService.getAllArticles();
    this.logger.log('articles: ' + articles);
    return articles;
  }

  @Public()
  @Get(':id')
  async getArticleById(@Param() req: { id: string }) {
    this.logger.log('getArticleById: ' + req.id);
    return await this.articleService.getArticleById(req.id);
  }

  // @Roles(Role.Admin)
  @Post()
  async createArticle(
    @Body() articleCreateRequest: ArticleCreateRequest,
    @Headers() headers: Record<string, string>,
  ): Promise<Article> {
    this.logger.log('createArticle');
    const token = headers.authorization.split(' ')[1];
    this.logger.log('token: ' + token);
    return await this.articleService.createArticle(articleCreateRequest, token);
  }

  // @Roles(Role.Admin)
  @Put(':id')
  async updateArticle(
    @Body() articleUpdateRequest: ArticleUpdateRequest,
    @Headers() headers: Record<string, string>,
  ): Promise<Article> {
    const token = headers.authorization.split(' ')[1];
    return await this.articleService.updateArticle(articleUpdateRequest, token);
  }

  // @Roles(Role.Admin)
  @Delete(':id')
  async deleteArticle(@Body() articleUpdateRequest: ArticleUpdateRequest) {
    return await this.articleService.deleteArticle(articleUpdateRequest);
  }

  // @Roles(Role.Admin)
  @Delete()
  async deleteAllArticles() {
    return await this.articleService.deleteAllArticles();
  }
}
