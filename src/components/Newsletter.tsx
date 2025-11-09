// components/Newsletter.tsx
export default function Newsletter() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold">Ready to Get Our New Stuff?</h3>
          <p className="mt-2 text-sm text-gray-200 max-w-md">
            Stuffus for Homes and Needs — We'll listen to your needs, identify the best approach, and create a bespoke solution.
          </p>
        </div>

        <form className="flex items-center gap-3 w-full md:w-auto">
          <input className="rounded-full px-4 py-2 text-gray-900 w-full md:w-72" placeholder="Your Email" />
          <button className="bg-white text-gray-900 rounded-full px-5 py-2">Send</button>
        </form>
      </div>
    </section>
  );
}
