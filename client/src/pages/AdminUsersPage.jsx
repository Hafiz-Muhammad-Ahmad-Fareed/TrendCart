import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Search,
} from "lucide-react";
import useAdminStore from "../stores/useAdminStore";
import SummaryCard from "../components/SummaryCard";

const AdminUsersPage = () => {
  const {
    users,
    isUsersLoading,
    isUpdatingUser,
    isDeleting,
    fetchUsers,
    updateUserRole,
    deleteUser,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Derived state: Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || email.includes(search);
    });
  }, [users, searchTerm]);

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const confirmed = window.confirm(
      `Are you sure you want to change ${user.fullName || user.email}'s role to ${newRole}?`,
    );

    if (confirmed) {
      await updateUserRole(user._id, newRole);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user ${userName}? This action cannot be undone.`,
    );

    if (confirmed) {
      await deleteUser(userId);
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
          <Users size={24} />
        </div>
        <h2 className="text-3xl font-bold">Manage Users</h2>
      </div>

      <div className="flex flex-col sm:items-center sm:flex-row justify-between">
        {/* Stats */}
        {stats.map((stat) => (
          <div key={stat.label} className="w-full sm:w-64 mb-5 sm:mb-0">
            <SummaryCard
              title={stat.label}
              value={stat.value}
              icon={<stat.icon size={20} className="text-white" />}
              color={stat.color}
              bgColor="bg-gradient-to-r"
              isLoading={isUsersLoading}
            />
          </div>
        ))}

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pr-4 pl-10 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none sm:w-80"
          />
        </div>
      </div>

      <section className="rounded-3xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-center">Joined</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isUsersLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400 italic"
                  >
                    {searchTerm
                      ? `No users found matching "${searchTerm}"`
                      : "No users found."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-gray-800/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-700">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <UserIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="font-medium text-white">
                          {user.fullName || "Unnamed User"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-blue-500/15 text-blue-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400 text-center">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={isUpdatingUser}
                          title={`Change to ${user.role === "admin" ? "user" : "admin"}`}
                          className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-gray-400 transition hover:border-emerald-500 hover:text-emerald-300 disabled:opacity-30"
                        >
                          <ShieldCheck size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(
                              user._id,
                              user.fullName || user.email,
                            )
                          }
                          disabled={isDeleting}
                          title="Delete user"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition hover:border-red-500/50 hover:text-red-400 disabled:opacity-30"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminUsersPage;
