"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Definición de tipos
interface Product {
  ID_producto: number;
  Nombre: string;
  Precio: number;
  Stock: number;
}

interface SaleItem extends Product {
  quantity: number;
}

export const SalesSystemComponent = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipoVenta, setTipoVenta] = useState(1); // Default value
  const [metodoPago, setMetodoPago] = useState(1); // Default value
  const [estadoVenta, setEstadoVenta] = useState(1); // Default value
  const [nombreCliente, setNombreCliente] = useState("Desconocido");
  const [apellidoCliente, setApellidoCliente] = useState("Desconocido");
  const { toast } = useToast();

  // Calcular el total de la venta
  useEffect(() => {
    const newTotal = saleItems.reduce((sum, item) => sum + item.Precio * item.quantity, 0);
    setTotal(newTotal);
  }, [saleItems]);

  // Obtener los productos desde el backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/ventas/registrar");
        const data = await response.json();
        setInventory(data); // Asignar los productos obtenidos al inventario
      } catch (error) {
        console.error("Error al obtener el inventario:", error);
      }
    };

    fetchInventory();
  }, []);

  // Filtrar productos según el término de búsqueda
  const filteredProducts = inventory.filter((product) =>
    product.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar un producto a la venta
  const addToSale = (product: Product) => {
    const existingItem = saleItems.find((item) => item.ID_producto === product.ID_producto);
    if (existingItem) {
      if (existingItem.quantity < product.Stock) {
        setSaleItems(
          saleItems.map((item) =>
            item.ID_producto === product.ID_producto
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        toast({
          title: "Stock insuficiente",
          description: `No hay más ${product.Nombre} en stock.`,
          variant: "destructive",
        });
      }
    } else {
      setSaleItems([...saleItems, { ...product, quantity: 1 }]);
    }
  };

  // Eliminar un producto de la venta
  const removeFromSale = (productId: number) => {
    setSaleItems(saleItems.filter((item) => item.ID_producto !== productId));
  };

  // Actualizar la cantidad de un producto en la venta
  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = saleItems.find((item) => item.ID_producto === productId);
    if (product && newQuantity <= product.Stock) {
      setSaleItems(
        saleItems.map((item) =>
          item.ID_producto === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      toast({
        title: "Stock insuficiente",
        description: `La cantidad solicitada excede el stock disponible.`,
        variant: "destructive",
      });
    }
  };

  // Completar la venta y actualizar el inventario
  const completeSale = async () => {
    if (saleItems.length === 0) {
      toast({
        title: "Venta vacía",
        description: "No hay productos en la venta actual.",
        variant: "destructive",
      });
      return;
    }

    const productos = saleItems.map((item) => ({
      ID_producto: item.ID_producto,
      Cantidad: item.quantity,
      Precio_unitario: item.Precio,
      Subtotal: item.Precio * item.quantity,
    }));

    try {
      const response = await fetch("/api/ventas/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_empleado: 1, // ID de empleado temporal
          NombreCliente: nombreCliente || "Desconocido", // Si no se proporciona, usa 'Desconocido'
          ApellidoCliente: apellidoCliente || "Desconocido", // Si no se proporciona, usa 'Desconocido'
          Total: total,
          ID_estado_venta: estadoVenta,
          ID_metodo_pago: metodoPago,
          ID_tipo_venta: tipoVenta,
          Productos: JSON.stringify(productos),
        }),
      });

      if (response.ok) {
        // Actualizar el inventario (disminuir stock)
        const updatedInventory = inventory.map((product) => {
          const saleItem = saleItems.find((item) => item.ID_producto === product.ID_producto);
          if (saleItem) {
            return { ...product, Stock: product.Stock - saleItem.quantity };
          }
          return product;
        });
        setInventory(updatedInventory);

        setSaleItems([]); // Limpiar productos vendidos
        setIsDialogOpen(false); // Cerrar el modal

        toast({
          title: "Venta completada",
          description: `Venta a ${nombreCliente} ${apellidoCliente}. Total: $${total.toFixed(2)}`,
        });
        setNombreCliente("Desconocido");
        setApellidoCliente("Desconocido");
      } else {
        toast({
          title: "Error en la venta",
          description: "Ocurrió un error al procesar la venta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      toast({
        title: "Error en la venta",
        description: "Ocurrió un error en el servidor.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Ventas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda de productos */}
        <Card>
          <CardHeader>
            <CardTitle>Búsqueda de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.ID_producto}>
                    <TableCell>{product.Nombre}</TableCell>
                    <TableCell>${product.Precio.toFixed(2)}</TableCell>
                    <TableCell>{product.Stock}</TableCell>
                    <TableCell>
                      <Button onClick={() => addToSale(product)} disabled={product.Stock === 0}>
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Venta actual */}
        <Card>
          <CardHeader>
            <CardTitle>Venta Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleItems.map((item) => (
                  <TableRow key={item.ID_producto}>
                    <TableCell>{item.Nombre}</TableCell>
                    <TableCell>${item.Precio.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.ID_producto, parseInt(e.target.value))}
                        min={1}
                        max={item.Stock}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>${(item.Precio * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="destructive" onClick={() => removeFromSale(item.ID_producto)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Realizar Compra</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detalles de la Venta</DialogTitle>
                  </DialogHeader>

                  {/* Campos del cliente */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">Nombre Cliente</Label>
                    <Input
                      id="firstName"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">Apellido Cliente</Label>
                    <Input
                      id="lastName"
                      value={apellidoCliente}
                      onChange={(e) => setApellidoCliente(e.target.value)}
                      className="col-span-3"
                    />
                  </div>

                  {/* Selects con estilo similar al que pediste */}
                  <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="tipoVenta" className="text-right">Tipo de Venta</Label>
                    <select
                      id="tipoVenta"
                      value={tipoVenta}
                      onChange={(e) => setTipoVenta(parseInt(e.target.value))}
                      className="col-span-3 border rounded-md p-2"
                    >
                      <option value={1}>Delivery</option>
                      <option value={2}>Local</option>
                      <option value={3}>Virtual</option>
                      <option value={4}>Para llevar</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="metodoPago" className="text-right">Método de Pago</Label>
                    <select
                      id="metodoPago"
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(parseInt(e.target.value))}
                      className="col-span-3 border rounded-md p-2"
                    >
                      <option value={1}>Efectivo</option>
                      <option value={2}>Tarjeta de crédito</option>
                      <option value={3}>Transferencia bancaria</option>
                      <option value={4}>Tarjeta de débito</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="estadoVenta" className="text-right">Estado de la Venta</Label>
                    <select
                      id="estadoVenta"
                      value={estadoVenta}
                      onChange={(e) => setEstadoVenta(parseInt(e.target.value))}
                      className="col-span-3 border rounded-md p-2"
                    >
                      <option value={1}>Pedido</option>
                      <option value={2}>Cancelado</option>
                    </select>
                  </div>

                  <Button onClick={completeSale} className="mt-4">Confirmar Venta</Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
