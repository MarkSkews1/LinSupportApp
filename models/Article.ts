import mongoose, { Schema, Document, Model } from 'mongoose';
import { ArticleStatus } from '@/types';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: ArticleStatus;
  categoryId?: string;
  tags?: string[];
  authorId: string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: { type: String, required: true },
    status: { type: String, enum: Object.values(ArticleStatus), default: ArticleStatus.DRAFT },
    categoryId: String,
    tags: [String],
    authorId: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article: Model<IArticle> =
  (mongoose.models.Article as Model<IArticle>) || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;

