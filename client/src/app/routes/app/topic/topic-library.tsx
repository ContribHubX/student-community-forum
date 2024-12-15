import { Navbar } from "@/components/shared/navbar";
import { TopicResource } from "@/features/topic/components/topic-resource";
import {
  TrendingTopics,
  FeaturedExperts,
  Newsletter,
} from "@/features/topic/components/trend";

export const TopicLibraryRoute = () => {
  return (
    <div >
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-primary mt-10">
        <header className="text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Discover. Learn. Grow.</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore our vast library of topics and expand your knowledge with
              expert resources.
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16">
          <TopicResource />
          <section className="mt-24 text-primary-foreground">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Trending Topics
            </h2>
            <TrendingTopics />
          </section>
          <section className="mt-24 text-primary-foreground">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Experts
            </h2>
            <FeaturedExperts />
          </section>
          <section className="mt-24">
            <Newsletter />
          </section>
        </main>
        <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-24">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
