import api from "./axios";

export const fetchGroups = async () => {
  const res = await api.get("/data/groups");
  return res.data.groups;
};

export const joinGroup = async (groupId) => {
  const res = await api.post(`/data/groups/${groupId}/join`);
  return res.data;
};


export const createGroup = async (data) => {
  const res = await api.post("/data/groups", data);
  return res.data;
};