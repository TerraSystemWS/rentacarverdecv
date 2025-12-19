export interface PopularPost {
	img: string;
	title: string;
	date: string;
	href?: string;
}

export interface CategoryItem {
	name: string;
	count: number;
	href?: string;
}

export interface PostSidebarData {
	popularPosts: PopularPost[];
	categories: CategoryItem[];
	tags: string[];
	adImage: string;
}

export const postSidebarData: PostSidebarData = {
	popularPosts: [
		{
			img: "/assets/images/post/post01.jpg",
			title: "Europe’s best affordable trips",
			date: "August 23, 2015",
		},
		{
			img: "/assets/images/post/post02.jpg",
			title: "Visiting Green Field",
			date: "August 23, 2015",
		},
		{
			img: "/assets/images/post/post03.jpg",
			title: "Top places to visit",
			date: "August 23, 2015",
		},
		{
			img: "/assets/images/post/post04.jpg",
			title: "Simple Flower Arrangements You Can Make",
			date: "August 23, 2015",
		},
	],

	categories: [
		{ name: "Travels", count: 45 },
		{ name: "Lifestyle", count: 55 },
		{ name: "Fashion", count: 20 },
		{ name: "Music", count: 30 },
		{ name: "Video", count: 50 },
	],

	tags: [
		"News",
		"Magazine",
		"Lifestyle",
		"Music",
		"Articles",
		"Travels",
		"Sports",
		"Movie",
		"Link",
		"Technology",
		"Fashion",
		"Business",
		"Newspaper",
		"E-Book",
	],

	adImage: "/assets/images/blog-add.png",
};
