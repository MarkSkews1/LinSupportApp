import Article from '@/models/Article';
import Category from '@/models/Category';
import connectDB from '@/lib/db/mongodb';
import { ArticleStatus } from '@/types';

export interface CreateArticleParams {
  title: string;
  excerpt: string;
  content: string;
  categoryId?: string;
  tags?: string[];
  status?: ArticleStatus;
  createdBy: string;
  createdByName: string;
  tenantId: string;
}

export interface UpdateArticleParams {
  title?: string;
  excerpt?: string;
  content?: string;
  categoryId?: string;
  tags?: string[];
  status?: ArticleStatus;
}

export interface SearchArticlesParams {
  tenantId: string;
  query?: string;
  categoryId?: string;
  status?: ArticleStatus;
  tags?: string[];
  limit?: number;
  skip?: number;
}

export class ArticleService {
  /**
   * Create a new article
   */
  static async createArticle(params: CreateArticleParams) {
    await connectDB();

    // Generate slug from title
    const slug = params.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists for this tenant
    const existingArticle = await Article.findOne({
      slug,
      tenantId: params.tenantId,
    });

    let finalSlug = slug;
    if (existingArticle) {
      // Append timestamp to make unique
      finalSlug = `${slug}-${Date.now()}`;
    }

    const article = await Article.create({
      ...params,
      slug: finalSlug,
      status: params.status || ArticleStatus.DRAFT,
    });

    return article;
  }

  /**
   * Get article by ID
   */
  static async getArticle(articleId: string, tenantId: string) {
    await connectDB();

    const article = await Article.findOne({
      _id: articleId,
      tenantId,
    });

    return article;
  }

  /**
   * Get article by slug (for public viewing)
   */
  static async getArticleBySlug(slug: string, tenantId: string) {
    await connectDB();

    const article = await Article.findOne({
      slug,
      tenantId,
      status: ArticleStatus.PUBLISHED,
    });

    if (article) {
      // Increment view count
      article.viewCount = (article.viewCount || 0) + 1;
      await article.save();
    }

    return article;
  }

  /**
   * Update article
   */
  static async updateArticle(
    articleId: string,
    tenantId: string,
    updates: UpdateArticleParams
  ) {
    await connectDB();

    const article = await Article.findOne({
      _id: articleId,
      tenantId,
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // Update fields
    if (updates.title !== undefined) article.title = updates.title;
    if (updates.excerpt !== undefined) article.excerpt = updates.excerpt;
    if (updates.content !== undefined) article.content = updates.content;
    if (updates.categoryId !== undefined) article.categoryId = updates.categoryId;
    if (updates.tags !== undefined) article.tags = updates.tags;
    if (updates.status !== undefined) article.status = updates.status;

    await article.save();

    return article;
  }

  /**
   * Delete article
   */
  static async deleteArticle(articleId: string, tenantId: string) {
    await connectDB();

    const result = await Article.deleteOne({
      _id: articleId,
      tenantId,
    });

    return result.deletedCount > 0;
  }

  /**
   * Search articles
   */
  static async searchArticles(params: SearchArticlesParams) {
    await connectDB();

    const query: Record<string, unknown> = {
      tenantId: params.tenantId,
    };

    // Filter by status
    if (params.status) {
      query.status = params.status;
    }

    // Filter by category
    if (params.categoryId) {
      query.categoryId = params.categoryId;
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      query.tags = { $in: params.tags };
    }

    // Text search
    if (params.query) {
      query.$text = { $search: params.query };
    }

    const limit = params.limit || 20;
    const skip = params.skip || 0;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(params.query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(query),
    ]);

    return {
      articles,
      total,
      hasMore: skip + articles.length < total,
    };
  }

  /**
   * Get articles by category
   */
  static async getArticlesByCategory(categoryId: string, tenantId: string) {
    await connectDB();

    const articles = await Article.find({
      categoryId,
      tenantId,
      status: ArticleStatus.PUBLISHED,
    }).sort({ createdAt: -1 });

    return articles;
  }

  /**
   * Get popular articles
   */
  static async getPopularArticles(tenantId: string, limit = 10) {
    await connectDB();

    const articles = await Article.find({
      tenantId,
      status: ArticleStatus.PUBLISHED,
    })
      .sort({ viewCount: -1 })
      .limit(limit);

    return articles;
  }

  /**
   * Mark article as helpful
   */
  static async markHelpful(articleId: string, tenantId: string) {
    await connectDB();

    const article = await Article.findOne({
      _id: articleId,
      tenantId,
    });

    if (!article) {
      throw new Error('Article not found');
    }

    article.helpfulCount = (article.helpfulCount || 0) + 1;
    await article.save();

    return article;
  }

  /**
   * Mark article as not helpful
   */
  static async markNotHelpful(articleId: string, tenantId: string) {
    await connectDB();

    const article = await Article.findOne({
      _id: articleId,
      tenantId,
    });

    if (!article) {
      throw new Error('Article not found');
    }

    article.notHelpfulCount = (article.notHelpfulCount || 0) + 1;
    await article.save();

    return article;
  }

  /**
   * Get all tags used in articles
   */
  static async getAllTags(tenantId: string) {
    await connectDB();

    const articles = await Article.find({
      tenantId,
      status: ArticleStatus.PUBLISHED,
    }).select('tags');

    // Aggregate all tags
    const tagsSet = new Set<string>();
    articles.forEach(article => {
      article.tags?.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }
}

