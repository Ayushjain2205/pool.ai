"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, X, Wallet, Award, Settings, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Tasks", href: "/tasks" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Leaderboard", href: "/leaderboard" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-deep-violet/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 mr-2 relative overflow-hidden rounded-full">
              <img src="/pool-logo.png" alt="POOL.AI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-mono font-bold text-xl text-off-white">POOL.AI</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-off-white/80 hover:text-mint-green transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side - User menu & notifications */}
          <div className="flex items-center gap-2">
            {!isMobile && (
              <>
                <Button variant="outline" size="sm" className="rounded-full">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 relative overflow-hidden rounded-full">
                      <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                    </div>
                    <span>120.5 POOL</span>
                  </div>
                </Button>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
                  >
                    3
                  </Badge>
                </div>
              </>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/abstract-user.png" />
                    <AvatarFallback className="bg-indigo-glow/30">P</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>pooluser</span>
                    <span className="text-xs text-off-white/60">Level 8 Contributor</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span className="mr-1">My Wallet</span>
                    <div className="w-4 h-4 ml-auto relative">
                      <Image src="/pool-logo.png" alt="POOL Coin" width={16} height={16} className="object-contain" />
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" /> Achievements
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            {isMobile && (
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-deep-violet/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-off-white hover:bg-indigo-glow/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-indigo-glow/20 my-2 pt-2">
              <Link
                href="/wallet"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-off-white hover:bg-indigo-glow/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 relative overflow-hidden rounded-full">
                    <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                  </div>
                  <span>My Wallet</span>
                </div>
              </Link>
              <Link
                href="/notifications"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-off-white hover:bg-indigo-glow/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-5 w-5 mr-3" /> Notifications
                <Badge variant="secondary" className="ml-auto">
                  3
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
