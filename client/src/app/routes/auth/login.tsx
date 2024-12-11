import { useState } from "react";
import { motion } from "framer-motion";
// import cover from "@/assets/590-removebg-preview.png";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignUpForm } from "@/features/auth/components/signup-form";
import { Logo } from "@/components/ui/logo";

export const LoginRoute = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-2xl overflow-hidden flex max-w-4xl w-full"
      >
        {/* COVER PHOTO SECTION */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden lg:block lg:w-1/2 bg-blue-100"
        >
          {/* <img src={cover} alt="Campus" className="object-cover w-full h-full" /> */}
        </motion.div>

        {/* LOGIN/SIGNUP SECTION */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <div className="flex flex-col items-center space-y-6">
            <Logo className="w-32 h-32 text-accent" />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 text-center"
            >
              Welcome to StudentHub
            </motion.h1>
            <p className="text-gray-600">Please enter your details</p>

            {isLogin ? <LoginForm /> : <SignUpForm />}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm text-gray-600"
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleForm}
                className="ml-1 text-blue-600 hover:underline focus:outline-none"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
