import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Ensure no duplicate products in wishlist
wishlistSchema.pre('save', function(next) {
  this.products = [...new Set(this.products.map(id => id.toString()))].map(id => new mongoose.Types.ObjectId(id));
  next();
});

// Indexes for better query performance
wishlistSchema.index({ user: 1 }, { unique: true });
wishlistSchema.index({ products: 1 });
wishlistSchema.index({ updatedAt: -1 });

export default mongoose.model<IWishlist>('Wishlist', wishlistSchema);