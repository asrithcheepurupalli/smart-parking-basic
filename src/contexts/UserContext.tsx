import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  userPhone: string | null;
  setUserPhone: (phone: string | null) => void;
}

const UserContext = createContext<UserContextType>({
  userPhone: null,
  setUserPhone: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userPhone, setUserPhone] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userPhone, setUserPhone }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);