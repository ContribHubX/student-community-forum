import cover from "@/assets/590-removebg-preview.png";
import { LoginForm } from "@/features/auth/components/login-form";
import { Link } from "react-router-dom";

export const LoginRoute = () => {
  return (
    <section
      className="h-screen w-screen bg-accent p-2 flex gap-5 justify-center
    md:p-4"
    >
      {/* COVER PHOTO SECTION */}
      <div
        className="hidden w-full flex-grow place-content-center
      lg:grid"
      >
        <img src={cover} alt="" /> {/* picture here*/}
        {/* adjust lang kung gamay ra ang picture */}
      </div>
      {/* COVER PHOTO SECTION ENDS*/}

      {/* LOGIN SECTION */}
      <div
        className="bg-white rounded-md p-5 flex flex-col justify-between
        w-[500px] sm:p-10 lg:w-[650px] lg:p-14"
      >
        <div className="flex flex-col items-center">
          <div className="text-center w-full space-y-5">
            <div>{/* logo here */}</div>

            <div className="space-y-2">
              <p className="font-medium text-2xl">Welcome to CampusConnex!</p>
              <p className="font-light text-sm text-[#808080]">
                Please enter your details
              </p>
            </div>
          </div>

          <LoginForm />
          {/* <TestLogin /> */}
        </div>

        <p className="text-center font-light text-base">
          Dont have an account?{" "}
          <Link to="">
            <strong>Sign up</strong>
          </Link>
        </p>
      </div>

      {/* LOGIN SECTION */}
    </section>
  );
};
