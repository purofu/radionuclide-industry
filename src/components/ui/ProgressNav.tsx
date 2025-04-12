"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  title: string;
  number: string;
}

export function ProgressNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Define sections based on the main page components
  const sections: Section[] = [
    { id: "hero", title: "Welcome", number: "00" },
    { id: "introduction", title: "Introduction", number: "01" },
    { id: "isotopes", title: "Isotopes", number: "02" },
    { id: "ligands", title: "Ligands & Targets", number: "03" },
    { id: "companies", title: "Companies", number: "04" },
    { id: "patient", title: "Patient Access", number: "05" },
    { id: "perspective", title: "Perspective", number: "06" },
  ];

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener for responsive behavior
    window.addEventListener('resize', checkMobile);
    
    // Show the nav after a slight delay for a nice entry effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // Function to handle scroll and update active section
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);

      // Don't show nav at the very top of the page
      if (scrollTop < 100) {
        setIsVisible(false);
      } else if (scrollTop >= 100 && !isVisible) {
        setIsVisible(true);
      }

      // Update active section based on scroll position
      let foundActive = false;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        // Check if the section is in the viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(section.id);
          foundActive = true;
          break;
        }
      }
      
      // If no section is active, use the section nearest to the top
      if (!foundActive && sections.length > 0) {
        // Default to first section if none is in view
        const firstVisibleSection = sections.find(section => {
          const el = document.getElementById(section.id);
          return el && el.getBoundingClientRect().bottom > 0;
        });
        
        if (firstVisibleSection) {
          setActiveSection(firstVisibleSection.id);
        } else {
          setActiveSection(sections[0].id);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Call once to initialize
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, [sections, isVisible]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top progress bar */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-1 bg-gray-100/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </motion.div>
      
      {/* Right side navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav 
            className={cn(
              "fixed z-40",
              isMobile ? "right-4 bottom-8 top-auto transform-none" : "right-8 top-1/2 transform -translate-y-1/2"
            )}
            initial={{ opacity: 0, x: 50, y: isMobile ? 50 : "-50%" }}
            animate={{ opacity: 1, x: 0, y: isMobile ? 0 : "-50%" }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              className={cn(
                "absolute -inset-4 bg-white/80 backdrop-blur-sm rounded-2xl -z-10",
                "opacity-0 transition-opacity duration-300",
                isHovering ? "opacity-100" : "opacity-0"
              )}
            />
            <motion.ul 
              className={cn(
                "flex relative",
                isMobile ? "flex-row gap-4" : "flex-col gap-6"
              )}
              variants={{
                hover: {
                  gap: isMobile ? "20px" : "28px",
                },
                idle: {
                  gap: isMobile ? "16px" : "24px"
                }
              }}
              animate={isHovering ? "hover" : "idle"}
              transition={{ duration: 0.3 }}
            >
              {sections.map((section, index) => (
                <motion.li 
                  key={section.id} 
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100, 
                    damping: 15 
                  }}
                >
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "flex items-center group transition-all duration-500 ease-out",
                      "focus:outline-none",
                      isMobile && "flex-col"
                    )}
                    aria-label={`Navigate to ${section.title} section`}
                  >
                    <div 
                      className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center",
                        "border-2 bg-white",
                        "transition-all duration-300 ease-out transform",
                        isHovering && "shadow-md",
                        activeSection === section.id 
                          ? "border-black scale-110" 
                          : "border-gray-200 hover:border-gray-400 hover:scale-105"
                      )}
                    >
                      <span 
                        className={cn(
                          "font-helvetica-now text-xs font-medium",
                          "transition-all duration-300 ease-out",
                          activeSection === section.id ? "text-black" : "text-gray-400"
                        )}
                      >
                        {section.number}
                      </span>
                      
                      {/* Active indicator dot */}
                      {activeSection === section.id && (
                        <motion.div 
                          layoutId="activeDot"
                          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-black transform -translate-x-1/2 -translate-y-1/2"
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        />
                      )}
                    </div>
                    
                    <div 
                      className={cn(
                        "overflow-hidden whitespace-nowrap",
                        "transition-all duration-500 ease-out",
                        isHovering
                          ? "max-w-[150px] opacity-100" 
                          : "max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100",
                        isMobile ? "mt-1 text-center" : "pl-2"
                      )}
                    >
                      <span className="text-sm font-medium text-black font-helvetica-now">
                        {section.title}
                      </span>
                    </div>
                    
                    {/* Line connecting the dots */}
                    {!isMobile && index < sections.length - 1 && (
                      <motion.div 
                        className="absolute left-1/2 w-px bg-gray-200 transform -translate-x-1/2"
                        initial={{ height: "22px", top: "calc(100% + 2px)" }}
                        animate={{ 
                          height: isHovering ? "24px" : "22px",
                          top: isHovering ? "calc(100% + 4px)" : "calc(100% + 2px)" 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
} 