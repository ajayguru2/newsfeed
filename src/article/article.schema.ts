import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  uuid: string;
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: Object })
  body: any;
  @Prop()
  imageUrl?: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt?: Date;
  @Prop({
    type: {
      name: String,
      email: String,
    },
    required: true,
  })
  createdBy: {
    name: string;
    email: string;
  };
  @Prop({
    type: {
      name: String,
      email: String,
    },
    required: false,
  })
  updatedBy?: {
    name: string;
    email: string;
  };
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
