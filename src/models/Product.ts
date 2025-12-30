import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String }, 
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  engine: { type: String, required: true },
  voltage: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '/placeholder.jpg' },
}, { 
  timestamps: true,
  collection: 'maquinario' 
});

// CORREÇÃO CRÍTICA PARA NEXT.JS:
// Se o modelo já existir no cache, nós o deletamos para forçar uma nova compilação
// com o Schema atualizado (incluindo o nome correto da collection).
if (models.Product) {
  delete models.Product;
}

const Product = model('Product', ProductSchema);

export default Product;