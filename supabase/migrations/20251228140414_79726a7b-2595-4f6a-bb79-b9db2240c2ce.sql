-- Create paintings table
CREATE TABLE public.paintings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  dimensions TEXT,
  medium TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.paintings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view paintings)
CREATE POLICY "Anyone can view paintings" 
ON public.paintings 
FOR SELECT 
USING (true);

-- Create policy for public insert (for now, anyone can add - we'll add auth later)
CREATE POLICY "Anyone can insert paintings" 
ON public.paintings 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update
CREATE POLICY "Anyone can update paintings" 
ON public.paintings 
FOR UPDATE 
USING (true);

-- Create policy for public delete
CREATE POLICY "Anyone can delete paintings" 
ON public.paintings 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_paintings_updated_at
BEFORE UPDATE ON public.paintings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample paintings
INSERT INTO public.paintings (title, artist, description, price, category, image_url, available, dimensions, medium, year) VALUES
('Serene Horizon', 'Elena Vasquez', 'A breathtaking abstract interpretation of a coastal sunset, featuring warm golden hues blending into deep purples. This piece captures the tranquil moment between day and night.', 2500, 'Abstract', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop', true, '24" x 36"', 'Oil on Canvas', 2024),
('Mountain Dreams', 'Marcus Chen', 'Majestic mountain peaks shrouded in morning mist, painted with exquisite detail and a masterful use of light and shadow.', 3800, 'Landscape', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1000&fit=crop', true, '30" x 40"', 'Acrylic on Canvas', 2023),
('The Contemplator', 'Sofia Romano', 'An intimate portrait study exploring the depths of human introspection, rendered in rich earth tones with delicate brushwork.', 4200, 'Portrait', 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=1000&fit=crop', false, '20" x 28"', 'Oil on Linen', 2024),
('Garden Whispers', 'Elena Vasquez', 'Delicate florals arranged in a vintage vase, capturing the ephemeral beauty of spring blooms with impressionistic flair.', 1800, 'Still Life', 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=1000&fit=crop', true, '18" x 24"', 'Watercolor', 2023),
('Urban Pulse', 'James Morrison', 'A dynamic contemporary piece that captures the energy and rhythm of modern city life through bold geometric forms.', 5500, 'Contemporary', 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=1000&fit=crop', true, '36" x 48"', 'Mixed Media', 2024),
('Eternal Grace', 'Isabella Fontaine', 'A classical study in the Renaissance tradition, featuring masterful technique and timeless composition.', 8500, 'Classical', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=1000&fit=crop', true, '40" x 50"', 'Oil on Canvas', 2023),
('Chromatic Flow', 'Marcus Chen', 'Bold color fields interact in this modern abstract, creating visual harmony through careful balance of warm and cool tones.', 3200, 'Modern', 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=800&h=1000&fit=crop', true, '28" x 36"', 'Acrylic on Canvas', 2024),
('Lavender Fields', 'Sofia Romano', 'Inspired by the French countryside, this impressionist piece captures the magical purple haze of blooming lavender.', 2900, 'Impressionist', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=1000&fit=crop', false, '24" x 30"', 'Oil on Canvas', 2023);