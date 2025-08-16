import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export default function TestimonialsSection({
  testimonials,
  currentTestimonial,
  setCurrentTestimonial,
}) {
  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  return (
    <section className="relative z-10 py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-400 dark:text-gray-500">
            Real success stories from our community
          </p>
        </div>
        <div className="relative">
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-800/30">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="p-3 rounded-full bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-white dark:text-gray-100" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      currentTestimonial === index
                        ? "bg-blue-500"
                        : "bg-white/30 dark:bg-gray-600/50"
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  )
                }
                className="p-3 rounded-full bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all"
              >
                <ChevronRight className="h-6 w-6 text-white dark:text-gray-100" />
              </button>
            </div>
            <div className="text-center">
              <Quote className="h-12 w-12 text-blue-400 mx-auto mb-6" />
              <p className="text-2xl text-white dark:text-gray-100 font-medium mb-8 leading-relaxed max-w-4xl mx-auto">
                "{testimonials[currentTestimonial]?.content}"
              </p>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentTestimonial]?.avatar}
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-white dark:text-gray-100">
                    {capitalizeFirstLetter(
                      testimonials[currentTestimonial]?.name
                    )}
                  </div>
                  <div className="text-blue-400">
                    {testimonials[currentTestimonial]?.role}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    {testimonials[currentTestimonial]?.university}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-1 mt-4">
                {Array.from({
                  length: testimonials[currentTestimonial]?.rating || 5,
                }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
