import { useForm, FieldValues, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCommunitySchema,
  CreateCommunityType,
  useCreateCommunity,
} from "@/features/community/api/create-community";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface CommunityFormProps {
  userId: string;
  handleCommunityModal: () => void;
}

export const CommunityForm = ({
  userId,
  handleCommunityModal,
}: CommunityFormProps) => {
  const navigate = useNavigate();

  const { mutate: createCommunity, isPending } = useCreateCommunity({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success(data.message);
        handleCommunityModal();
        navigate(`/community/${data.community.id}`);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      },
    },
  });

  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateCommunityType>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      communityName: "",
      description: "",
      banner: null,
      icon: null,
    },
  });

  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("name", data.communityName);
    formData.append("description", data.description);
    formData.append("createdBy", userId);
    formData.append("banner", data.banner);
    formData.append("icon", data.icon);

    console.log("form", formData);
    createCommunity(formData);
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["communityName", "description"]);
      if (!isValid) {
        return; // Stop progression to the next step
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      return;
    }

    handleCommunityModal();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "banner" | "icon",
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setValue(field, file);
  };

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <StepTitle step={step} />

      <div className="flex gap-4 items-start">
        {step === 1 && (
          <CommunityInfoForm register={register} errors={errors} />
        )}

        {step === 2 && (
          <motion.div
            className="flex flex-col flex-grow gap-4 self-center justify-center "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ImageUploadField
              label="Banner"
              handleFileChange={(e) => handleFileChange(e, "banner")}
            />
            <ImageUploadField
              label="Icon"
              handleFileChange={(e) => handleFileChange(e, "icon")}
            />
          </motion.div>
        )}

        <CommunityPreview createdCommunity={values} />
      </div>

      <div className="self-end space-x-2 text-sm">
        <Button onClick={prevStep} type="button" className="bg-container px-5">
          Back
        </Button>

        {step === 2 ? (
          <Button
            type="submit"
            disabled={isPending}
            className="px-5 text-accent-foreground"
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault();
              nextStep();
            }}
            type="button"
            className="px-5 text-accent-foreground"
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
};

const CommunityInfoForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<CreateCommunityType>;
  errors: any;
}) => {
  return (
    <div className="w-full flex gap-5">
      <div className="flex-grow flex flex-col gap-4">
        <div className="space-y-2">
          {errors.communityName && (
            <p className="text-red-500 text-sm">
              {errors.communityName.message}
            </p>
          )}
          <input
            type="text"
            {...register("communityName")}
            placeholder="Community Name"
            className={`w-full px-5 py-3 bg-container rounded-xl outline-none ${
              errors.communityName ? "border-red-500" : ""
            }`}
          />
        </div>

        <div className="space-y-2">
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
          <textarea
            {...register("description")}
            placeholder="Description"
            className={`w-full p-5 bg-container h-44 rounded-xl outline-none placeholder-top-left resize-none ${
              errors.description ? "border-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const ImageUploadField = ({
  label,
  handleFileChange,
}: {
  label: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="flex justify-between">
      <p>{label}</p>
      <div
        className="relative flex items-center bg-container p-2 rounded-md gap-2 cursor-pointer"
        onClick={handleDivClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden absolute w-full bg-slate-500"
          onChange={handleFileChange}
        />
        <FaImages />
        <p className="text-xs">Add</p>
      </div>
    </div>
  );
};

const StepTitle = ({ step }: { step: number }) => {
  const titles = [
    {
      id: 1,
      title: "Tell us about your community",
      description:
        "A name and description provide clarity about the purpose and focus of your community.",
    },
    {
      id: 2,
      title: "Style your community",
      description:
        "Adding visual flair will catch new members' attention and help establish your community’s culture! You can update this at any time.",
    },
  ];

  return (
    <div>
      <h1 className="font-bold text-xl">{titles[step - 1]?.title}</h1>
      <p className="text-xs font-light">{titles[step - 1]?.description}</p>
    </div>
  );
};

const CommunityPreview = ({
  createdCommunity,
}: {
  createdCommunity: CreateCommunityType;
}) => {
  const iconUrl = createdCommunity.icon
    ? URL.createObjectURL(createdCommunity.icon)
    : null;

  const bannerUrl = createdCommunity.banner
    ? URL.createObjectURL(createdCommunity.banner)
    : null;

  return (
    <div className="w-[40%] flex flex-col flex-shrink-0 h-auto bg-background rounded-xl">
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt=""
          className="rounded-t-xl
      h-24"
        />
      )}
      <div className="p-4 space-y-4">
        <div className="flex gap-2 items-center">
          {iconUrl && (
            <img
              src={iconUrl}
              alt="Community Icon"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-bold text-lg break-words">
              c/{createdCommunity.communityName || "communityname"}
            </p>
            <p className="text-muted-foreground text-xs font-light">1 member</p>
          </div>
        </div>
        <p className="break-words text-sm">
          {createdCommunity.description || "Your community description"}
        </p>
      </div>
    </div>
  );
};
