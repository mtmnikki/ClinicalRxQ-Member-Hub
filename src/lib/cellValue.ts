/**
 * cellValue utilities
 * - Purpose: Convert unknown values into safe, readable strings for rendering in JSX.
 * - Used by: components/common/SafeText
 */

 /**
  * Convert an unknown value to a readable string without throwing.
  * - Returns null when no sensible string can be derived (so callers can show a fallback).
  * - Handles primitives, dates, arrays, and plain objects.
  * - Avoids circular reference errors during JSON.stringify.
  */
 export function toReadableString(value: unknown, opts: { maxLen?: number } = {}): string | null {
   const maxLen = typeof opts.maxLen === 'number' ? Math.max(0, opts.maxLen) : undefined;

   // Nullish -> no content
   if (value === null || value === undefined) return null;

   // Primitives
   const t = typeof value;
   if (t === 'string') return applyLimit(value as string, maxLen);
   if (t === 'number' || t === 'boolean' || t === 'bigint') return String(value);

   // Date
   if (value instanceof Date) {
     return value.toLocaleString();
   }

   // Array -> join mapped strings
   if (Array.isArray(value)) {
     const parts: string[] = [];
     for (const v of value) {
       const s = toReadableString(v, opts);
       if (s !== null && s !== undefined) parts.push(s);
     }
     return parts.length ? applyLimit(parts.join(', '), maxLen) : null;
   }

   // React element (heuristic) -> do not stringify
   if (isProbablyReactElement(value)) {
     return null;
   }

   // Plain object
   if (isPlainObject(value)) {
     // Prefer common human-friendly fields if present
     const obj = value as Record<string, unknown>;
     for (const key of ['title', 'name', 'label', 'value']) {
       const v = obj[key];
       if (typeof v === 'string' && v.trim().length > 0) return applyLimit(v, maxLen);
       if (typeof v === 'number' || typeof v === 'boolean') return String(v);
     }

     // JSON stringify with circular guard
     try {
       const seen = new WeakSet<object>();
       const json = JSON.stringify(
         obj,
         (k, v) => {
           if (typeof v === 'object' && v !== null) {
             if (seen.has(v)) return '[Circular]';
             seen.add(v);
           }
           return v;
         },
         0
       );
       return json ? applyLimit(json, maxLen) : null;
     } catch {
       // Fallback to Object.prototype.toString
       try {
         return Object.prototype.toString.call(value);
       } catch {
         return null;
       }
     }
   }

   // Fallback
   try {
     return applyLimit(String(value), maxLen);
   } catch {
     return null;
   }
 }

 /**
  * Determine if a value is a plain object (not null, array, or special class).
  */
 function isPlainObject(v: unknown): v is Record<string, unknown> {
   if (Object.prototype.toString.call(v) !== '[object Object]') return false;
   // Some objects may have null prototype; accept those as plain
   const proto = Object.getPrototypeOf(v);
   return proto === null || proto === Object.prototype;
 }

 /**
  * Heuristic for React elements to avoid rendering "[object Object]" etc.
  */
 function isProbablyReactElement(v: unknown): boolean {
   // React attaches $$typeof and props fields on elements
   return !!(v && typeof v === 'object' && (v as any).$$typeof && (v as any).props);
 }

 /**
  * Apply optional maximum length to a string, adding ellipsis if truncated.
  */
 function applyLimit(s: string, maxLen?: number): string {
   if (!maxLen || s.length <= maxLen) return s;
   if (maxLen <= 1) return '…';
   return s.slice(0, Math.max(0, maxLen - 1)) + '…';
 }