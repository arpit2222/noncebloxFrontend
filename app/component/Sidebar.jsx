import { useUser } from "@/context/UserContext";  // Importing the context

const Sidebar = ({user}) => {// Access user data from context

  return (
    <div className="w-[20%] bg-gray-800 text-white h-screen p-4 flex flex-col">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <p className="bg-gray-100 w-[100px] h-[100px] rounded-full text-4xl text-black text-center pt-6">{user?.username[0]}</p>
        <h3 className="text-xl font-semibold">{user?.username || "Guest"}</h3>
        <p className="text-sm text-gray-400">{user?.email || "No email"}</p>
      </div>

    </div>
  );
};

export default Sidebar;
