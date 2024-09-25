'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Plus } from 'lucide-react';

interface SheetData {
  Nama: string;
  Tempat: string;
  Waktu: string;
}

async function getData(): Promise<SheetData[]> {
  const res = await fetch('https://sheetdb.io/api/v1/926p9paa5g7jl');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

async function addData(newData: SheetData): Promise<void> {
  const res = await fetch('https://sheetdb.io/api/v1/926p9paa5g7jl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  });
  if (!res.ok) {
    throw new Error('Failed to add data');
  }
}

export default function DataDisplay() {
  const [data, setData] = useState<SheetData[]>([]);
  const [filteredData, setFilteredData] = useState<SheetData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newTempat, setNewTempat] = useState('');
  const [newTanggal, setNewTanggal] = useState('');
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    getData().then(setData).catch(console.error);
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          item.Nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Tempat.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Waktu.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const newData = { Nama: newName, Tempat: newTempat, Waktu: newTanggal };
      await addData(newData);
      setData([...data, newData]);
      setNewName('');
      setNewTempat('');
      setNewTanggal('');
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error('Failed to add new data:', error);
    }
  };

  const getGoogleMapsUrl = (tempat: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      tempat
    )}`;
  };

  return (
    <Card className="shadow-lg bg-white">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari berdasarkan nama, tempat atau waktu"
            className="pl-10 pr-4 py-2 w-full border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 text-left font-bold text-gray-700">
                Name
              </TableHead>
              <TableHead className="w-1/3 text-left font-bold text-gray-700">
                Tempat
              </TableHead>
              <TableHead className="w-1/3 text-left font-bold text-gray-700">
                Tanggal
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="py-2">{item.Nama}</TableCell>
                <TableCell className="py-2">
                  <a
                    href={getGoogleMapsUrl(item.Tempat)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.Tempat}
                  </a>
                </TableCell>
                <TableCell className="py-2">{item.Waktu}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="newName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              id="newName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="newTempat"
              className="block text-sm font-medium text-gray-700"
            >
              Tempat
            </label>
            <Input
              id="newTempat"
              type="text"
              value={newTempat}
              onChange={(e) => setNewTempat(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="newTanggal"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal
            </label>
            <Input
              id="newTanggal"
              type="text"
              placeholder="Contoh: Senin, 21 Sep 2024, 19:30 WITA"
              value={newTanggal}
              onChange={(e) => setNewTanggal(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? 'Sedang menambahkan...' : 'Tambah Kajian'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
