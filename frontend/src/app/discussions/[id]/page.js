"use client"; // This is a client component

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

const DiscussionPage = () => {
  const { id } = useParams(); // Get dynamic route parameter 'id'
  const router = useRouter(); // Use the router for navigation

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState(""); // State for reply input
  const [recommendations, setRecommendations] = useState([]); // State for recommendations
  const [userName, setUserName] = useState("Farhan"); // Simulating your name being stored in state

  // Simulate an API fetch for discussion data
  useEffect(() => {
    setDiscussions([]);
    // Simulate an API call to fetch the JSON
    fetch("/data/dummy_discussions.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDiscussions(data);
      })
      .catch((error) => console.error("Error fetching discussions:", error))
      .finally(() => {
        setLoading(false); // Ensure loading is set to false after fetching
      });
  }, []);

//   useEffect(() => {
//     const fetchDiscussions = async () => {
//       try {
//         fetch("/data/discussions.json")
//             .then((response) => response.json())
//             .then((data) => {
//                 setDiscussions(data);
//             })
//             .catch((error) => console.error("Error fetching discussions:", error));


//         // Simulating API call with timeout
//         setTimeout(() => {
//           // Setting discussion data after 1 second
//           setDiscussions(apiDiscussions); // Simulated data here
//           setLoading(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching discussions:", error);
//         setLoading(false);
//       }
//     };

//     fetchDiscussions();
//   }, []);


  // Simulate recommendation generation as user types
  useEffect(() => {
    if (replyInput.trim() !== "") {
      // Generate 3 dummy recommendation paragraphs based on the reply input
      const dummyRecommendations = [
        `Based on your input: "${replyInput}", here's a contextual thought on previous discussions...`,
        `Another point to consider related to "${replyInput}" is this aspect we discussed previously...`,
        `"${replyInput}" could align with the recommendations we've seen in past conversations.`,
      ];

      setRecommendations(dummyRecommendations);
    } else {
      setRecommendations([]); // Clear recommendations if input is empty
    }
  }, [replyInput]);

  const discussion = discussions[id];

  const handleSendReply = () => {
    if (replyInput.trim() === "") return;

    // Create a new reply object with the current time
    const newReply = {
      name: userName, // Use your current name from the state
      message: replyInput,
      time: new Date().toLocaleTimeString(), // Use the current time
    };

    // Update the discussion replies with the new reply
    const updatedDiscussions = [...discussions];
    updatedDiscussions[id].replies.push(newReply); // Add the new reply to the current discussion
    setDiscussions(updatedDiscussions);

    // Clear the input field
    setReplyInput("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side (Replies and Reply Input) */}
      <div className="w-1/2 flex flex-col border-r border-gray-300 bg-white">
        <div className="p-4 bg-blue-500 text-white text-center font-bold">
          {discussion.title}
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
          {discussion.replies.map((reply, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                reply.name === userName ? "bg-blue-100 text-right" : "bg-gray-200"
              }`}
            >
              <div className="font-bold">{reply.name}</div>
              <div>{reply.message}</div>
              <div className="text-sm text-gray-500">{reply.time}</div>
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
            recommendations.map((rec, index) => (
              <div key={index} className="mb-4">
                <p>{rec}</p>
              </div>
            ))
          ) : (
            <p>Start typing your reply to see recommendations.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;
