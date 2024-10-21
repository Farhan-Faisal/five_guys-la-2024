"use client"; // This is a client component

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

const DiscussionPage = () => {
  const { id } = useParams(); // Get the dynamic route parameter 'id'
  const router = useRouter(); // Use the router for navigation

  const [discussions, setDiscussions] = useState([]);
  const [readabilityScore, setReadabilityScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState(""); // State for reply input
  const [recommendations, setRecommendations] = useState([]); // State for recommendations
  const [userName, setUserName] = useState("Farhan"); // Simulating your name being stored in state

  const [visibleRecommendations, setVisibleRecommendations] = useState([]);

  /**
   * Fetches discussion entries for a specific course and discussion based on the provided discussion ID.
   *
   * This function sends a GET request to the API to retrieve discussion entries for the specified course.
   * It updates the `discussions` state with the fetched data and manages the loading state.
   *
   * @async
   * @function fetch_discussion_entries
   * @returns {Promise<void>} A promise that resolves when the discussions have been fetched and the state updated.
   */
  const fetch_discussion_entries = async () => {
      fetch(`${process.env.NEXT_PUBLIC_YIBIN_BASE_URL}/discussion-entries?courseId=161721&discussionId=${id}`)
      .then((response) => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then((data) => {
          console.log("FARAHNA");
          setDiscussions(data);
          console.log("FARAHNA");
      })
      .catch((error) => console.error("Error fetching discussions:", error))
      .finally(() => {
          setLoading(false);
      });
  };

  /**
   * Fetches recommendations for similar posts based on the user's input reply and previously fetched discussions.
   *
   * This function sends a POST request to the API with the user's reply and previous discussions,
   * then updates the `recommendations` state with the fetched similar posts.
   *
   * @async
   * @function fetchRecommendations
   * @returns {Promise<void>} A promise that resolves when the recommendations have been fetched and the state updated.
   */
  const fetchRecommendations = async () => {
      if (replyInput.trim() !== "") {
          try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_JIAYI_BASE_URL}/similar_posts`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      input_post: replyInput,
                      previous_replies: discussions,
                      top_n: 3
                  }),
              });

              if (response.ok) {
                  const data = await response.json();
                  console.log(data);
                  const extractedRecommendations = data.similar_posts.map(postObj => postObj.post);
                  setRecommendations(extractedRecommendations || []);
              } else {
                  console.error("Failed to fetch recommendations:", response.statusText);
                  setRecommendations([]);
              }
          } catch (error) {
              console.error("Error fetching recommendations:", error);
              setRecommendations([]);
          }
      } else {
          setRecommendations([]);
      }
  };

  /**
   * Fetches the Dale-Chall readability score for the user's input text.
   *
   * This function sends a POST request to the API with the user's reply to calculate the readability score.
   * It updates the `readabilityScore` state with the fetched score if successful.
   *
   * @async
   * @function fetchReadabilityScore
   * @returns {Promise<void>} A promise that resolves when the readability score has been fetched and the state updated.
   */
  const fetchReadabilityScore = async () => {
      if (replyInput.trim() !== "") {
          try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_JIAYI_BASE_URL}/readability_score`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      input_post: replyInput,
                  }),
              });

              if (response.ok) {
                  const data = await response.json();
                  setReadabilityScore(data.dale_chall_readability_score);
              } else {
                  console.error("Failed to fetch readability score:", response.statusText);
                  setReadabilityScore(null);
              }
          } catch (error) {
              console.error("Error fetching readability score:", error);
              setReadabilityScore(null);
          }
      } else {
          setReadabilityScore(null);
      }
  };


  useEffect(() => {
    recommendations.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRecommendations((prev) => [...prev, index]);
      }, index * 500); // Adjust timing here for fade-in effect
    });
  }, [recommendations]);
  
  useEffect(() => {
    setLoading(true);  // Start loading when the fetch begins
    setDiscussions([]);
    fetch_discussion_entries();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [replyInput]);

  useEffect(() => {
    fetchReadabilityScore();
  }, [replyInput]);


  console.log("id", id)
  console.log("discussion",  discussions)
  console.log("score", readabilityScore)

  const handleSendReply = () => {
    if (replyInput.trim() === "") return;

    // Create a new reply object with the current time
    const newReply = {
      user_name: userName, // Use your current name from the state
      message: replyInput,
      created_at: new Date().toLocaleTimeString(), // Use the current time
    };

    // Update the discussion replies with the new reply
    const updatedDiscussions = [...discussions];
    updatedDiscussions.push(newReply); // Add the new reply to the current discussion
    setDiscussions(updatedDiscussions);

    // Clear the input field
    setReplyInput("");
    setVisibleRecommendations([]);
  };

  const calculateColor = (score) => {
    // Ensure score is between 1 and 20
    const clampedScore = Math.max(1, Math.min(score, 20));
    
    // Calculate red and green values
    const red = Math.round((20 - clampedScore) * 255 / 19); // From 255 to 0
    const green = Math.round((clampedScore - 1) * 255 / 19); // From 0 to 255
  
    return `rgb(${red}, ${green}, 0)`; // RGB color string
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!discussions) {
    return <div>Discussion not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side (Replies and Reply Input) */}
      <div className="w-1/2 flex flex-col border-r border-gray-300 bg-white">
        <div className="p-4 bg-blue-500 text-white text-center font-bold">
          <span>Ketchup or Mustard?</span>
          <br/>
          <span>Do you prefer or mustard? Why?</span>
        </div>

        <div className="p-4">
          <button
            onClick={() => router.back()}
            className="mb-4 p-2 bg-gray-300 rounded-lg"
          >
            Back to Discussions
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {discussions.map((reply, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                reply.user_name === userName ? "bg-blue-100 text-right" : "bg-gray-200"
              }`}
            >
              <div className="font-bold">{reply.user_name}</div>
              <div>{reply.message}</div>
              <div className="text-sm text-gray-500">{reply.created_at}</div>
            </div>
          ))}
        </div>

        {/* Reply Input Section */}
        <div className="p-4 border-t border-gray-300 flex items-center">
          <input
            type="text"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your reply..."
          />

        <button
            onClick={handleSendReply}
            style={{ backgroundColor: calculateColor(Math.round(readabilityScore) == 19 ? 0 : Math.round(readabilityScore)) }} // Set dynamic background color
            className="ml-4 w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            {Math.round(readabilityScore) == 19 ? 0 : Math.round(readabilityScore)}
          </button>


          {/* <div className="ml-4 w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600">
            {Math.round(readabilityScore)}
          </div> */}
          <button
            onClick={handleSendReply}
            className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>

      {/* Right side (Recommendations based on reply) */}
      <div className="w-1/2 p-4 bg-gray-50">
        <div className="text-lg font-bold mb-4">Recommendations</div>
        <div className="flex-1 bg-gray-200 p-4 rounded-lg">
        {recommendations.length > 0 ? (
        recommendations.map((rec, index) => {
          // Calculate inline styles for fade-in effect
          const isVisible = visibleRecommendations.includes(index);
          const fadeStyle = {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s, transform 0.5s', // Duration for fade-in effect
          };

          return (
            <div key={index} className="mb-4" style={fadeStyle}>
              {index === 0 ? (
                <h2 style={{ color: 'blue', fontSize: '20px', fontWeight: 'bold' }}>
                  Lecture Recommendations
                </h2>
              ) : index === 2 ? (
                <h3 style={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                  Relevant Posts
                </h3>
              ) : null}
              <p className={index >= 2 ? "text-red-500" : "text-black"}>
                {rec}
              </p>
            </div>
          );
        })
      ) : (
        <p>Start typing your reply to see recommendations.</p>
      )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;
