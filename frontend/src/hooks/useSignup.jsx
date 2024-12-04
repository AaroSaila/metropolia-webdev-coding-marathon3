import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const data = await response.json();

      if (!response.ok) {
        // Capture error message from server or provide a fallback
        setError(data.message || "An error occurred during signup");
        setIsLoading(false);
        return false; // Explicitly return failure
      }

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          username: data.username,
          name: data.name, // Include other fields if needed
        })
      );

      setIsLoading(false);
      return true; // Explicitly return success
    } catch (err) {
      console.error("An error occurred:", err);
      setError("A network error occurred. Please try again.");
      setIsLoading(false);
      return false; // Explicitly return failure
    }
  };

  return { signup, isLoading, error };
}
