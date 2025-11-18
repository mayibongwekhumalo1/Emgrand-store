import { NextRequest, NextResponse } from 'next/server';
import Product from '../models/Product';
import Review from '../models/Review';
import { cloudinary } from '../utils/cloudinary';
import connectDB from '../database';

export const getProducts = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';

    // Build filter object
    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sortOption: any = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getProduct = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const product = await Product.findById(params.id);

    if (!product || !product.isActive) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Get reviews for this product
    const reviews = await Review.find({ product: params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      product,
      reviews
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const createProduct = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const productData = {
      ...body,
      images: body.images,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const product = new Product(productData);
    await product.save();

    return NextResponse.json({
      message: 'Product created successfully',
      product
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const updateProduct = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const deleteProduct = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getFeaturedProducts = async (request: NextRequest) => {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('-__v');

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const searchProducts = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(
      {
        isActive: true,
        $text: { $search: q as string }
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Product.countDocuments({
      isActive: true,
      $text: { $search: q as string }
    });

    return NextResponse.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};