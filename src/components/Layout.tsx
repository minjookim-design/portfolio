import { Outlet } from 'react-router-dom'
import { LeftPanel } from './LeftPanel'
import { ScrollSpyProvider, useScrollSpy } from '../context/ScrollSpyContext'

function LayoutInner() {
  const { scrollContainerRef } = useScrollSpy()

  return (
    <div className="h-screen overflow-hidden flex bg-black font-mono text-[18px] leading-[20px] p-5 gap-8">
      {/* Left floating nav card */}
      <div
        className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden"
        style={{
          width: 260,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#080808',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <LeftPanel />
      </div>

      {/* Right scrollable content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-scroll"
        style={{ scrollBehavior: 'smooth' }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export function Layout() {
  return (
    <ScrollSpyProvider>
      <LayoutInner />
    </ScrollSpyProvider>
  )
}
