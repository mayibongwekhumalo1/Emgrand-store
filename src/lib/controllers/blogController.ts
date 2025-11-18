import { NextRequest, NextResponse } from 'next/server';
import Blog from '../models/Blog';
import connectDB from '../database';

// Get all blogs (public)
export const getBlogs = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const published = searchParams.get('published') !== 'false';

    const query: any = {};
    if (published) query.published = true;
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Get single blog (public)
export const getBlog = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const identifier = params.id;
    console.log('getBlog called with identifier:', identifier);

    let blog;
    // Check if identifier is a valid ObjectId (24 hex chars)
    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (objectIdRegex.test(identifier)) {
      console.log('Searching by _id');
      blog = await Blog.findOne({ _id: identifier, published: true });
    } else {
      console.log('Searching by slug');
      blog = await Blog.findOne({ slug: identifier, published: true });
    }

    if (!blog) {
      console.log('Blog not found for identifier:', identifier);
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    console.log('Blog found:', blog.title);
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Create blog (admin only)
export const createBlog = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const { title, content, excerpt, author, tags, category, published, seoTitle, seoDescription, featuredImage } = body;

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ message: 'Blog with this title already exists' }, { status: 400 });
    }

    // Calculate reading time (roughly 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const blogData = {
      title,
      content,
      excerpt,
      author,
      slug,
      tags: tags || [],
      category,
      featuredImage,
      published: published || false,
      publishedAt: published ? new Date() : undefined,
      seoTitle: seoTitle ? seoTitle.substring(0, 60) : undefined,
      seoDescription,
      readingTime
    };

    const blog = new Blog(blogData);
    await blog.save();

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Update blog (admin only)
export const updateBlog = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const body = await request.json();
    const updateData = body;

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== blog.title) {
      const newSlug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: params.id } });
      if (existingBlog) {
        return NextResponse.json({ message: 'Blog with this title already exists' }, { status: 400 });
      }
      updateData.slug = newSlug;
    }

    // Update publishedAt if publishing for the first time
    if (updateData.published && !blog.published) {
      updateData.publishedAt = new Date();
    }

    // Recalculate reading time if content changed
    if (updateData.content) {
      const wordCount = updateData.content.split(/\s+/).length;
      updateData.readingTime = Math.ceil(wordCount / 200);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Delete blog (admin only)
export const deleteBlog = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const blog = await Blog.findByIdAndDelete(params.id);

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Get all blogs for admin (admin only)
export const getAllBlogsAdmin = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Blog.countDocuments();

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs for admin:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Get blog categories
export const getBlogCategories = async (request: NextRequest) => {
  try {
    await connectDB();
    const categories = await Blog.distinct('category', { published: true });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Get blog tags
export const getBlogTags = async (request: NextRequest) => {
  try {
    await connectDB();
    const tags = await Blog.distinct('tags', { published: true });
    return NextResponse.json(tags.flat());
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};