import { useState } from "react";
import { useGallery } from "@/context/GalleryContext";
import { Painting, CATEGORIES } from "@/types/painting";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

const initialFormState = {
  title: "",
  artist: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  available: true,
  dimensions: "",
  medium: "",
  year: new Date().getFullYear().toString(),
};

const Admin = () => {
  const { paintings, loading, addPainting, updatePainting, deletePainting } = useGallery();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingPainting(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.artist || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addPainting({
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop",
        available: formData.available,
        dimensions: formData.dimensions,
        medium: formData.medium,
        year: parseInt(formData.year),
      });

      toast.success("Painting added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add painting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (painting: Painting) => {
    setEditingPainting(painting);
    setFormData({
      title: painting.title,
      artist: painting.artist,
      description: painting.description,
      price: painting.price.toString(),
      category: painting.category,
      imageUrl: painting.imageUrl,
      available: painting.available,
      dimensions: painting.dimensions,
      medium: painting.medium,
      year: painting.year.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPainting) return;

    setIsSubmitting(true);
    try {
      await updatePainting(editingPainting.id, {
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        available: formData.available,
        dimensions: formData.dimensions,
        medium: formData.medium,
        year: parseInt(formData.year),
      });

      toast.success("Painting updated successfully!");
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to update painting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePainting(id);
        toast.success("Painting deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete painting");
      }
    }
  };

  const PaintingForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-body">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Painting title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artist" className="font-body">Artist *</Label>
          <Input
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            placeholder="Artist name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-body">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the painting..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="font-body">Price (₹) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="25000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="font-body">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="font-body">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dimensions" className="font-body">Dimensions</Label>
          <Input
            id="dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleInputChange}
            placeholder='24" x 36"'
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medium" className="font-body">Medium</Label>
          <Input
            id="medium"
            name="medium"
            value={formData.medium}
            onChange={handleInputChange}
            placeholder="Oil on Canvas"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year" className="font-body">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, available: checked }))
            }
          />
          <Label htmlFor="available" className="font-body">Available for sale</Label>
        </div>
        <Button type="submit" variant="gallery" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="font-body text-muted-foreground mt-1">
              Manage your painting collection
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gallery" onClick={resetForm}>
                <Plus className="h-4 w-4" />
                Add Painting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Add New Painting</DialogTitle>
              </DialogHeader>
              <PaintingForm onSubmit={handleAddSubmit} submitLabel="Add Painting" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <p className="font-body text-sm text-muted-foreground">Total Paintings</p>
            <p className="font-display text-3xl font-bold text-foreground mt-1">
              {paintings.length}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <p className="font-body text-sm text-muted-foreground">Available</p>
            <p className="font-display text-3xl font-bold text-accent mt-1">
              {paintings.filter((p) => p.available).length}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <p className="font-body text-sm text-muted-foreground">Sold</p>
            <p className="font-display text-3xl font-bold text-primary mt-1">
              {paintings.filter((p) => !p.available).length}
            </p>
          </div>
        </div>

        {/* Paintings Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-body">Image</TableHead>
                <TableHead className="font-body">Title</TableHead>
                <TableHead className="font-body">Artist</TableHead>
                <TableHead className="font-body">Category</TableHead>
                <TableHead className="font-body">Price</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paintings.map((painting) => (
                <TableRow key={painting.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                      {painting.imageUrl ? (
                        <img
                          src={painting.imageUrl}
                          alt={painting.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-body font-medium">{painting.title}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{painting.artist}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-body">
                      {painting.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body font-medium">{formatPrice(painting.price)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        painting.available
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {painting.available ? "Available" : "Sold"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(painting)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(painting.id, painting.title)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paintings.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">No paintings yet</p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Click "Add Painting" to get started
              </p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Edit Painting</DialogTitle>
            </DialogHeader>
            <PaintingForm onSubmit={handleEditSubmit} submitLabel="Save Changes" />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin;
