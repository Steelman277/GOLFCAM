'use client'

import { createContext, useContext, useState } from 'react'

interface IUser {
  number: string;
  name: string;
  email: string;
  role: string;
  isManager: boolean;
  isApproved: boolean;
}

interface ITeam {
    number: string;
    name: string;
}

interface IEvent {
    week: string;
    dateStart: Date;
    dateEnd: Date;
    code: string;
    name: string;
    divisionCode: string;
    districtCode: string;
    city: string;
    stateprov: string;
    country: string;
    teams: ITeam[];
}

interface IAppContext {
    appUser: IUser | null;
    appEvent: IEvent | null;
    setAppUser: any;
    setAppEvent: any;
}

const AppContext = createContext<IAppContext>({
    appUser: null,
    appEvent: null,
    setAppUser: () => {},
    setAppEvent: () => {},
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [appUser, setAppUser] = useState<IUser | null>(null)
    const [appEvent, setAppEvent] = useState<IEvent | null>(null)

    return (
        <AppContext.Provider value={{ appUser, appEvent, setAppUser, setAppEvent }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)