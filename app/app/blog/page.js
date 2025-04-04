"use client";
import { useState } from "react";
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "Wind Energy Capacity Surpasses 1000 GW Globally",
      excerpt:
        "Global wind energy installations have reached a significant milestone, with total capacity exceeding 1000 gigawatts for the first time in history.",
      date: "March 18, 2025",
      author: "Sarah Chen",
      readTime: "5 min read",
      category: "wind",
      featured: true,
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: "New Breakthrough in Solar Panel Efficiency",
      excerpt:
        "Researchers at MIT have developed a new solar cell that achieves 35% efficiency, breaking previous records and promising more affordable renewable energy.",
      date: "March 15, 2025",
      author: "James Wilson",
      readTime: "4 min read",
      category: "solar",
      featured: false,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: "The Future of Offshore Wind Farms",
      excerpt:
        "Floating wind turbines are revolutionizing the industry by enabling deployment in deeper waters with stronger, more consistent winds.",
      date: "March 10, 2025",
      author: "Emma Roberts",
      readTime: "7 min read",
      category: "wind",
      featured: false,
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: "Green Hydrogen: The Missing Piece in Renewable Energy Storage",
      excerpt:
        "How green hydrogen production from excess wind and solar energy could solve the intermittency challenges of renewable power.",
      date: "March 5, 2025",
      author: "Michael Brown",
      readTime: "6 min read",
      category: "innovation",
      featured: true,
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80",
    },
    {
      id: 5,
      title: "Community Wind Projects Gaining Momentum",
      excerpt:
        "Local communities are increasingly investing in their own wind power projects, creating new models for energy democracy and local ownership.",
      date: "February 28, 2025",
      author: "Lisa Johnson",
      readTime: "4 min read",
      category: "wind",
      featured: false,
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80",
    },
    {
      id: 6,
      title: "Advances in Turbine Technology: What's Next?",
      excerpt:
        "From bladeless designs to vertical axis innovations, we explore the cutting-edge developments shaping the future of wind turbines.",
      date: "February 22, 2025",
      author: "David Parker",
      readTime: "8 min read",
      category: "innovation",
      featured: false,
      image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "wind", name: "Wind Energy" },
    { id: "solar", name: "Solar Power" },
    { id: "innovation", name: "Innovation" },
  ];

  const filteredPosts =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 px-4 min-h-screen max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Green Energy News & Insights</h1>
        <p className="text-gray-600 mb-8">
          Stay updated with the latest developments in renewable energy
        </p>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        By {post.author}
                      </span>
                      <button className="text-green-600 font-medium hover:text-green-800">
                        Read more →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white text-green-600 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {post.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col h-[calc(100%-160px)]">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs text-gray-500">
                      By {post.author}
                    </span>
                    <button className="text-green-600 text-sm font-medium hover:text-green-800">
                      Read more →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found in this category.</p>
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-16 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest news and insights on
              renewable energy
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:flex-grow"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}