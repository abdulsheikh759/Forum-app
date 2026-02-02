import CreateGroupModal from "../Components/CreateGroupModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../ContextApi/AuthContext";
import { fetchGroups, joinGroup, createGroup } from "../lib/groupApi";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState([]);

    // controlled form state
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await fetchGroups();
                setGroups(data);
                console.log(data);
            } catch {
                toast.error("Failed to load groups");
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    //  CREATE GROUP
    const handleCreateGroup = async () => {
        if (!groupName || !description) {
            toast.error("All fields are required");
            return;
        }

        try {
            const res = await createGroup({
                name: groupName,
                description,
            });

            toast.success("Group created");

            setGroups((prev) => [...prev, res.group]);

            // reset + close
            setGroupName("");
            setDescription("");
            setShowModal(false);

        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Group creation failed"
            );
        }
    };

    const handleGroupClick = async (groupId) => {
  try {
    await joinGroup(groupId);

    navigate(`/group/${groupId}`);

  } catch (error) {
    const msg = error.response?.data?.message;
    if (
      msg === "Already a member" ||
      msg === "You have already joined this group"
    ) {
      navigate(`/group/${groupId}`);
      return;
    }
    toast.error(msg || "Unable to open group");
  }
};

    return (
        <div className="min-h-screen flex bg-[#212121] text-white">

            {/* LEFT SIDEBAR */}
            <div className="w-64 bg-[#1a1a1a] border-r border-gray-700 p-4 overflow-y-auto">

                <h2 className="text-lg font-semibold mb-4">Groups</h2>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium mb-4"
                >
                    + Create Group
                </button>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : groups.length === 0 ? (
                    <p className="text-sm text-gray-400">No groups yet</p>
                ) : (
                    <div className="space-y-3">
                        {groups.map((group) => {
                            const isMember = group.members?.includes(user?._id);
                            
                            return (
                                <div
                                    key={group._id}
                                    className="bg-[#2a2a2a] p-3 rounded-md"
                                >
                                    <h3 className="font-medium">{group.name}</h3>
                                    <p className="text-xs text-gray-400 mb-2">
                                        {group.description}
                                    </p>

                                    {isMember ? (
                                        <button
                                            onClick={() => navigate(`/group/${group._id}`)}
                                            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                                        >
                                            Open Group
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleGroupClick(group._id)}
                                            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
                                        >
                                            Join Group
                                        </button>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 p-6"></div>

            {showModal && (
                <CreateGroupModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreateGroup}
                    groupName={groupName}
                    setGroupName={setGroupName}
                    description={description}
                    setDescription={setDescription}
                />
            )}
        </div>
    );
}
