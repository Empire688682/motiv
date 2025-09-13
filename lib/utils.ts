// lib/utils.ts - Manual implementation without external dependencies

export type ClassValue = 
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;

export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

// Simple clsx implementation
function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const result = clsx(...input);
      if (result) classes.push(result);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }
  
  return classes.join(' ');
}

// Simple tailwind merge implementation
function twMerge(input: string): string {
  if (!input) return '';
  
  // Split classes and remove duplicates, keeping last occurrence
  const classes = input.split(/\s+/).filter(Boolean);
  const classMap = new Map<string, string>();
  
  for (const className of classes) {
    // Extract base class name (before modifiers like hover:, md:, etc.)
    const baseClass = className.replace(/^(hover|focus|active|disabled|sm|md|lg|xl|2xl):/g, '');
    const prefix = className.replace(baseClass, '');
    
    // For conflicting classes, keep the last one
    const key = getClassGroup(baseClass);
    if (key) {
      classMap.set(key, className);
    } else {
      classMap.set(className, className);
    }
  }
  
  return Array.from(classMap.values()).join(' ');
}

// Helper function to group conflicting Tailwind classes
function getClassGroup(className: string): string | null {
  // Common Tailwind class conflicts
  const groups: Record<string, string> = {
    // Spacing
    'm-': 'margin',
    'mt-': 'margin-top',
    'mr-': 'margin-right', 
    'mb-': 'margin-bottom',
    'ml-': 'margin-left',
    'mx-': 'margin-x',
    'my-': 'margin-y',
    'p-': 'padding',
    'pt-': 'padding-top',
    'pr-': 'padding-right',
    'pb-': 'padding-bottom', 
    'pl-': 'padding-left',
    'px-': 'padding-x',
    'py-': 'padding-y',
    
    // Display
    'block': 'display',
    'inline': 'display',
    'flex': 'display',
    'grid': 'display',
    'hidden': 'display',
    
    // Position
    'static': 'position',
    'relative': 'position',
    'absolute': 'position',
    'fixed': 'position',
    'sticky': 'position',
    
    // Colors (simplified)
    'text-': 'text-color',
    'bg-': 'background-color',
    'border-': 'border-color',
  };
  
  for (const [prefix, group] of Object.entries(groups)) {
    if (className.startsWith(prefix)) {
      return group;
    }
  }
  
  return null;
}

// Main utility function
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}