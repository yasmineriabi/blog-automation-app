"use client";

import { useState, useRef, useEffect } from "react";
import { ListFilter, X } from "lucide-react";
import useBlogStore from "@/store/blogs";

interface BlogFilterProps {
  onDomainSelect: (domain: string | null) => void;
  selectedDomain: string | null;
}

export default function BlogFilter({ onDomainSelect, selectedDomain }: BlogFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { approvedBlogsWithDomains } = useBlogStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get unique domains from approved blogs
  const uniqueDomains = Array.from(
    new Set(approvedBlogsWithDomains.map(blog => blog.domain))
  ).sort();

  const handleDomainSelect = (domain: string) => {
    if (selectedDomain === domain) {
      // If clicking the same domain, clear the filter
      onDomainSelect(null);
    } else {
      // Select the new domain
      onDomainSelect(domain);
    }
    setIsOpen(false);
  };

  const clearFilter = () => {
    onDomainSelect(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          selectedDomain 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
        title={selectedDomain ? `Filtered by: ${selectedDomain}` : "Filter by domain"}
      >
        <ListFilter size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Filter by Domain</h3>
            {selectedDomain && (
              <button
                onClick={clearFilter}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Clear filter"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Domain List */}
          <div className="max-h-60 overflow-y-auto">
            {uniqueDomains.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No domains available
              </div>
            ) : (
              uniqueDomains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleDomainSelect(domain)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedDomain === domain
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{domain}</span>
                    {selectedDomain === domain && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Clear Filter Option */}
          {selectedDomain && (
            <div className="p-2 border-t border-border">
              <button
                onClick={clearFilter}
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 