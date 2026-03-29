import StatsCard from "../../../conponents/stats/statsCard";
import { IoMdPeople } from "react-icons/io";
import { FaChalkboardTeacher, FaClipboardList, FaTrophy } from "react-icons/fa";

export default function AdminPage() {
  const cardItems = [
    { title: "Total Siswa", icon: IoMdPeople, value: "120" },
    { title: "Total Guru", icon: FaChalkboardTeacher, value: "30" },
    { title: "Data Kriteria", icon: FaClipboardList, value: "8" },
    { title: "Data Ranking", icon: FaTrophy, value: "120" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {cardItems.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}
