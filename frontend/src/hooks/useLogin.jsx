import { useState } from "react";

export default function useLogin(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Login failed");
        setIsLoading(false);
        return null;
      }

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoading(false);
      return user;
    } catch (err) {
      setError("Network error");
      setIsLoading(false);
      return null;
    }
  };

  return { login, isLoading, error };
}
