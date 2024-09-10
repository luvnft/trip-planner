import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  PROMPT,
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { chatSession } from "@/Service/AiModel";

import { LogInContext } from "@/Context/LogInContext/Login";

import { db } from "@/Service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { user, loginWithPopup, isAuthenticated } = useContext(LogInContext);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const SignIn = async () => {
    loginWithPopup();
  };

  const SaveUser = async () => {
    const User = JSON.parse(localStorage.getItem("User"));
    const id = User?.email;
    await setDoc(doc(db, "Users", id), {
      userName: User?.name,
      userEmail: User?.email,
      userPicture: User?.picture,
      userNickname: User?.nickname,
    });
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem("User", JSON.stringify(user));
      SaveUser();
    }
  }, [user]);

  const SaveTrip = async (TripData) => {
    const User = JSON.parse(localStorage.getItem("User"));
    const id = Date.now().toString();
    setIsLoading(true);
    await setDoc(doc(db, "Trips", id), {
      tripId: id,
      userSelection: formData,
      tripData: TripData,

      userName: User?.name,
      userEmail: User?.email,
    });
    setIsLoading(false);
    localStorage.setItem('Trip', JSON.stringify(TripData));
    navigate('/my-trips/'+id);
  };

  const generateTrip = async () => {
    if (!isAuthenticated) {
      toast("Sign In to continue", {
        icon: "⚠️",
      });
      return setIsDialogOpen(true);
    }
    if (
      !formData?.noOfDays ||
      !formData?.location ||
      !formData?.People ||
      !formData?.Budget
    ) {
      return toast.error("Please fill out every field or select every option.");
    }
    if (formData?.noOfDays > 5) {
      return toast.error("Please enter Trip Days less then 5");
    }
    if (formData?.noOfDays < 1) {
      return toast.error("Invalid number of Days");
    }
    const FINAL_PROMPT = PROMPT.replace(/{location}/g, formData?.location)
      .replace(/{noOfDays}/g, formData?.noOfDays)
      .replace(/{People}/g, formData?.People)
      .replace(/{Budget}/g, formData?.Budget);


    try {
      const toastId = toast.loading("Generating Trip", {
        icon: "✈️",
      });

      setIsLoading(true);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const trip = JSON.parse(result.response.text());
      setIsLoading(false);
      SaveTrip(trip);

      toast.dismiss(toastId);
      toast.success("Trip Generated Successfully");
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.error("Failed to generate trip. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="mt-10">
      <div className="text-center text md:text-left">
        <h2 className="text-2xl font-bold md:text-4xl">
          Share Your Travel Preferences 🌟🚀
        </h2>
        <p className="mt-3 text-sm font-medium text-gray-600">
          Help us create your perfect adventure with just a few details.
          Arvrtise Travel will generate a tailored itinerary based on your
          preferences.
        </p>
      </div>

      <div className="flex flex-col gap-10 mt-10 form md:gap-20 ">
        <div className="place">
          <h2 className="mb-3 font-semibold text-center text-md md:text-lg md:text-left">
            Where do you want to Explore? 🏖️
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            selectProps={{
              value: place,
              onChange: (place) => {
                setPlace(place);
                handleInputChange("location", place.label);
              },
            }}
          />
        </div>

        <div className="day">
          <h2 className="mb-3 font-semibold text-center text-md md:text-lg md:text-left">
            How long is your Trip? 🕜
          </h2>
          <Input
            placeholder="Ex: 2"
            type="number"
            onChange={(day) => handleInputChange("noOfDays", day.target.value)}
          />
        </div>

        <div className="budget">
          <h2 className="mb-3 font-semibold text-center text-md md:text-lg md:text-left">
            What is your Budget? 💳
          </h2>
          <div className="grid grid-cols-1 gap-5 cursor-pointer options md:grid-cols-3">
            {SelectBudgetOptions.map((item) => {
              return (
                <div
                  onClick={(e) => handleInputChange("Budget", item.title)}
                  key={item.id}
                  className={`option transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-lg
                  ${formData?.Budget == item.title && "border-black shadow-xl"}
                  `}
                >
                  <h3 className="font-bold text-[15px] md:font-[18px]">
                    {item.icon} {item.title} :
                  </h3>
                  <p className="font-medium text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="people">
          <h2 className="mb-3 font-semibold text-center text-md md:text-lg md:text-left">
            Who are you traveling with? 🚗
          </h2>
          <div className="grid grid-cols-1 gap-5 cursor-pointer options md:grid-cols-3">
            {SelectNoOfPersons.map((item) => {
              return (
                <div
                  onClick={(e) => handleInputChange("People", item.no)}
                  key={item.id}
                  className={`option transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-lg
                    ${
                      formData?.People == item.no &&
                      "border border-black shadow-xl"
                    }
                  `}
                >
                  <h3 className="font-bold text-[15px] md:font-[18px]">
                    {item.icon} {item.title} :
                  </h3>
                  <p className="font-medium text-gray-500">{item.desc}</p>
                  <p className="text-sm font-normal text-gray-500">{item.no}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full h-32 create-trip-btn">
        <Button disabled={isLoading} onClick={generateTrip}>
          {isLoading ? (
            <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
          ) : (
            "Plan A Trip"
          )}
        </Button>
      </div>

      <Dialog
        className="m-4"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {user ? "Thank you for LogIn" : "Sign In to Continue"}
            </DialogTitle>
            <DialogDescription>
              <span className="flex gap-2">
                <span>
                  {user
                    ? "Logged In Securely to Arvrtise Travel with Google Authentication"
                    : "Sign In to Arvrtise Travel with Google Authentication Securely"}
                </span>
              </span>
              {user ? (
                ""
              ) : (
                <Button
                  onClick={SignIn}
                  className="flex items-center justify-center w-full gap-2 mt-5"
                >
                  Sign In with <FcGoogle className="w-5 h-5" />
                </Button>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="w-full">
              <DialogClose>Close</DialogClose>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
