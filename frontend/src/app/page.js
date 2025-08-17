"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
  dummyPopularProblems,
  dummyTestimonials,
  features,
} from "@/data/HomeData";
import FloatingBackground from "@/components/HomeComponents/FloatingBackground";
import HeroSection from "@/components/HomeComponents/HeroSection";
import FeaturesSection from "@/components/HomeComponents/FeaturesSection";
import TestimonialsSection from "@/components/HomeComponents/TestimonialsSection";
import TrendingProblems from "@/components/HomeComponents/TrendingProblems";
import LiveActivity from "@/components/HomeComponents/LiveActivity";
import StatsSection from "@/components/HomeComponents/StatsSection";
import Footer from "@/components/HomeComponents/Footer";



export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [homeStats, setHomeStats] = useState(null);
  const [testimonials, setTestimonials] = useState(dummyTestimonials);
  const [popularProblems, setPopularProblems] = useState(dummyPopularProblems);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (
      user?.role?.includes("admin") ||
      user?.role?.includes("problemSetter")
    ) {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const statsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}feedback/home-stats`
        );
        const statsData = await statsResponse.json();

        const feedbackResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}feedback/feedbacks/recent`
        );
        const feedbackData = await feedbackResponse.json();

        if (statsData.success) {
          setHomeStats(statsData.data);
          if (
            statsData.data.recentProblems &&
            statsData.data.recentProblems.length > 0
          ) {
            setPopularProblems(statsData.data.recentProblems);
          }
        }

        if (feedbackData.success) {
          if (feedbackData.data && feedbackData.data.length > 0) {
            setTestimonials(feedbackData.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const slugify = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleProblemClick = (problemTitle, problemId) => {
    const slug = slugify(problemTitle);
    router.push(`/problems/${slug}-${problemId}`);
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 relative overflow-hidden">
      <FloatingBackground />

      <HeroSection isAdmin={isAdmin} homeStats={homeStats} router={router} />

      <FeaturesSection
        features={features}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />

      <TestimonialsSection
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
        setCurrentTestimonial={setCurrentTestimonial}
      />

      <TrendingProblems
        popularProblems={popularProblems}
        handleProblemClick={handleProblemClick}
      />

      <LiveActivity
        homeStats={homeStats}
        capitalizeFirstLetter={capitalizeFirstLetter}
      />

      <StatsSection homeStats={homeStats} />

      <Footer isAdmin={isAdmin} />
    </div>
  );
}