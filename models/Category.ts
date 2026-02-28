import mongoose, { Schema, Model } from 'mongoose';
import { ICategory } from '@/types';

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
    },
    parentId: {
      type: String,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from name if not provided
CategorySchema.pre('save', function (next) {
  if (this.isNew && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

CategorySchema.index({ tenantId: 1, parentId: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

