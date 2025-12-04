import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const UsersManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await axios.get("/admin/getUsers", {
      withCredentials: true,
    });

    const filtered = res.data.filter((u) => u.role !== "admin");
    setUsers(filtered);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (userId, isActive) => {
    try {
      await axios.patch(
        `/users/${userId}/toggle-active`,
        { isActive: !isActive },
        { withCredentials: true }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, isActive: !isActive } : u
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  return (
    <section className="min-h-screen bg-gray-50 py-8 font-grotesk">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">Manage Users</h1>

        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No users found</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center text-sm text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 wrap-break-word">{user.name}</td>
                      <td className="px-4 py-3 wrap-break-word">{user.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            handleToggleActive(user._id, user.isActive)
                          }
                          className={`px-4 py-2 text-xs rounded-lg text-white font-semibold transition ${
                            user.isActive
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {user.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card UI */}
            <div className="sm:hidden space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col gap-2"
                >
                  <p className="text-base font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-700 wrap-break-word">
                    {user.email}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>

                    <button
                      onClick={() =>
                        handleToggleActive(user._id, user.isActive)
                      }
                      className={`px-3 py-2 text-xs rounded-lg text-white font-semibold transition ${
                        user.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {user.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UsersManage;
