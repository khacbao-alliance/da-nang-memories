export interface Trip {
  id: string;
  title: string;
  location: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface MemoryDay {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  date: string;
}

export interface Media {
  id: string;
  memory_day_id: string;
  day_number: number;
  media_type: "image" | "video";
  cloudinary_url: string;
  public_id?: string;
  uploaded_by: string;
  caption?: string;
  created_at: string;
  thumbnail_url?: string;
}

export interface Reaction {
  id: string;
  media_id: string;
  emoji: string;
  created_by: string;
  created_at: string;
}
