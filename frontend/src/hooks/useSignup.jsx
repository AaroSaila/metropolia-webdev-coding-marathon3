import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

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
        setError(data.message || "An error occurred");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify({ token: data.token, username: data.username }));
      setIsLoading(false);
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}