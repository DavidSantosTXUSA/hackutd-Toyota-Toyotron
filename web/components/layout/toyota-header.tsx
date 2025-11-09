'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

type ToyotaHeaderAction = {
  label: string
  href: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

type ToyotaHeaderProps = {
  navItems?: Array<{ label: string; href: string }>
  actions?: ToyotaHeaderAction[]
  rightSlot?: React.ReactNode
  className?: string
  sticky?: boolean
  translucent?: boolean
}

export function ToyotaHeader({
  navItems = [],
  actions = [],
  rightSlot,
  className,
  sticky = true,
  translucent = true,
}: ToyotaHeaderProps) {
  const headerClasses = cn(
    'border-b border-border/60',
    translucent
      ? 'bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      : 'bg-background',
    sticky && 'sticky top-0 z-50',
    className,
  )

  return (
    <header className={headerClasses}>
      <div className="toyota-container flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-4">
          <span className="relative flex items-center gap-3">
            <span className="relative block h-10 w-32">
              <Image
                src="/Toyota_Logo.svg"
                alt="Toyota"
                fill
                className="object-contain"
                priority
              />
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-sm font-semibold text-muted-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative transition-colors hover:text-foreground"
            >
              <span className="tracking-wide">{item.label}</span>
              <span className="absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant={
                  action.variant === 'ghost'
                    ? 'ghost'
                    : action.variant === 'secondary'
                      ? 'outline'
                      : 'default'
                }
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold transition-all',
                  action.variant === 'primary' &&
                    'shadow-[0_14px_30px_-20px_rgba(235,10,30,0.75)]',
                  action.variant === 'secondary' &&
                    'border-border/70 bg-transparent text-foreground hover:bg-muted/60',
                  action.variant === 'ghost' &&
                    'text-foreground hover:bg-muted/60',
                )}
              >
                <>
                  {action.label}
                  {action.icon && <span className="ml-1">{action.icon}</span>}
                </>
              </Button>
            </Link>
          ))}
          {rightSlot}
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border/70 bg-card/80 shadow-sm hover:bg-card"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur">
              <div className="flex flex-col gap-10 px-1 py-10">
                <Link href="/" className="flex items-center gap-3">
                  <span className="relative block h-9 w-28">
                    <Image
                      src="/Toyota_Logo.svg"
                      alt="Toyota"
                      fill
                      className="object-contain"
                      priority
                    />
                  </span>
                </Link>
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-semibold text-foreground/90"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {actions.map((action) => (
                    <Link key={action.href} href={action.href}>
                      <Button
                        variant={
                          action.variant === 'ghost'
                            ? 'ghost'
                            : action.variant === 'secondary'
                              ? 'outline'
                              : 'default'
                        }
                        className={cn(
                          'h-12 w-full rounded-full text-base font-semibold',
                          action.variant === 'primary' &&
                            'shadow-[0_20px_40px_-22px_rgba(235,10,30,0.75)]',
                          action.variant === 'secondary' &&
                            'border-border/70 bg-transparent text-foreground hover:bg-muted/60',
                          action.variant === 'ghost' &&
                            'text-foreground hover:bg-muted/60',
                        )}
                      >
                        <>
                          {action.label}
                          {action.icon && <span className="ml-2">{action.icon}</span>}
                        </>
                      </Button>
                    </Link>
                  ))}
                  {rightSlot && (
                    <div className="pt-2">
                      {rightSlot}
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

