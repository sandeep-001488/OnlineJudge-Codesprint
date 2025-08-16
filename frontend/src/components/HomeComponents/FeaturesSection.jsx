export default function FeaturesSection({
  features,
  activeFeature,
  setActiveFeature,
}) {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
            Why Developers Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CodeSprint
            </span>
          </h2>
          <p className="text-xl text-gray-400 dark:text-gray-500">
            Next-generation features that set us apart
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer group ${
                activeFeature === index
                  ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-500/50 dark:border-blue-400/30 scale-105"
                  : "bg-white/5 dark:bg-gray-800/20 border-white/10 dark:border-gray-800/30 hover:bg-white/10 dark:hover:bg-gray-800/30"
              }`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300 ${
                  activeFeature === index
                    ? `bg-gradient-to-r ${feature.color} text-white scale-110`
                    : "bg-white/10 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 group-hover:bg-white/20 dark:group-hover:bg-gray-800/50"
                }`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
