"use client";
import {
  GroupSelectionComponent,
  GroupSelectionProps,
} from "@/components/group-selection";

function RoundsOverviewTemplate() {
  const groups = [
    {
      card: 1,
      players: [{ name: "Andreas" }, { name: "Anne" }, { name: "John" }],
    },
    {
      card: 2,
      players: [
        { name: "Emily" },
        { name: "Michael" },
        { name: "Sarah" },
        { name: "David" },
      ],
    },
    {
      card: 3,
      players: [
        { name: "Sophia" },
        { name: "James" },
        { name: "Olivia" },
        { name: "Emma" },
        { name: "Noah" },
      ],
    },
    {
      card: 4,
      players: [
        { name: "Liam" },
        { name: "Mason" },
        { name: "Ava" },
        { name: "Lucas" },
        { name: "Mia" },
        { name: "Charlotte" },
      ],
    },
    {
      card: 5,
      players: [{ name: "Amelia" }, { name: "Isabella" }, { name: "Ethan" }],
    },
  ];
  console.log("RoundsOverviewTemplate", groups);
  return <GroupSelectionComponent groups={groups} />;
}

export default RoundsOverviewTemplate;
