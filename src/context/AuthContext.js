/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    const storedUsers = localStorage.getItem("users");

    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  }, []);

  const login = (userData) => {
    setUsers(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  };

  const updateCart = useCallback((newCart) => {
    setLoggedInUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, cart: newCart };

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.username === updatedUser.username ? updatedUser : user
        );

        if (JSON.stringify(prevUser.cart) !== JSON.stringify(newCart)) {
          localStorage.setItem("users", JSON.stringify(updatedUsers));
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        }

        return updatedUsers;
      });

      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser, updateCart, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("loggedInUser");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         localStorage.removeItem("loggedInUser");
//       }
//     }
//   }, []);

//   const login = (userData) => {
//     if (!userData) return console.error("No user data provided!");
//     try {
//       localStorage.setItem("loggedInUser", JSON.stringify(userData));
//     } catch (error) {
//       console.error("Failed to store user data:", error);
//       localStorage.removeItem("loggedInUser");
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("loggedInUser");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
