'use client';

import { useFormStatus } from 'react-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

export function SubmitButton({ text = "Log In" }: { text?: string }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-80 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
