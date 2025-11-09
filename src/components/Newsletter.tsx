// components/Newsletter.tsx
'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold">Ready to Get Our New Stuff?</h3>
          <p className="mt-2 text-sm text-gray-200 max-w-md">
            Stuffus for Homes and Needs — We&apos;ll listen to your needs, identify the best approach, and create a bespoke solution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full px-4 py-2 text-gray-900 w-full md:w-72"
              placeholder="Your Email"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-gray-900 rounded-full px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
          {message && (
            <p className={`text-sm ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
