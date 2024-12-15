import {Category} from "@/type/Category";
import {Country} from "@/type/Country";
import {Episode} from "@/type/Episode";

export interface Movie {
  id: string;
  name: string;
  slug: string;
  originName: string;
  posterUrl: string;
  thumbUrl: string;
  quality: string;
  exclusive: boolean;
  inTheater: boolean;
  duration: string;
  episodeCurrent: string;
  language: string;
  year: number;
  views: number;
  modifiedAt: string;
  isLiked?: boolean;
  inSlide: boolean;
  categories: Category[];
  countries: Country[];
  episodes: Episode[];
  currentEpisode?: Episode;
}