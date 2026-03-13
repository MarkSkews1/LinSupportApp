import connectDB from '@/lib/db/mongodb';
import Article, { IArticle } from '@/models/Article';
import { ArticleStatus } from '@/types';

export interface ArticleListParams {
  tenantId?: string;
  status?: ArticleStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export class ArticleService {
  static async list(params: ArticleListParams = {}): Promise<IArticle[]> {
    await connectDB();
    const { status, search, page = 1, limit = 20 } = params;
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { excerpt: new RegExp(search, 'i') }];
    return Article.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getById(id: string): Promise<IArticle | null> {
    await connectDB();
    return Article.findById(id).lean();
  }

  static async getBySlug(slug: string): Promise<IArticle | null> {
    await connectDB();
    const article = await Article.findOne({ slug });
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1;
      await article.save();
    }
    return article;
  }

  static async getPopular(limit = 5): Promise<IArticle[]> {
    await connectDB();
    return Article.find({ status: ArticleStatus.PUBLISHED })
      .sort({ viewCount: -1 })
      .limit(limit)
      .lean();
  }

  static async create(data: Partial<IArticle>): Promise<IArticle> {
    await connectDB();
    return Article.create(data);
  }

  static async update(id: string, data: Partial<IArticle>): Promise<IArticle | null> {
    await connectDB();
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string): Promise<void> {
    await connectDB();
    await Article.findByIdAndDelete(id);
  }

  static async markHelpful(id: string): Promise<void> {
    await connectDB();
    await Article.findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } });
  }

  static async markNotHelpful(id: string): Promise<void> {
    await connectDB();
    await Article.findByIdAndUpdate(id, { $inc: { notHelpfulCount: 1 } });
  }
}

