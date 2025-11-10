'use client';

import { useState } from 'react';
import { Product, ProductCategory, ProductCondition } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ProductImageManager from '@/components/ProductImageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePresets } from '@/lib/cloudinary-transform';

interface ProductManagementProps {
  products: Product[];
  onUpdate: () => void;
}

const categories: ProductCategory[] = ['laptops', 'desktops', 'accessories', 'printers', 'cctv'];
const conditions: ProductCondition[] = ['new', 'refurbished'];

export default function ProductManagement({ products, onUpdate }: ProductManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'laptops',
    condition: 'new',
    image: '',
    stock: 0,
    featured: false,
    specifications: [],
  });
  const [specInput, setSpecInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'laptops',
      condition: 'new',
      image: '',
      stock: 0,
      featured: false,
      specifications: [],
    });
    setImagePreview('');
    setImageFile(null);
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const specs = typeof product.specifications === 'string' 
      ? JSON.parse(product.specifications) 
      : Array.isArray(product.specifications) 
      ? product.specifications 
      : [];
    
    setFormData({
      ...product,
      specifications: specs
    });
    setImagePreview(product.image);
    setImageFile(null);
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count (max 3 images)
    if (files.length > 3) {
      toast.error('You can upload a maximum of 3 images');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    const validFiles: File[] = [];
    const previews: string[] = [];

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image`);
        continue;
      }

      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }

    setImageFiles(validFiles);
  };

  const removeImagePreview = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');
    formData.append('compress', 'true'); // Enable compression

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.data.secure_url;
  };

  // New function to upload and return full image metadata
  const uploadImageWithMetadata = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');
    formData.append('compress', 'true');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return {
      url: data.data.secure_url,
      publicId: data.data.public_id,
      width: data.data.width,
      height: data.data.height,
      format: data.data.format,
    };
  };

  const handleAddSpec = () => {
    if (specInput.trim()) {
      setFormData({
        ...formData,
        specifications: [...(formData.specifications || []), specInput.trim()],
      });
      setSpecInput('');
    }
  };

  const handleRemoveSpec = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let imageUrl = formData.image || '';

      // Upload new image to Cloudinary if selected (for editing)
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
          toast.success('Image uploaded successfully');
        } catch (error) {
          console.error('Image upload failed:', error);
          toast.error('Image upload failed. Please try again.');
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            condition: formData.condition,
            image: imageUrl,
            stock: formData.stock,
            featured: formData.featured,
            specifications: formData.specifications,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        
        toast.success('Product updated successfully');
      } else {
        // Handle multiple images for new product
        if (imageFiles.length === 0) {
          toast.error('Please upload at least one image');
          setSaving(false);
          return;
        }

        setUploading(true);
        
        // Upload all images to Cloudinary with metadata
        const uploadedImages = [];
        for (let i = 0; i < imageFiles.length; i++) {
          try {
            const imageData = await uploadImageWithMetadata(imageFiles[i]);
            uploadedImages.push(imageData);
            toast.success(`Image ${i + 1}/${imageFiles.length} uploaded`);
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error);
            toast.error(`Failed to upload image ${i + 1}`);
            setSaving(false);
            setUploading(false);
            return;
          }
        }

        setUploading(false);

        // Create product with first image as primary
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            condition: formData.condition,
            image: uploadedImages[0].url, // First image as primary
            stock: formData.stock,
            featured: formData.featured,
            specifications: formData.specifications,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }

        const newProduct = await response.json();
        const productId = newProduct.id;

        // Add all images to product_images table with full metadata
        if (productId) {
          const token = localStorage.getItem('bearer_token');
          
          for (let i = 0; i < uploadedImages.length; i++) {
            const imageData = uploadedImages[i];
            
            try {
              await fetch(`/api/products/${productId}/images`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  imageUrl: imageData.url,
                  publicId: imageData.publicId,
                  width: imageData.width,
                  height: imageData.height,
                  format: imageData.format,
                  displayOrder: i,
                  isPrimary: i === 0,
                }),
              });
            } catch (error) {
              console.error(`Failed to save image ${i + 1} to database:`, error);
            }
          }
        }
        
        toast.success(`Product created with ${uploadedImages.length} image(s)`);
      }
      
      setIsModalOpen(false);
      setImageFile(null);
      setImageFiles([]);
      setImagePreviews([]);
      onUpdate();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Get primary image or first image from gallery
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find(img => img.isPrimary);
      return primary?.imageUrl || product.images[0].imageUrl;
    }
    return product.image;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Product Management</CardTitle>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first product
            </p>
            <Button onClick={handleAdd}>Add Product</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const productImage = getProductImage(product);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                      {productImage ? (
                        <Image
                          src={ImagePresets.productCard(productImage)}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {product.images && product.images.length > 0 && (
                          <Badge className="bg-purple-500 text-white gap-1">
                            <ImagePlus className="w-3 h-3" />
                            {product.images.length}
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge className="bg-blue-500 text-white">Featured</Badge>
                        )}
                        <Badge className={product.condition === 'new' ? 'bg-green-500' : 'bg-orange-500'}>
                          {product.condition}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-blue-600">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <Badge variant="outline">Stock: {product.stock}</Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="flex-1 gap-2"
                        disabled={deleting}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                        className="flex-1 gap-2 text-destructive hover:text-destructive"
                        disabled={deleting}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          {editingProduct ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload with Cloudinary */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary Product Image</label>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                          disabled={uploading || saving}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer block">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {imageFile ? imageFile.name : 'Click to upload product image'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF up to 5MB · Auto-compressed
                          </p>
                        </label>
                      </div>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                            setFormData({ ...formData, image: '' });
                          }}
                          className="w-full"
                        >
                          Clear Image
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Dell XPS 15"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                      <Input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Stock</label>
                      <Input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Category and Condition */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Condition</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value as ProductCondition })}
                      >
                        {conditions.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond.charAt(0).toUpperCase() + cond.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Mark as Featured
                    </label>
                  </div>

                  {/* Specifications */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Specifications</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={specInput}
                        onChange={(e) => setSpecInput(e.target.value)}
                        placeholder="Add a specification..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                      />
                      <Button type="button" onClick={handleAddSpec}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.specifications?.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {spec}
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(index)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1" disabled={saving || uploading}>
                      {uploading ? 'Uploading Image...' : saving ? 'Saving...' : 'Update Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      disabled={saving || uploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="gallery" className="mt-4">
                <ProductImageManager
                  productId={editingProduct.id as number}
                  images={editingProduct.images || []}
                  onImagesChange={onUpdate}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Multiple Product Images */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Product Images <span className="text-muted-foreground">(Upload 2-3 images)</span>
                </label>
                <div className="space-y-4">
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 bg-blue-500 text-white text-xs">
                              Primary
                            </Badge>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeImagePreview(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageChange}
                      className="hidden"
                      id="image-upload-multiple"
                      disabled={uploading || saving}
                    />
                    <label htmlFor="image-upload-multiple" className="cursor-pointer block">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {imageFiles.length > 0 
                          ? `${imageFiles.length} image(s) selected` 
                          : 'Click to upload 2-3 product images'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 5MB each · Max 3 images · Auto-compressed
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        First image will be set as primary
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Product Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dell XPS 15"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Stock</label>
                  <Input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as ProductCondition })}
                  >
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond.charAt(0).toUpperCase() + cond.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-new"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured-new" className="text-sm font-medium">
                  Mark as Featured
                </label>
              </div>

              {/* Specifications */}
              <div>
                <label className="text-sm font-medium mb-2 block">Specifications</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    placeholder="Add a specification..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                  />
                  <Button type="button" onClick={handleAddSpec}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specifications?.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(index)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={saving || uploading}>
                  {uploading ? 'Uploading Images...' : saving ? 'Saving...' : 'Add Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving || uploading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}