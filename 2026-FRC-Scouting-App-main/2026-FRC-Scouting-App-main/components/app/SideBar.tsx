'use client'

import { useState } from "react"
import { PanelRightClose, PanelRightOpen, CalendarDays, House, CircleUserRound } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"


const SideBar = () => {
    const router = useRouter();
    const [isOpen, setOpen] = useState<boolean>(false)
    const { appEvent, setAppEvent } = useAppContext();

    return (
        <div className={`fixed top-0 left-0 z-10 ${isOpen ? "w-64" : "w-16"} h-screen flex max-w-screen flex-col gap-4 p-4 overflow-hidden bg-[#0F1031]`}>
            <div className="flex flex-row gap-2" onClick={() => setOpen(!isOpen)}>
                <Button variant="ghost" size="icon">
                    <Image src="/images/ABACUS-white-4x5.svg" alt="Abacus Logo" width={24} height={30} />
                </Button>
                <div className={`flex flex-col px-1 ${!isOpen && "hidden" }`}>
                    <p className="text-sm font-bold">ABACUS</p>
                    <p className="text-[9px] font-normal">Scouting App for FIRST Age - Rebuilt</p>
                </div>
            </div>
            <div className="flex flex-row gap-2" onClick={() => router.push('/')}>
                <Button variant="ghost" size="icon">
                    <House className="m-auto" />
                </Button>
                <div className={`text-sm font-bold p-2 ${!isOpen && "hidden" }`}>Home</div>
            </div>
            <div className="flex flex-row gap-2" onClick={() => router.push('/signin')}>
                <Button variant="ghost" size="icon">
                    <CircleUserRound className="m-auto" />
                </Button>
                <div className={`text-sm font-bold p-2 ${!isOpen && "hidden" }`}>Sign In</div>
            </div>
            <div className="flex flex-row gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push('/selectevent')}>
                    <CalendarDays className="m-auto" />
                </Button>
                {appEvent && <div className={`text-lg font-normal p-1 ${!isOpen && "hidden" }`}>{appEvent?.name}</div>}
                {!appEvent && <div className={`text-lg font-normal p-1 ${!isOpen && "hidden" }`}>Select Event to Scout</div>}
            </div>
            
            <div className="flex flex-row gap-2">
                <Button variant="ghost" size="icon" onClick={() => setOpen(!isOpen)}>
                    {isOpen ? <PanelRightOpen className="m-auto" /> : <PanelRightClose className="m-auto" />}
                </Button>
                <div className={`text-lg font-bold ${!isOpen && "hidden" }`}></div>
            </div>

        </div>
    )
}

export default SideBar