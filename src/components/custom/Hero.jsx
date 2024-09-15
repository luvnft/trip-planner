import React, { useContext } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { LogInContext } from "@/Context/LogInContext/Login";

function Hero() {
  const { isAuthenticated } = useContext(LogInContext);
  return (
    <div className="flex flex-col items-center justify-center h-auto text-center">
      <div className="flex flex-col items-center justify-center gap-4 px-10 text md:px-40">
        <div className="heading">
          <h1 className="font-extrabold text-3xl md:text-[50px] leading-tight text-orange-500">
            Arvrtise Travel
          </h1>
          <h3 className="font-extrabold opacity-70 text-xl md:text-[40px] leading-tight">
            Create Itineraries Based On Your Budget
          </h3>
        </div>
        <div className="mt-5 desc">
          <h5 className="text-[15px] md:text-2xl font-semibold opacity-40">
            Your trusted trip planner and adventure guide sparking thrilling
            journeys with personalized travel plans designed to match your
            passions and preferences.
          </h5>
        </div>
        <div className="button">
          <Link to="/plan-a-trip">
            <Button className="">
              {isAuthenticated
                ? "Let's Make Another Trip"
                : "Plan a Trip, It's Free"}
            </Button>
          </Link>
        </div>
      </div>
      <div className="img">
        <img src="/travel.png" className="" alt="" />
      </div>
    </div>
  );
}

export default Hero;
