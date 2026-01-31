export default function CreateGroupModal({
  onClose,
  onCreate,
  groupName,
  setGroupName,
  description,
  setDescription,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] rounded-lg p-6 text-white">

        <h2 className="text-xl font-bold mb-4">Create Group</h2>

        <div className="mb-4">
          <label className="text-sm block mb-1">Group Name</label>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#212121] border border-gray-600"
            placeholder="Group name"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 rounded-md bg-[#212121] border border-gray-600"
            placeholder="Group description"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 rounded-md"
          >
            Create Group
          </button>
        </div>

      </div>
    </div>
  );
}
