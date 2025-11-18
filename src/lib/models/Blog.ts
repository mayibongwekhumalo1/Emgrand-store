import mongoose, { Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  slug: string;
  tags: string[];
  category: string;
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
}

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxLength: 300
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  featuredImage: {
    type: String,
    trim: true
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  seoTitle: {
    type: String,
    maxLength: 60
  },
  seoDescription: {
    type: String,
    maxLength: 160
  },
  readingTime: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Create indexes for better performance
blogSchema.index({ published: 1, publishedAt: -1 });
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Prevent model overwrite in development
export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);