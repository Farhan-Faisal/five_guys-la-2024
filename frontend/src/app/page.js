"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home = () => {
  const [discussions, setDiscussions] = useState([]); // Initialize state for discussions
  const [loading, setLoading] = useState(true); // State to handle loading

  /**
   * Fetches discussion titles for a specific course.
   *
   * This function sends a GET request to the API to retrieve discussion titles for the specified course.
   * It updates the `discussions` state with the fetched data and manages the loading state.
   *
   * @async
   * @function fetchDiscussionsTitles
   * @returns {Promise<void>} A promise that resolves when the discussion titles have been fetched and the state updated.
   */
  const fetchDiscussionsTitles = async () => {
    try {
        // console.log(process.env.NEXT_PUBLIC_YIBIN_BASE_URL);
        const response = await fetch(`${process.env.NEXT_PUBLIC_YIBIN_BASE_URL}/discussions?courseId=161721`);
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


  useEffect(() => {
    fetchDiscussionsTitles(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div> // Show loading indicator
    );
  }

  return (
    <div className="h-screen flex justify-items-center bg-gray-100">
      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col p-4 m-4 rounded border-black justify-center bg-white">

        {/* Beta Version and Logo Section */}
        <div className="flex flex-col items-center rounded-xl shadow p-4">
          {/* App Logo */}
          <img src="/favicon.png" alt="App Logo" className="mb-2 w-full h-auto" />

          {/* Beta Version Message */}
          <p className="text-center text-gray-700 mb-4">
            Beta version. Access limited to only one canvas course for website demo.
          </p>
        </div>

        <div className="rounded-xl shadow p-2 m-2 border-black justify-center bg-white">
          {/* COURSES */}
          <div className="p-4 bg-blue-500 rounded-xl text-white text-center font-bold">
            Courses
          </div>

          <div className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-4">
              <Link key="a" href={`/discussions`}>
                <div className="p-3 bg-gray-200 rounded-lg m-2 cursor-pointer hover:bg-gray-300">
                  <strong>Learning Analytics</strong>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* RIGHT side (DISCUSSION TITLES) */}
      <div className="w-1/2 flex flex-col p-4 m-4 rounded border-black justify-center bg-white">
        <div className="p-4 bg-blue-500 text-white rounded-xl text-center font-bold">
          Discussion Titles
        </div>
        
        <div className="flex-1 p- 4 overflow-y-auto">
          {/* Display discussion titles in a vertical list */}
          <div className="space-y-4">
            {discussions.map((discussion, _) => (
              <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
                <div onClick={(event) => localStorage.setItem('discussionTitle', discussion.title)}
                  className="p-3 bg-gray-200 rounded-lg m-2 cursor-pointer hover:bg-gray-300">
                    <strong>{discussion.title}</strong>
                </div>
              </Link>
            ))}
          </div>

        </div>
        
      </div>

    </div>
  );
};

export default Home;
