export const verifyToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-token", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("✅ Token is valid");
        return true;
      } else {
        console.warn("❌ Token is invalid or expired");
        return false;
      }
    } catch (error) {
      console.error("❌ Error verifying token:", error);
      return false;
    }
  };
  