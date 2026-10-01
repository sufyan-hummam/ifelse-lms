import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  external?: boolean;
}

export function BrandLogo({
  href = "/",
  size = "md",
  showTagline = false,
  className,
  external = false,
}: BrandLogoProps) {
  const heights = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const content = (
    <div className={cn("inline-flex items-center gap-3 group cursor-pointer", className)}>
      <div className="relative flex items-center">
        {/* Logo Mark & Lockup */}
        <div className="relative flex items-center h-8">
          <Image
            src="/logo-transparent.png"
            alt="IF/ELSE Intelligence Logo"
            width={120}
            height={heights[size]}
            className="block dark:hidden h-7 md:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
          <Image
            src="/logo-light.png"
            alt="IF/ELSE Intelligence Logo"
            width={120}
            height={heights[size]}
            className="hidden dark:block h-7 md:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
        </div>
        <div className="ml-2.5 pl-2.5 border-l border-border/80 flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-wider font-bold uppercase text-brand-navy dark:text-brand-sky">
            LMS
          </span>
          {showTagline && (
            <span className="text-[10px] text-muted-foreground font-mono leading-none">
              Beyond Binaries
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="IF/ELSE Intelligence Main Website"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label="IF/ELSE Intelligence LMS Home">
      {content}
    </Link>
  );
}
