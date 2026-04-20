import { useEffect } from "react";
import { Users, Trash2, ShieldCheck, User as UserIcon } from "lucide-react";
import useAdminStore from "../stores/useAdminStore";

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Manage Users</h2>
            <p className="text-sm text-gray-400">
              View and manage registered users, update roles, or remove
              accounts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-sm font-medium text-gray-400">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    No user found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={isUpdatingUser}
                          title={`Change to ${user.role === "admin" ? "user" : "admin"}`}
                          className="rounded-xl border border-gray-700 p-2 text-gray-400 transition hover:border-emerald-500 hover:text-emerald-300 disabled:opacity-50"
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
                          className="rounded-xl border border-gray-700 p-2 text-gray-400 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
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
