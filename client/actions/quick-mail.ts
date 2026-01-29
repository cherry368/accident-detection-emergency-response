"use server";

import { RescueTeam } from "@/datas/rescueTeams";

export async function sendQuickMail({
  checkedItems,
  latitude,
  longitude,
  address,
  severity,
}: {
  checkedItems: RescueTeam[];
  latitude: number;   // ✅ number, not string
  longitude: number;  // ✅ number, not string
  address: string;
  severity: string;   // ✅ required now
}) {
  try {
    // Filter selected rescue teams
    const selectedTeams = checkedItems.filter(
      (team) => team.isChecked
    );

    if (selectedTeams.length === 0) {
      console.warn("No rescue teams selected");
      return {
        success: false,
        message: "No rescue teams selected",
      };
    }

    // Call Flask backend email API
    const response = await fetch(
      "http://127.0.0.1:8080/api/v1/emails/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          location: address,
          severity, // ✅ always passed correctly
          rescueTeams: selectedTeams.map((t) => t.name),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Email API failed");
    }

    return {
      success: true,
      message: "Mail sent successfully",
    };
  } catch (error) {
    console.error("Quick mail failed:", error);
    return {
      success: false,
      message: "Mail sending failed",
    };
  }
}
