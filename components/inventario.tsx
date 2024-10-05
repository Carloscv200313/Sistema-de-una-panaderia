"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {useToast } from "@/components/ui/use-toast"
import { Pencil, Plus } from 'lucide-react'
interface Product {
  id: number;
  name: string;
  type: 'Ingrediente' | 'Producto';
  stock: number;
  minStock: number;
  price: number;
}

export const Inventario=()=> {
  const [inventory, setInventory] = useState<Product[]>([
    { id: 1, name: "Harina", type: "Ingrediente", stock: 100, minStock: 50, price: 2.5 },
    { id: 2, name: "Azúcar", type: "Ingrediente", stock: 80, minStock: 40, price: 1.8 },
    { id: 3, name: "Pan", type: "Producto", stock: 30, minStock: 20, price: 3.5 },
    { id: 4, name: "Pastel", type: "Producto", stock: 15, minStock: 10, price: 15.0 },
  ])
  const [filter, setFilter] = useState<'Todos' | 'Ingrediente' | 'Producto'>('Todos')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()

  const filteredInventory = inventory.filter(item => 
    filter === 'Todos' ? true : item.type === filter
  )

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProduct: Product = {
      id: Date.now(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'Ingrediente' | 'Producto',
      stock: Number(formData.get('stock')),
      minStock: Number(formData.get('minStock')),
      price: Number(formData.get('price')),
    }
    setInventory([...inventory, newProduct])
    setIsAddModalOpen(false)
    toast({
      title: "Producto añadido",
      description: `${newProduct.name} ha sido añadido al inventario.`,
    })
  }

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingProduct) return
    const formData = new FormData(e.currentTarget)
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.get('name') as string,
      type: formData.get('type') as 'Ingrediente' | 'Producto',
      stock: Number(formData.get('stock')),
      minStock: Number(formData.get('minStock')),
      price: Number(formData.get('price')),
    }
    setInventory(inventory.map(item => 
      item.id === updatedProduct.id ? updatedProduct : item
    ))
    setIsEditModalOpen(false)
    toast({
      title: "Producto actualizado",
      description: `${updatedProduct.name} ha sido actualizado en el inventario.`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Inventario</h1>
      
      <div className="flex justify-between items-center mb-4">
        <Select value={filter} onValueChange={(value: 'Todos' | 'Ingrediente' | 'Producto') => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Ingrediente">Ingredientes</SelectItem>
            <SelectItem value="Producto">Productos</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Añadir Producto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Producto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingrediente">Ingrediente</SelectItem>
                    <SelectItem value="Producto">Producto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" required />
              </div>
              <div>
                <Label htmlFor="minStock">Stock Mínimo</Label>
                <Input id="minStock" name="minStock" type="number" required />
              </div>
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input id="price" name="price" type="number" step="0.01" required />
              </div>
              <Button type="submit">Añadir Producto</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Stock Mínimo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell className={item.stock < item.minStock ? "text-red-500 font-bold" : ""}>
                {item.stock}
              </TableCell>
              <TableCell>{item.minStock}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" name="name" defaultValue={editingProduct.name} required />
              </div>
              <div>
                <Label htmlFor="edit-type">Tipo</Label>
                <Select name="type" defaultValue={editingProduct.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingrediente">Ingrediente</SelectItem>
                    <SelectItem value="Producto">Producto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input id="edit-stock" name="stock" type="number" defaultValue={editingProduct.stock} required />
              </div>
              <div>
                <Label htmlFor="edit-minStock">Stock Mínimo</Label>
                <Input id="edit-minStock" name="minStock" type="number" defaultValue={editingProduct.minStock} required />
              </div>
              <div>
                <Label htmlFor="edit-price">Precio</Label>
                <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={editingProduct.price} required />
              </div>
              <Button type="submit">Guardar Cambios</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}