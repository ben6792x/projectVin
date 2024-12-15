// src/data/scheduleData.ts
export const SCHEDULE_DATA = {
    dates: [
        { day: "Thứ 2", date: "25/03" },
        { day: "Thứ 3", date: "26/03" },
        { day: "Thứ 4", date: "27/03" },
        { day: "Thứ 5", date: "28/03" },
        { day: "Thứ 6", date: "29/03" },
        { day: "Thứ 7", date: "30/03" },
        { day: "CN", date: "31/03" }
    ],
    movies: {
        "25/03": [
            {
                time: "20:00",
                date: "25/03/2024",
                name: "Đấu La Đại Lục",
                image: "thon-phe-tinh-khong-133-300x449-1.jpg",
                episode: "Tập 245",
                genre: { name: "Huyền Huyễn", color: "blue" },
                status: { text: "Đã Phát Hành", color: "green" }
            },
            {
                time: "21:00",
                date: "25/03/2024",
                name: "Vạn Giới Thần Chủ",
                image: "thon-phe-tinh-khong-133-300x449-1.jpg",
                episode: "Tập 180",
                genre: { name: "Tu Tiên", color: "purple" },
                status: { text: "Sắp Phát Hành", color: "yellow" }
            },
            {
                time: "22:00",
                date: "25/03/2024",
                name: "Thôn Phệ Tinh Không",
                image: "thon-phe-tinh-khong-133-300x449-1.jpg",
                episode: "Tập 133",
                genre: { name: "Huyền Ảo", color: "red" },
                status: { text: "Chưa Phát Hành", color: "gray" }
            }
        ],
        // Thêm dữ liệu cho các ngày khác nếu cần
    }
};