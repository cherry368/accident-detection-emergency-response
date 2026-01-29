"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import GridContainer from "@/components/layouts/GridContainer";
import { Button } from "@/components/ui/button";
import { sendQuickMail } from "@/actions/quick-mail";
import { rescueTeamLists } from "@/datas/rescueTeams";

// Dynamically load map (no SSR)
const CustomMap = dynamic(() => import("@/components/misc/CustomMap"), {
  ssr: false,
});

type Props = {
  params: {
    accidentId: string;
  };
};

export default function SingleAccidentPage({ params }: Props) {
  const [checkedItems, setCheckedItems] = useState(rescueTeamLists);
  const [allChecked, setAllChecked] = useState(false);

  const { handleSubmit } = useForm();

  /* ---------------- FETCH SINGLE ACCIDENT ---------------- */
  const {
    data: singleAccident,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accident", params.accidentId],
    queryFn: async () => {
      const res = await fetch(
        `http://127.0.0.1:8080/api/v1/accident/${params.accidentId}`
      );
      return res.json();
    },
  });

  /* ---------------- CHECKBOX HANDLERS ---------------- */
  const handleCheckAll = () => {
    const updated = checkedItems.map((item) => ({
      ...item,
      isChecked: !allChecked,
    }));
    setCheckedItems(updated);
    setAllChecked(!allChecked);
  };

  const handleCheckboxChange = (id: string) => {
    const updated = checkedItems.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setCheckedItems(updated);
  };

  useEffect(() => {
    const everyChecked = checkedItems.every((item) => item.isChecked);
    setAllChecked(everyChecked);
  }, [checkedItems]);

  /* ---------------- QUICK MAIL ---------------- */
  const onSubmit = async () => {
  const { latitude, longitude, address, severity } =
    singleAccident?.data || {};

  const response = await sendQuickMail({
    checkedItems,
    latitude,
    longitude,
    address,
    severity, // ✅ IMPORTANT
  });

  if (response.success) {
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
};

  if (isLoading) return <p className="p-5">Loading...</p>;
  if (error || !singleAccident?.data)
    return <p className="p-5">Failed to load accident data</p>;

  const data = singleAccident.data;

  /* ---------- DEBUG (OPTIONAL – REMOVE LATER) ---------- */
  console.log("Accident Image URL:", data.image_url);

  // Default fallback image (ALWAYS EXISTS)
  const fallbackImage =
    "https://via.placeholder.com/1000x600?text=Accident+Image+Unavailable";

  return (
    <section className="space-y-10">
      {/* ---------------- RESCUE TEAM ---------------- */}
      <fieldset className="border-4 border-dashed rounded-md p-5">
        <legend className="text-xl sm:text-2xl font-bold underline">
          Rescue Team
        </legend>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
        >
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleCheckAll}
                className="w-5 h-5"
              />
              <span>All</span>
            </label>

            {checkedItems.map((team) => (
              <label key={team.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={team.isChecked}
                  onChange={() => handleCheckboxChange(team.id)}
                  className="w-5 h-5"
                />
                <span>{team.name}</span>
              </label>
            ))}
          </div>

          <Button className="sm:ml-auto">Quick Mail</Button>
        </form>
      </fieldset>

      {/* ---------------- ACCIDENT DETAILS ---------------- */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold underline pb-5">
          Accident Details
        </h2>

        <GridContainer>
          <InfoCard title="Address" value={data.address} />
          <InfoCard title="Longitude" value={data.longitude} />
          <InfoCard title="Latitude" value={data.latitude} />
          <InfoCard title="Severity" value={data.severity} />
          <InfoCard
            title="Severity In Percentage"
            value={`${data.severityInPercentage} %`}
          />
          <InfoCard
            title="Date"
            value={new Date(data.date).toLocaleString()}
          />
        </GridContainer>
      </div>

      {/* ---------------- MAP ---------------- */}
      <div>
        <CustomMap />
      </div>

      {/* ---------------- ACCIDENT IMAGE ---------------- */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold underline pb-4">
          Accident Image
        </h2>

        {/* ALWAYS RENDER IMAGE BOX */}
        <img
          src={data.image_url || fallbackImage}
          alt="Accident"
          className="w-full max-h-[500px] object-cover rounded-md border shadow"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        <p className="text-sm text-gray-500 mt-2">
          Accident snapshot captured from surveillance footage
        </p>
      </div>
    </section>
  );
}

/* ---------------- SMALL INFO CARD ---------------- */
function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white shadow-sm p-5 break-all rounded-md">
      <h3 className="font-bold text-lg underline pb-1">{title}</h3>
      <p>{value}</p>
    </div>
  );
}
