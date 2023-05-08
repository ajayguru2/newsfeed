import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { Article, ArticleDocument } from './article.schema';
import { ArticleCreateRequest, ArticleUpdateRequest } from './article.types';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  constructor(
    @InjectModel('Article')
    private readonly articleModel: Model<ArticleDocument>,
    private readonly usersService: UsersService,
  ) {
    this.logger.log('ArticleService');
  }

  async getAllArticles(): Promise<Article[]> {
    // return all articles
    return this.articleModel.find().exec();
  }

  async createArticle(
    article: ArticleCreateRequest,
    userToken: string,
  ): Promise<ArticleDocument> {
    // create article
    this.logger.log('article: ' + JSON.stringify(article));
    const newArticle = {
      uuid: uuidv4(),
      title: article.title,
      description: article.description,
      body: article.body,
      imageUrl: article.imageUrl,
      createdAt: new Date(),
      createdBy: {
        name: '',
        email: '',
      },
    };

    this.logger.log('newArticle: ' + JSON.stringify(newArticle));

    // get user from token
    const user = await this.usersService.getUserFromToken(userToken);
    this.logger.log('user: ' + JSON.stringify(user));
    if (user) {
      newArticle.createdBy = {
        name: user.name,
        email: user.email,
      };
    }

    // save article
    this.logger.log('newArticle: ' + JSON.stringify(newArticle));
    const createdArticle = new this.articleModel(newArticle);
    return createdArticle.save();
  }

  async updateArticle(
    article: ArticleUpdateRequest,
    userToken: string,
  ): Promise<ArticleDocument> {
    // find article by title
    const articleToUpdate = await this.articleModel.findOne({
      uuid: article.uuid,
    });

    // update article
    if (articleToUpdate) {
      articleToUpdate.title = article.title;
      articleToUpdate.description = article.description;
      articleToUpdate.body = article.body;
      articleToUpdate.imageUrl = article.imageUrl;
      articleToUpdate.updatedAt = new Date();
    }

    // get user from token
    const user = await this.usersService.getUserFromToken(userToken);
    if (user) {
      articleToUpdate.updatedBy = {
        name: user.name,
        email: user.email,
      };
    }

    // save article
    return articleToUpdate.save();
  }

  async deleteArticle(article: ArticleUpdateRequest) {
    // find article by title
    const articleToDelete = await this.articleModel.findOne({
      uuid: article.uuid,
    });
    // delete article
    if (articleToDelete) {
      this.articleModel.deleteOne({ uuid: article.uuid }).exec();
      return {
        message: 'Article deleted successfully',
        code: 200,
      };
    } else {
      return {
        message: 'Article not found',
        code: 404,
      };
    }
  }

  async deleteAllArticles() {
    // delete all articles
    this.articleModel.deleteMany({}).exec();
    return {
      message: 'All articles deleted successfully',
      code: 200,
    };
  }

  getArticleById(id: string) {
    this.logger.log('id: ' + id);
    return this.articleModel.findById(id).exec();
  }
}
