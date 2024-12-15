import {Movie} from "@/type/Movie";

export interface Schedule {
    id: string;
    dayName: string;
    movies: Movie[];
    timeSlots: {
        movieId: string;
        time: string;
        status: 'Đã Phát Hành' | 'Sắp Phát Hành' | 'Chưa Phát Hành';
    }[];
}