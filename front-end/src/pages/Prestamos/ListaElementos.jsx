"use client";
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Pagination from "./Paginacion";

export default function ListaElementos() {
  const [filters, setFilters] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleFilterChange = (type, value) => {
    if (type === "search") {
      setFilters({ ...filters, search: value });
      setCurrentPage(1);
    }
  };

  const items = [
    { id: 1, name: "Laptop", category: "Electronics", description: "Lenovo ThinkPad X1 Carbon", image: "/placeholder.svg" },
    { id: 2, name: "Projector", category: "Electronics", description: "Epson PowerLite Home Cinema 2100", image: "/placeholder.svg" },
    { id: 3, name: "Camera", category: "Electronics", description: "Canon EOS Rebel T7", image: "/placeholder.svg" },
    { id: 4, name: "Whiteboard", category: "Office", description: "Large Magnetic Whiteboard", image: "/placeholder.svg" },
    { id: 5, name: "Flipchart", category: "Office", description: "Mobile Flipchart Easel", image: "/placeholder.svg" },
    { id: 6, name: "Conference Phone", category: "Electronics", description: "Polycom SoundStation IP 6000", image: "/placeholder.svg" },
    { id: 7, name: "Desk Lamp", category: "Office", description: "Adjustable LED Desk Lamp", image: "/placeholder.svg" },
    { id: 8, name: "Wireless Mouse", category: "Electronics", description: "Logitech Wireless Mouse M325", image: "/placeholder.svg" },
    { id: 9, name: "Ergonomic Chair", category: "Office", description: "Steelcase Leap Ergonomic Chair", image: "/placeholder.svg" },
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.search.toLowerCase() && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="grid gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Buscar elementos para prestar:</CardTitle>
          <CardDescription>Filtra y busca el elemento que necesitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input
              type="search"
              placeholder="Buscar artículos..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
                <img src={item.image} alt={item.name} width={80} height={80} className="rounded-lg" />
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                  <div className="text-sm text-muted-foreground">Categoría: {item.category}</div>
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </CardContent>
      </Card>
    </div>
  );
}
