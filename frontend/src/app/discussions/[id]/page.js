"use client"; // This is a client component

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

const DiscussionPage = () => {
  const { id } = useParams(); // Get the dynamic route parameter 'id'
  // const { title } = useParams();

  const router = useRouter(); // Use the router for navigation
  // const  title = router.query;

  const [discussions, setDiscussions] = useState([]);
  const [readabilityScore, setReadabilityScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState(""); // State for reply input
  const [recommendations, setRecommendations] = useState([]); // State for recommendations
  const [userName, setUserName] = useState("Farhan"); // Simulating your name being stored in state


  useEffect(() => {
    setLoading(true);  // Start loading when the fetch begins
    setDiscussions([]);
  
    // Fetch data from the provided endpoint
    fetch(`http://localhost:4000/discussion-entries?courseId=161721&discussionId=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log("FARAHNA")
        setDiscussions(data);
        console.log("FARAHNA")
        // console.log(formattedData)
      })
      .catch((error) => console.error("Error fetching discussions:", error))  // Handle any errors
      .finally(() => {
        setLoading(false); // Ensure loading is set to false after fetching
      });
  }, []);

 
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (replyInput.trim() !== "") {
        try {
          const response = await fetch("http://127.0.0.1:8000/similar_posts", {
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
            setRecommendations([]); // Reset recommendations in case of failure
          }
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          setRecommendations([]); // Reset recommendations in case of error
        }
      } else {
        setRecommendations([]); // Clear recommendations if input is empty
      }
    };

    fetchRecommendations();
  }, [replyInput]);

  useEffect(() => {
    const fetchReadabilityScore = async () => {
      if (replyInput.trim() !== "") {
        try {
          const response = await fetch("http://127.0.0.1:8000/readability_score", {
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
            setReadabilityScore(data.dale_chall_readability_score); // Adjust according to your API response structure
          } else {
            console.error("Failed to fetch readability score:", response.statusText);
            setReadabilityScore(null); // Reset readability score in case of failure
          }
        } catch (error) {
          console.error("Error fetching readability score:", error);
          setReadabilityScore(null); // Reset readability score in case of error
        }
      } else {
        setReadabilityScore(null); // Clear score if input is empty
      }
    };

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
            style={{ backgroundColor: calculateColor(Math.round(readabilityScore)) }} // Set dynamic background color
            className="ml-4 w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            {Math.round(readabilityScore)}
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
            recommendations.map((rec, index) => (
              <div key={index} className="mb-4">
                {/* Determine heading based on index */}
                  {index === 0 ? (
                    // Heading for the first lecture recommendation
                    <h2 style={{ color: 'blue', fontSize: '20px', fontWeight: 'bold' }}>
                      Lecture Recommendations
                    </h2>
                  ) : index === 2 ? (
                    // Heading for other relevant posts starting from index 2
                    <h3 style={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                      Relevant Posts
                    </h3>
                  ) :
                    null
                  }

                
                <p className={index >= 2 ? "text-red-500" : "text-black"}>
                  {rec}
                </p>
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
