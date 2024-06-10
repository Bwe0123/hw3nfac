'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';

interface Post {
  id: number;
  title: string;
  body: string;
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const fetchData = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://dummyjson.com/posts?limit=10&skip=${(page - 1) * 10}`);
      setPosts(response.data.posts);
      setFilteredPosts(response.data.posts);
      setTotalPages(Math.ceil(response.data.total / 10));
      setLoading(false);
    } catch (error) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPosts(posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-100">
      <Navbar onSearch={setSearchQuery} />
      <div className="w-full max-w-6xl space-y-10">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between mt-20">
              <div className="md:w-2/3 md:pr-6">
                <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
                <p className="text-gray-600 mb-6">Views: {post.views}</p>
                <p className="text-gray-700">{post.body}</p>
                <p className="text-gray-500 mt-4">User ID: {post.userId}</p>
                <div className="text-gray-500 mt-4">
                  Reactions: Likes - {post.reactions.likes}, Dislikes - {post.reactions.dislikes}
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:w-1/3">
                <img
                  src={`https://picsum.photos/600/450?random=${post.id}`}
                  alt="Random"
                  className="ml-20 w-[50%] h-50 md:h-32 rounded-md"
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-between w-full max-w-6xl">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-black text-white p-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-black text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
