"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home = () => {
  const [discussions, setDiscussions] = useState([]); // Initialize state for discussions
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch('http://localhost:4000/discussions?courseId=161721');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDiscussions(data); // Set discussions state with the fetched data
      } catch (error) {
        console.error('Error fetching discussions:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchDiscussions(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Show loading indicator
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side (Discussion Titles) */}
      <div className="w-1/2 flex flex-col border-r border-gray-300 bg-white">
        <div className="p-4 bg-blue-500 text-white text-center font-bold">
          Discussion Titles
        </div>
        <div className="flex-1 p- 4 overflow-y-auto">
          {/* Display discussion titles in a vertical list */}
          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
                <div className="p-3 bg-gray-200 rounded-lg m-2 cursor-pointer hover:bg-gray-300">
                <strong>{discussion.title}</strong>
                {/* {discussion.title} Adjust this line based on your API response structure */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right side (Empty for now, reserved for future content) */}
      <div className="w-1/2 p-4 bg-gray-50">
        {/* Future content can be placed here */}
      </div>
    </div>
  );
};

export default Home;
