import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  uuid: string;
  @Prop({ required: true, unique: true })
  title: string;
  description: string;
  body: any;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: {
    name: string;
    email: string;
  };
  updatedBy?: {
    name: string;
    email: string;
  };
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
